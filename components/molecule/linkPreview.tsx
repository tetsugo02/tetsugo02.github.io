"use client";

import { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Skeleton } from "../ui/skeleton";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	fetchLinkPreview,
	getLinkPreviewKey,
	readCachedLinkPreview,
	writeCachedLinkPreview,
	type PreviewData,
} from "@/lib/linkPreviewCache";

interface LinkPreviewProps {
	url: string;
	className?: string;
	showText?: boolean;
}

export const LinkPreview = ({ url, className, showText = true }: LinkPreviewProps) => {
	const key = getLinkPreviewKey(url);
	const { mutate } = useSWRConfig();
	const { data, error, isLoading } = useSWR<PreviewData>(
		key,
		async (key: string) => {
			const data = await fetchLinkPreview(key);
			writeCachedLinkPreview(key, data);
			return data;
		},
		{
			dedupingInterval: 1000 * 60 * 60,
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			shouldRetryOnError: false,
		}
	);

	useEffect(() => {
		if (!key || data) return;

		const cachedData = readCachedLinkPreview(key);
		if (cachedData) {
			mutate(key, cachedData, { revalidate: false });
		}
	}, [data, key, mutate]);

	if (isLoading) {
		return <Skeleton className={cn("h-32 w-full rounded-lg", className)} />;
	}

	if (error || !data) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					"flex items-center gap-2 p-4 rounded-lg border bg-card text-card-foreground hover:bg-muted/50 transition-colors",
					className
				)}
			>
				<ExternalLink className="h-4 w-4" />
				<span className="truncate">{url}</span>
			</a>
		);
	}

	if (!showText) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					"group block w-full overflow-hidden bg-muted transition-all hover:bg-muted/80",
					className
				)}
			>
				{data.image ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={data.image}
						alt={data.title}
						className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
						onError={(e) => {
							e.currentTarget.style.display = "none";
						}}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-muted-foreground">
						<ExternalLink className="h-6 w-6" />
					</div>
				)}
			</a>
		);
	}

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				"group flex w-full overflow-hidden rounded-lg border bg-card hover:bg-muted/50 transition-all hover:shadow-sm",
				className
			)}
		>
			{data.image && (
				<div className="relative h-auto w-32 min-w-30 shrink-0 overflow-hidden bg-muted sm:w-48">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={data.image}
						alt={data.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						onError={(e) => {
							e.currentTarget.style.display = "none";
						}}
					/>
				</div>
			)}
			<div className="flex flex-1 flex-col justify-center gap-1 p-3 sm:p-4 min-w-0">
				<h4 className="line-clamp-1 text-sm font-semibold sm:text-base text-foreground">
					{data.title || data.url}
				</h4>
				{data.description && (
					<p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
						{data.description}
					</p>
				)}
				<div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
					{data.image ? null : <ExternalLink className="h-3 w-3" />}
					<span className="truncate">{data.siteName || new URL(url).hostname}</span>
				</div>
			</div>
		</a>
	);
};
