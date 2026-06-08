import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as cheerio from "cheerio";
import yaml from "js-yaml";

const rootDir = process.cwd();
const worksPath = path.join(rootDir, "data", "works.yaml");
const previewPath = path.join(rootDir, "data", "works-preview.json");
const refresh = process.argv.includes("--refresh");

const readJson = (filePath) => {
	if (!fs.existsSync(filePath)) return {};

	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8"));
	} catch {
		return {};
	}
};

const getMetaTag = ($, name) =>
	$(`meta[name="${name}"]`).attr("content") ||
	$(`meta[property="${name}"]`).attr("content") ||
	$(`meta[property="og:${name}"]`).attr("content") ||
	"";

const getGithubRepoFallbackImage = (url) => {
	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.hostname !== "github.com") return "";

		const [owner, repo] = parsedUrl.pathname.split("/").filter(Boolean);
		if (!owner || !repo) return "";

		return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
	} catch {
		return "";
	}
};

const fetchPreview = async (url) => {
	const response = await fetch(url, {
		headers: {
			"User-Agent": "bot-crawler",
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}`);
	}

	const html = await response.text();
	const $ = cheerio.load(html);
	const rawImage = getMetaTag($, "image");

	return {
		title: getMetaTag($, "title") || $("title").text() || "",
		description: getMetaTag($, "description"),
		image: rawImage ? new URL(rawImage, url).toString() : "",
		siteName: getMetaTag($, "site_name"),
		url,
		fetchedAt: new Date().toISOString(),
	};
};

const works = yaml.load(fs.readFileSync(worksPath, "utf8")) ?? [];
const primaryUrls = Array.from(
	new Set(
		works
			.filter((work) => !work?.imageUrl)
			.map((work) => work?.link?.[0])
			.filter((url) => typeof url === "string" && url.length > 0)
	)
);

const previews = readJson(previewPath);
const nextPreviews = {};

for (const url of primaryUrls) {
	if (!refresh && previews[url]?.image) {
		nextPreviews[url] = previews[url];
		continue;
	}

	try {
		nextPreviews[url] = await fetchPreview(url);
		console.log(`Generated preview: ${url}`);
	} catch (error) {
		const fallbackImage = getGithubRepoFallbackImage(url);
		if (fallbackImage) {
			nextPreviews[url] = {
				title: previews[url]?.title ?? "",
				description: previews[url]?.description ?? "",
				image: fallbackImage,
				siteName: "GitHub",
				url,
				fetchedAt: new Date().toISOString(),
				error: error.message,
			};
			console.warn(`Generated GitHub fallback preview: ${url} (${error.message})`);
			continue;
		}

		if (previews[url]) {
			nextPreviews[url] = previews[url];
			console.warn(`Kept existing preview: ${url} (${error.message})`);
		} else {
			nextPreviews[url] = {
				title: "",
				description: "",
				image: "",
				siteName: "",
				url,
				fetchedAt: new Date().toISOString(),
				error: error.message,
			};
			console.warn(`Failed to generate preview: ${url} (${error.message})`);
		}
	}
}

fs.writeFileSync(previewPath, `${JSON.stringify(nextPreviews, null, 2)}\n`);
