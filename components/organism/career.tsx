"use client";

import { getBioContent } from "@/data/bio/bioContent";
import { Header } from "../atom/header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Briefcase, CalendarDays } from "lucide-react";
import { LinkPreview } from "../molecule/linkPreview";

export const Career = () => {
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
		return null;
	}

	const bioContent = getBioContent(t);
	const careerContent = bioContent.career || [];

	if (careerContent.length === 0) return null;

	return (
		<div className="w-full space-y-4 rounded-xl border bg-card p-6 shadow-sm">
			<div className="flex items-center gap-2">
				<Briefcase className="h-5 w-5 text-primary" />
				<Header level="h3" className="m-0 text-xl font-semibold">
					{t("career.title")}
				</Header>
			</div>

			<div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-linear-to-b before:from-border before:via-muted before:to-transparent">
				{careerContent.map((item, index) => (
					<div key={index} className="relative pl-8 sm:pl-12">
						<div className="absolute left-0 top-1.5 flex h-2.5 w-2.5 -translate-x-1/2 items-center justify-center rounded-full bg-background ring-2 ring-primary"></div>
						<div className="flex flex-col gap-2">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
								<h4 className="text-base font-bold leading-none text-foreground">{item.title}</h4>
								<span className="text-sm font-medium text-muted-foreground">{item.company}</span>
							</div>
							<div className="flex items-center text-sm text-muted-foreground">
								<CalendarDays className="mr-1 h-3.5 w-3.5" />
								{item.period}
							</div>
							{item.description && (
								<p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
							)}
							{item.url && (
								<div className="mt-2 w-full max-w-md">
									<LinkPreview url={item.url} />
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
