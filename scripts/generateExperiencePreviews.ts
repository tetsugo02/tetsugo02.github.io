import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";

type CareerItem = {
	url?: string;
};

type HomeLocale = {
	bio?: {
		career?: CareerItem[];
	};
};

type ExperiencePreview = {
	title: string;
	description: string;
	image: string;
	siteName: string;
	url: string;
	fetchedAt: string;
	error?: string;
};

type ExperiencePreviewMap = Record<string, ExperiencePreview>;

const rootDir = process.cwd();
const previewPath = path.join(rootDir, "data", "experience-preview.json");
const localePaths = [
	path.join(rootDir, "i18n", "locales", "en", "home.json"),
	path.join(rootDir, "i18n", "locales", "ja", "home.json"),
];
const refresh = process.argv.includes("--refresh");

const readJson = <T>(filePath: string, fallback: T): T => {
	if (!fs.existsSync(filePath)) return fallback;

	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
	} catch {
		return fallback;
	}
};

const getMetaTag = ($: CheerioAPI, name: string) =>
	$(`meta[property="og:${name}"]`).attr("content") ||
	$(`meta[name="twitter:${name}"]`).attr("content") ||
	$(`meta[name="${name}"]`).attr("content") ||
	"";

const getErrorMessage = (error: unknown) =>
	error instanceof Error ? error.message : String(error);

const fetchPreview = async (url: string): Promise<ExperiencePreview> => {
	const pageResponse = await fetch(url, {
		headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioPreviewBot/1.0)" },
		redirect: "follow",
	});

	if (!pageResponse.ok) throw new Error(`Page returned HTTP ${pageResponse.status}`);

	const $ = cheerio.load(await pageResponse.text());
	const rawImage = getMetaTag($, "image");
	if (!rawImage) throw new Error("No Open Graph image was found");

	return {
		title: getMetaTag($, "title") || $("title").text().trim(),
		description: getMetaTag($, "description"),
		image: new URL(rawImage, pageResponse.url || url).toString(),
		siteName: getMetaTag($, "site_name"),
		url,
		fetchedAt: new Date().toISOString(),
	};
};

const main = async () => {
	const urls = Array.from(
		new Set(
			localePaths.flatMap((localePath) => {
				const locale = readJson<HomeLocale>(localePath, {});
				return (locale.bio?.career ?? [])
					.map((item) => item.url)
					.filter((url): url is string => typeof url === "string" && url.length > 0);
			})
		)
	);

	const previews = readJson<ExperiencePreviewMap>(previewPath, {});
	const nextPreviews: ExperiencePreviewMap = {};

	for (const url of urls) {
		if (!refresh && previews[url]?.image) {
			nextPreviews[url] = previews[url];
			continue;
		}

		try {
			nextPreviews[url] = await fetchPreview(url);
			console.log(`Generated experience preview: ${url}`);
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			if (previews[url]) {
				nextPreviews[url] = previews[url];
				console.warn(`Kept existing experience preview: ${url} (${errorMessage})`);
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
				console.warn(`Failed to generate experience preview: ${url} (${errorMessage})`);
			}
		}
	}

	fs.writeFileSync(previewPath, `${JSON.stringify(nextPreviews, null, 2)}\n`);
};

main().catch((error: unknown) => {
	console.error(getErrorMessage(error));
	process.exitCode = 1;
});
