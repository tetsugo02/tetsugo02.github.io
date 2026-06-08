export interface PreviewData {
	title: string;
	description: string;
	image: string;
	siteName: string;
	url: string;
}

const SESSION_CACHE_PREFIX = "link-preview:";

export const getLinkPreviewKey = (url: string) =>
	url ? `/api/link-preview?url=${encodeURIComponent(url)}` : null;

export const fetchLinkPreview = async (key: string): Promise<PreviewData> => {
	const response = await fetch(key);

	if (!response.ok) {
		throw new Error("Failed to fetch link preview");
	}

	return response.json();
};

export const readCachedLinkPreview = (key: string): PreviewData | null => {
	if (typeof window === "undefined") return null;

	try {
		const cached = window.sessionStorage.getItem(`${SESSION_CACHE_PREFIX}${key}`);
		return cached ? (JSON.parse(cached) as PreviewData) : null;
	} catch {
		return null;
	}
};

export const writeCachedLinkPreview = (key: string, data: PreviewData) => {
	if (typeof window === "undefined") return;

	try {
		window.sessionStorage.setItem(`${SESSION_CACHE_PREFIX}${key}`, JSON.stringify(data));
	} catch {
		// Ignore storage quota or privacy mode failures. SWR still keeps an in-memory cache.
	}
};
