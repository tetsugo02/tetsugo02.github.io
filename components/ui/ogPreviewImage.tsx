"use client";

import { ImageOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const OgPreviewImage = ({
	src,
	alt = "",
	fallback,
	className,
	imageClassName,
}: {
	src: string;
	alt?: string;
	fallback: string;
	className?: string;
	imageClassName?: string;
}) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const imageRef = useRef<HTMLImageElement | null>(null);

	useEffect(() => {
		setIsLoaded(false);
		setHasError(false);

		const image = imageRef.current;
		if (!image?.complete) return;

		if (image.naturalWidth > 0) {
			setIsLoaded(true);
		} else {
			setHasError(true);
		}
	}, [src]);

	return (
		<div className={cn("relative overflow-hidden bg-muted/40", className)}>
			{!isLoaded && !hasError && (
				<div
					aria-hidden="true"
					className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted"
				/>
			)}

			{hasError ? (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-5 text-center text-xs text-muted-foreground">
					<ImageOff aria-hidden="true" className="size-5" />
					<span className="line-clamp-2">{fallback}</span>
				</div>
			) : (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					ref={imageRef}
					src={src}
					alt={alt}
					loading="lazy"
					decoding="async"
					onLoad={() => setIsLoaded(true)}
					onError={() => setHasError(true)}
					className={cn(
						"absolute inset-0 h-full w-full transition-opacity duration-300",
						isLoaded ? "opacity-100" : "opacity-0",
						imageClassName
					)}
				/>
			)}
		</div>
	);
};
