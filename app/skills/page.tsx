"use client";

import { LanguagesSkill } from "@/components/organism/skill/languagesSkill";
import { TechSkill } from "@/components/organism/skill/techSkill";
import { Certification } from "@/components/organism/skill/certification";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { PageAnimationWrapper } from "@/components/atom/pageAnimationWrapper";

const SkillsPage = () => {
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
			<div className="grid grid-cols-1 lg:grid-cols-2 mx-0 px-0 h-fit">
				<TechSkill />
				<Certification />
			</div>
			<LanguagesSkill />
		</PageAnimationWrapper>
	);
};

export default SkillsPage;
