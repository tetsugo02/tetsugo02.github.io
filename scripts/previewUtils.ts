import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { CheerioAPI } from "cheerio";

export type PreviewEntry = {
	title: string;
	description: string;
	image: string;
	siteName: string;
	url: string;
	fetchedAt: string;
	error?: string;
};

export type PreviewMap = Record<string, PreviewEntry>;

export const PREVIEW_USER_AGENT = "Mozilla/5.0 (compatible; PortfolioPreviewBot/1.0)";
const FETCH_TIMEOUT_MS = 15_000;

export const readJson = <T>(filePath: string, fallback: T): T => {
	if (!fs.existsSync(filePath)) return fallback;

	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
	} catch {
		return fallback;
	}
};

export const getMetaTag = ($: CheerioAPI, name: string) =>
	$(`meta[property="og:${name}"]`).attr("content") ||
	$(`meta[name="twitter:${name}"]`).attr("content") ||
	$(`meta[property="${name}"]`).attr("content") ||
	$(`meta[name="${name}"]`).attr("content") ||
	"";

export const getErrorMessage = (error: unknown) =>
	error instanceof Error ? error.message : String(error);

export const getImageExtension = (contentType: string) => {
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchWithRetry = async (url: string, retries = 2): Promise<Response> => {
	let lastError: unknown;

	for (let attempt = 0; attempt <= retries; attempt += 1) {
		try {
			const response = await fetch(url, {
				headers: { "User-Agent": PREVIEW_USER_AGENT },
				redirect: "follow",
				signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
			});

			if (response.ok || (response.status < 500 && response.status !== 429)) {
				return response;
			}

			lastError = new Error(`HTTP ${response.status}`);
		} catch (error) {
			lastError = error;
		}

		if (attempt < retries) {
			await sleep(500 * (attempt + 1));
		}
	}

	throw lastError instanceof Error ? lastError : new Error(String(lastError));
};

export const generateStaticPreviews = async ({
	previewPath,
	staticPreviewPath,
	imageDir,
	publicPathPrefix,
	label,
	allowFallbackToRemote = false,
}: {
	previewPath: string;
	staticPreviewPath: string;
	imageDir: string;
	publicPathPrefix: string;
	label: string;
	allowFallbackToRemote?: boolean;
}) => {
	const previews = readJson<PreviewMap>(previewPath, {});
	const staticPreviews: PreviewMap = {};
	const retainedFiles = new Set<string>();

	fs.mkdirSync(imageDir, { recursive: true });
	fs.mkdirSync(path.dirname(staticPreviewPath), { recursive: true });

	for (const [key, preview] of Object.entries(previews)) {
		if (!preview.image) {
			if (allowFallbackToRemote) {
				console.warn(`Skipped static ${label} OG image (no image URL): ${key}`);
				staticPreviews[key] = preview;
				continue;
			}
			throw new Error(`${label} preview has no OG image: ${key}`);
		}

		const imageHash = createHash("sha256").update(preview.image).digest("hex").slice(0, 16);
		const cachedFile = fs
			.readdirSync(imageDir)
			.find((fileName) => fileName.startsWith(`${imageHash}.`));
		let fileName = cachedFile;

		if (!fileName) {
			try {
				const response = await fetchWithRetry(preview.image);
				if (!response.ok) {
					throw new Error(`OG image returned HTTP ${response.status}: ${key}`);
				}

				const contentType = response.headers.get("content-type") ?? "";
				const extension = getImageExtension(contentType);
				if (!extension) {
					throw new Error(`Unsupported OG image content type (${contentType || "unknown"}): ${key}`);
				}

				fileName = `${imageHash}${extension}`;
				fs.writeFileSync(
					path.join(imageDir, fileName),
					Buffer.from(await response.arrayBuffer())
				);
				console.log(`Downloaded static ${label} OG image: ${key}`);
			} catch (error) {
				if (!allowFallbackToRemote) throw error;
				console.warn(
					`Failed to download static ${label} OG image, keeping remote URL: ${key} (${getErrorMessage(error)})`
				);
				staticPreviews[key] = preview;
				continue;
			}
		}

		retainedFiles.add(fileName);
		staticPreviews[key] = {
			...preview,
			image: `${publicPathPrefix}/${fileName}`,
		};
	}

	for (const fileName of fs.readdirSync(imageDir)) {
		if (!retainedFiles.has(fileName)) fs.rmSync(path.join(imageDir, fileName));
	}

	fs.writeFileSync(staticPreviewPath, `${JSON.stringify(staticPreviews, null, 2)}\n`);
};
