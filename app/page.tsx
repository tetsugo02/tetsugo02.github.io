"use client";

import { Header } from "@/components/atom/header";
import { Paragraph } from "@/components/atom/paragraph";
import { getBioContent } from "@/data/bio/bioContent";
import { Interest } from "@/components/organism/interest";
import { Education } from "@/components/organism/education";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useInitData } from "@/hooks/useInitData";
import { PageAnimationWrapper } from "@/components/atom/pageAnimationWrapper";

export default function Home() {
	const { t, i18n } = useTranslation("home");
	const [isReady, setIsReady] = useState(false);
	const { githubEventData } = useInitData();

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

	const bioContent = getBioContent(t);

	return (
		<PageAnimationWrapper>
			<Header level="h1">{t("bio.title")}</Header>
			<div className=" justify-items-start w-full h-fit flex flex-col gap-4  ">
				<article>
					{bioContent.main.map((item, index) => {
						return (
							<Paragraph key={index} className=" m-1 text-xl">
								{item}
							</Paragraph>
						);
					})}
				</article>
				<article className="mt-4  grid grid-cols-1 gap-4 ">
					<Interest />
					<Education />
				</article>
			</div>
			<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
		</PageAnimationWrapper>
	);
}
