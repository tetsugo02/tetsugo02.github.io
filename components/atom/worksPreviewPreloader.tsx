"use client";

import { useEffect } from "react";
import { useSWRConfig } from "swr";
import {
	fetchLinkPreview,
	getLinkPreviewKey,
	readCachedLinkPreview,
	writeCachedLinkPreview,
} from "@/lib/linkPreviewCache";

const inFlightPreloads = new Set<string>();
const preloadedImages = new Set<string>();

interface WorksPreviewPreloaderProps {
	urls: string[];
	imageUrls: string[];
}

export const WorksPreviewPreloader = ({ urls, imageUrls }: WorksPreviewPreloaderProps) => {
	const { cache, mutate } = useSWRConfig();

	useEffect(() => {
		const uniqueImageUrls = Array.from(new Set(imageUrls.filter(Boolean))).filter(
			(imageUrl) => !preloadedImages.has(imageUrl)
		);

		if (uniqueImageUrls.length === 0) return;

		const timeoutId = window.setTimeout(() => {
			uniqueImageUrls.forEach((imageUrl) => {
				preloadedImages.add(imageUrl);
				const image = new Image();
				image.decoding = "async";
				image.src = imageUrl;
			});
		}, 0);

		return () => window.clearTimeout(timeoutId);
	}, [imageUrls]);

	useEffect(() => {
		const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

		uniqueUrls.forEach((url) => {
			const key = getLinkPreviewKey(url);
			if (!key || inFlightPreloads.has(key)) return;

			const swrEntry = cache.get(key) as { data?: unknown } | undefined;
			if (swrEntry?.data) return;

			const sessionData = readCachedLinkPreview(key);
			if (sessionData) {
				mutate(key, sessionData, { revalidate: false });
				return;
			}

			inFlightPreloads.add(key);
			fetchLinkPreview(key)
				.then((data) => {
					writeCachedLinkPreview(key, data);
					mutate(key, data, { revalidate: false });
				})
				.catch(() => {
					// LinkPreview owns the fallback UI. Preload failures should not affect the page.
				})
				.finally(() => {
					inFlightPreloads.delete(key);
				});
		});
	}, [cache, mutate, urls]);

	return null;
};
