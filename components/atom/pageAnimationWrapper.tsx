"use client";

import { cn } from "@/lib/utils";
import { animate } from "motion";
import { useEffect, useRef } from "react";

interface PageAnimationWrapperProps {
	children: React.ReactNode;
	className?: string;
}

export const PageAnimationWrapper = ({ children, className }: PageAnimationWrapperProps) => {
	const pageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = pageRef.current;
		if (!el) return;
		const children = Array.from(el.children) as HTMLElement[];

		children.forEach((c) => {
			c.style.opacity = "0";
			c.style.transform = "translateY(12px)";
		});

		children.forEach((c, i) => {
			animate(c, { opacity: 1, transform: "translateY(0px)" }, { delay: i * 0.06, duration: 0.28 });
		});
	}, []);

	return (
		<div ref={pageRef} className={cn("w-full", className)}>
			{children}
		</div>
	);
};
