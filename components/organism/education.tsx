"use client";

import { getBioContent } from "@/data/bio/bioContent";
import { Header } from "../atom/header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { GraduationCap, CalendarDays } from "lucide-react";

export const Education = () => {
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
	const educationContent = bioContent.education;

	return (
		<div className="w-full space-y-4 rounded-xl border bg-card p-6 shadow-sm">
			<div className="flex items-center gap-2">
				<GraduationCap className="h-5 w-5 text-primary" />
				<Header level="h3" className="m-0 text-xl font-semibold">
					{t("education.title")}
				</Header>
			</div>

			<div className="relative space-y-0 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-border before:via-muted before:to-transparent">
				{educationContent.map((item, index) => (
					<div key={index} className="relative pb-6 pl-8 sm:pl-12 last:pb-0">
						<div className="absolute left-0 top-1.5 flex h-2.5 w-2.5 -translate-x-1/2 items-center justify-center rounded-full bg-background ring-2 ring-primary"></div>
						<div className="flex flex-col gap-1">
							<h4 className="text-base font-medium leading-none text-foreground">{item.field}</h4>
							<div className="flex items-center text-sm text-muted-foreground">
								<CalendarDays className="mr-1 h-3.5 w-3.5" />
								{item.time}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
