"use client";

import { PageAnimationWrapper } from "@/components/atom/pageAnimationWrapper";
import { RecentExperience } from "@/components/organism/workExperience";
import { useInitData } from "@/hooks/useInitData";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Header } from "@/components/atom/header";

const ExperiencePage = () => {
	const { githubEventData } = useInitData();
	const { i18n } = useTranslation();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (i18n.isInitialized) {
			setIsReady(true);
		} else {
			const handleInit = () => setIsReady(true);
			i18n.on("initialized", handleInit);
			return () => i18n.off("initialized", handleInit);
		}
	}, [i18n]);

	if (!isReady) {
		return (
			<div className="flex items-center justify-center h-64">
				<div>Loading...</div>
			</div>
		);
	}

	return (
		<PageAnimationWrapper>
			<Header level="h2" className="mb-4">
				Recent Activity
			</Header>
			<RecentExperience githubEventData={githubEventData} />
		</PageAnimationWrapper>
	);
};
export default ExperiencePage;
