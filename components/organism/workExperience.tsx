import { GithubActivityCard } from "./githubActivityCard";
import { GithubEvent } from "@/store/githubDataAtom";
import { useEffect, useRef } from "react";
import { animate } from "motion";

export interface RecentExperienceProps {
	githubEventData: GithubEvent[] | null;
}

export const RecentExperience = ({ githubEventData }: RecentExperienceProps) => {
	const minlength = Math.min(githubEventData?.length ?? 0, 10);
	const limitedData = githubEventData ? githubEventData.slice(0, minlength) : [];

	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const children = Array.from(el.querySelectorAll(":scope > *")) as HTMLElement[];
		children.forEach((c) => {
			// set initial
			c.style.opacity = "0";
			c.style.transform = "translateY(12px)";
		});

		// staggered animate
		children.forEach((c, i) => {
			animate(c, { opacity: 1, transform: "translateY(0px)" }, { delay: i * 0.06, duration: 0.28 });
		});
	}, [limitedData.length]);

	if (!githubEventData || limitedData.length === 0) return null;

	return (
		<div ref={containerRef} className="w-full h-fit flex flex-col space-y-4 items-center">
			{limitedData.map((eventData) => {
				return <GithubActivityCard data={eventData} key={eventData.id} />;
			})}
		</div>
	);
};
