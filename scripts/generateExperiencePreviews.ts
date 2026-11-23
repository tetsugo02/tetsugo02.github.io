import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { getExperiencePreviewKey } from "../lib/experiencePreviewKey";
import {
	fetchWithRetry,
	generateStaticPreviews,
	getErrorMessage,
	getMetaTag,
	readJson,
	type PreviewEntry,
	type PreviewMap,
} from "./previewUtils";

type CareerItem = {
	url?: string;
	/** Direct image URL used instead of the page's og:image value. */
	ogUrl?: string;
};

type PreviewSource = {
	key: string;
	pageUrl: string;
	ogUrl?: string;
};

type HomeLocale = {
	bio?: {
		career?: CareerItem[];
	};
};

const rootDir = process.cwd();
const previewPath = path.join(rootDir, "data", "experience-preview.json");
const staticPreviewPath = path.join(rootDir, ".cache", "experience-preview.json");
const imageDir = path.join(rootDir, "public", "generated", "experience");
const localePaths = [
	path.join(rootDir, "i18n", "locales", "en", "home.json"),
	path.join(rootDir, "i18n", "locales", "ja", "home.json"),
];
const refresh = process.argv.includes("--refresh");
const staticMode = process.argv.includes("--static");

const fetchPreview = async ({ pageUrl, ogUrl }: PreviewSource): Promise<PreviewEntry> => {
	let $: CheerioAPI | undefined;
	let resolvedPageUrl = pageUrl;

	try {
		const pageResponse = await fetchWithRetry(pageUrl);
		if (!pageResponse.ok) throw new Error(`Page returned HTTP ${pageResponse.status}`);
		resolvedPageUrl = pageResponse.url || pageUrl;
		$ = cheerio.load(await pageResponse.text());
	} catch (error) {
		if (!ogUrl) throw error;
		console.warn(`Could not fetch page metadata; using explicit ogUrl: ${pageUrl}`);
	}

	const rawImage = ogUrl || ($ && getMetaTag($, "image"));
	if (!rawImage) throw new Error("No Open Graph image was found");

	return {
		title: ($ && (getMetaTag($, "title") || $("title").text().trim())) || "",
		description: ($ && getMetaTag($, "description")) || "",
		image: new URL(rawImage, resolvedPageUrl).toString(),
		siteName: ($ && getMetaTag($, "site_name")) || "",
		url: pageUrl,
		fetchedAt: new Date().toISOString(),
	};
};

const main = async () => {
	if (staticMode) {
		await generateStaticPreviews({
			previewPath,
			staticPreviewPath,
			imageDir,
			publicPathPrefix: "/generated/experience",
			label: "experience",
		});
		return;
	}

	const sources = new Map<string, PreviewSource>();
	for (const localePath of localePaths) {
		const locale = readJson<HomeLocale>(localePath, {});
		for (const item of locale.bio?.career ?? []) {
			if (!item.url) continue;
			const key = getExperiencePreviewKey(item.url, item.ogUrl);
			sources.set(key, { key, pageUrl: item.url, ogUrl: item.ogUrl });
		}
	}

	const previews = readJson<PreviewMap>(previewPath, {});
	const nextPreviews: PreviewMap = {};

	for (const source of sources.values()) {
		if (!refresh && previews[source.key]?.image && !previews[source.key]?.error) {
			nextPreviews[source.key] = previews[source.key];
			continue;
		}

		try {
			nextPreviews[source.key] = await fetchPreview(source);
			console.log(`Generated experience preview: ${source.pageUrl}`);
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			if (previews[source.key]) {
				nextPreviews[source.key] = previews[source.key];
				console.warn(`Kept existing experience preview: ${source.pageUrl} (${errorMessage})`);
			} else {
				nextPreviews[source.key] = {
					title: "",
					description: "",
					image: "",
					siteName: "",
					url: source.pageUrl,
					fetchedAt: new Date().toISOString(),
					error: errorMessage,
				};
				console.warn(`Failed to generate experience preview: ${source.pageUrl} (${errorMessage})`);
			}
		}
	}

	fs.writeFileSync(previewPath, `${JSON.stringify(nextPreviews, null, 2)}\n`);
};

main().catch((error: unknown) => {
	console.error(getErrorMessage(error));
	process.exitCode = 1;
});
