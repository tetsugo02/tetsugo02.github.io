import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { getExperiencePreviewKey } from "../lib/experiencePreviewKey";

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
const staticPreviewPath = path.join(rootDir, ".cache", "experience-preview.json");
const imageDir = path.join(rootDir, "public", "generated", "experience");
const localePaths = [
	path.join(rootDir, "i18n", "locales", "en", "home.json"),
	path.join(rootDir, "i18n", "locales", "ja", "home.json"),
];
const refresh = process.argv.includes("--refresh");
const staticMode = process.argv.includes("--static");

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

const getImageExtension = (contentType: string) => {
	const type = contentType.split(";")[0].trim().toLowerCase();
	return (
		{
			"image/avif": ".avif",
			"image/gif": ".gif",
			"image/jpeg": ".jpg",
			"image/png": ".png",
			"image/svg+xml": ".svg",
			"image/webp": ".webp",
		} satisfies Record<string, string>
	)[type] ?? "";
};

const fetchPreview = async ({ pageUrl, ogUrl }: PreviewSource): Promise<ExperiencePreview> => {
	let $: CheerioAPI | undefined;
	let resolvedPageUrl = pageUrl;

	try {
		const pageResponse = await fetch(pageUrl, {
			headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioPreviewBot/1.0)" },
			redirect: "follow",
		});

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

const generateStaticPreviews = async () => {
	const previews = readJson<ExperiencePreviewMap>(previewPath, {});
	const staticPreviews: ExperiencePreviewMap = {};
	const retainedFiles = new Set<string>();

	fs.mkdirSync(imageDir, { recursive: true });
	fs.mkdirSync(path.dirname(staticPreviewPath), { recursive: true });

	for (const [url, preview] of Object.entries(previews)) {
		if (!preview.image) throw new Error(`Experience preview has no OG image: ${url}`);

		const imageHash = createHash("sha256").update(preview.image).digest("hex").slice(0, 16);
		const cachedFile = fs
			.readdirSync(imageDir)
			.find((fileName) => fileName.startsWith(`${imageHash}.`));
		let fileName = cachedFile;

		if (!fileName) {
			const response = await fetch(preview.image, {
				headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioPreviewBot/1.0)" },
				redirect: "follow",
			});

			if (!response.ok) throw new Error(`OG image returned HTTP ${response.status}: ${url}`);

			const contentType = response.headers.get("content-type") ?? "";
			const extension = getImageExtension(contentType);
			if (!extension) {
				throw new Error(`Unsupported OG image content type (${contentType || "unknown"}): ${url}`);
			}

			fileName = `${imageHash}${extension}`;
			fs.writeFileSync(
				path.join(imageDir, fileName),
				Buffer.from(await response.arrayBuffer())
			);
			console.log(`Downloaded static experience OG image: ${url}`);
		}

		retainedFiles.add(fileName);
		staticPreviews[url] = {
			...preview,
			image: `/generated/experience/${fileName}`,
		};
	}

	for (const fileName of fs.readdirSync(imageDir)) {
		if (!retainedFiles.has(fileName)) fs.rmSync(path.join(imageDir, fileName));
	}

	fs.writeFileSync(staticPreviewPath, `${JSON.stringify(staticPreviews, null, 2)}\n`);
};

const main = async () => {
	if (staticMode) {
		await generateStaticPreviews();
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

	const previews = readJson<ExperiencePreviewMap>(previewPath, {});
	const nextPreviews: ExperiencePreviewMap = {};

	for (const source of sources.values()) {
		if (!refresh && previews[source.key]?.image) {
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
