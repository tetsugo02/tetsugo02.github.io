"use client";

import { RecentExperience } from "@/components/organism/workExperience";
import { useInitData } from "@/hooks/useInitData";
import { use } from "react";

const ExperiencePage = ({ params }: { params: Promise<{ lang: string }> }) => {
	const { lang } = use(params);
	const { githubEventData } = useInitData();

	return (
		<div>
			<header className="mb-12 max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
					GitHub
				</p>
				<h1 className="mt-5 text-4xl font-medium tracking-[-0.025em] sm:text-6xl">
					{lang === "ja" ? "最近の活動" : "Recent Activity"}
				</h1>
			</header>
			<RecentExperience githubEventData={githubEventData} />
		</div>
	);
};
export default ExperiencePage;
