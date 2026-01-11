"use client";

import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkPreviewProps {
	url: string;
	className?: string;
}

interface PreviewData {
	title: string;
	description: string;
	image: string;
	siteName: string;
	url: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const LinkPreview = ({ url, className }: LinkPreviewProps) => {
	const { data, error, isLoading } = useSWR<PreviewData>(
		url ? `/api/link-preview?url=${encodeURIComponent(url)}` : null,
		fetcher,
		{
			revalidateOnFocus: false,
			shouldRetryOnError: false,
		}
	);

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
