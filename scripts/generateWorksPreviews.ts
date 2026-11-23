import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as cheerio from "cheerio";
import yaml from "js-yaml";
import {
	fetchWithRetry,
	generateStaticPreviews,
	getErrorMessage,
	getMetaTag,
	readJson,
	type PreviewEntry,
	type PreviewMap,
} from "./previewUtils";

type WorkEntry = {
	workType?: string;
	imageUrl?: string;
	link?: string[];
};

const rootDir = process.cwd();
const worksPath = path.join(rootDir, "data", "works.yaml");
const previewPath = path.join(rootDir, "data", "works-preview.json");
const staticPreviewPath = path.join(rootDir, ".cache", "works-preview.json");
const imageDir = path.join(rootDir, "public", "generated", "works");
const refresh = process.argv.includes("--refresh");
const staticMode = process.argv.includes("--static");

const getGithubRepoFallbackImage = (url: string) => {
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

const fetchPreview = async (url: string): Promise<PreviewEntry> => {
	const response = await fetchWithRetry(url);
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}`);
	}

	const resolvedUrl = response.url || url;
	const html = await response.text();
	const $ = cheerio.load(html);
	const rawImage = getMetaTag($, "image");

	return {
		title: getMetaTag($, "title") || $("title").text().trim() || "",
		description: getMetaTag($, "description"),
		image: rawImage ? new URL(rawImage, resolvedUrl).toString() : "",
		siteName: getMetaTag($, "site_name"),
		url,
		fetchedAt: new Date().toISOString(),
	};
};

const main = async () => {
	if (staticMode) {
		await generateStaticPreviews({
			previewPath,
			staticPreviewPath,
			imageDir,
			publicPathPrefix: "/generated/works",
			label: "works",
			allowFallbackToRemote: true,
		});
		return;
	}

	const works = (yaml.load(fs.readFileSync(worksPath, "utf8")) as WorkEntry[] | null) ?? [];
	const primaryUrls = Array.from(
		new Set(
			works
				.filter((work) => !work?.imageUrl && work?.workType !== "publication")
				.map((work) => work?.link?.[0])
				.filter((url): url is string => typeof url === "string" && url.length > 0)
		)
	);

	const previews = readJson<PreviewMap>(previewPath, {});
	const nextPreviews: PreviewMap = {};

	for (const url of primaryUrls) {
		if (!refresh && previews[url]?.image && !previews[url]?.error) {
			nextPreviews[url] = previews[url];
			continue;
		}

		try {
			nextPreviews[url] = await fetchPreview(url);
			console.log(`Generated works preview: ${url}`);
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			const fallbackImage = getGithubRepoFallbackImage(url);
			if (fallbackImage) {
				nextPreviews[url] = {
					title: previews[url]?.title ?? "",
					description: previews[url]?.description ?? "",
					image: fallbackImage,
					siteName: "GitHub",
					url,
					fetchedAt: new Date().toISOString(),
					error: errorMessage,
				};
				console.warn(`Generated GitHub fallback preview: ${url} (${errorMessage})`);
				continue;
			}

			if (previews[url]) {
				nextPreviews[url] = previews[url];
				console.warn(`Kept existing works preview: ${url} (${errorMessage})`);
			} else {
				nextPreviews[url] = {
					title: "",
					description: "",
					image: "",
					siteName: "",
					url,
					fetchedAt: new Date().toISOString(),
					error: errorMessage,
				};
				console.warn(`Failed to generate works preview: ${url} (${errorMessage})`);
			}
		}
	}

	fs.writeFileSync(previewPath, `${JSON.stringify(nextPreviews, null, 2)}\n`);
};

main().catch((error: unknown) => {
	console.error(getErrorMessage(error));
	process.exitCode = 1;
});
