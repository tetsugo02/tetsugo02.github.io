"use client";

import { getBioContent } from "@/data/bio/bioContent";
import { Interest } from "@/components/organism/interest";
import { Education } from "@/components/organism/education";
import { Career } from "@/components/organism/career";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { PageAnimationWrapper } from "@/components/atom/pageAnimationWrapper";
import { Terminal } from "lucide-react";

export default function Home() {
	const { t, i18n } = useTranslation("home");
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
			<div className="flex h-[50vh] w-full items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			</div>
		);
	}

	const bioContent = getBioContent(t);

	return (
		<PageAnimationWrapper>
			<section className="flex flex-col gap-8 pb-8 pt-4 md:pt-8 text-left">
				<div className="space-y-4">
					<div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
						<Terminal className="mr-2 h-4 w-4" />
						<span>{t("bio.subtitle") || "Software Engineer"}</span>
					</div>
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
						{t("bio.title")}
					</h1>
					<div className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
						{bioContent.main.map((item, index) => (
							<p key={index} className="mb-2 last:mb-0">
								{item}
							</p>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6">
					<Career />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Education />
						<Interest />
					</div>
				</div>
			</section>
		</PageAnimationWrapper>
	);
}
