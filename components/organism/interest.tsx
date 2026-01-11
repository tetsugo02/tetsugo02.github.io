"use client";

import { getBioContent } from "@/data/bio/bioContent";
import { Header } from "../atom/header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export const Interest = () => {
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
	const interestContent = bioContent.interest;

	return (
		<div className="w-full space-y-4 rounded-xl border bg-card p-6 shadow-sm">
			<div className="flex items-center gap-2">
				<Sparkles className="h-5 w-5 text-primary" />
				<Header level="h3" className="m-0 text-xl font-semibold">
					{t("interests.title")}
				</Header>
			</div>
			<div className="flex flex-wrap gap-2">
				{interestContent.map((item, index) => (
					<Badge
						key={index}
						variant="secondary"
						className="px-3 py-1 text-sm bg-muted/50 hover:bg-muted border-transparent"
					>
						{item}
					</Badge>
				))}
			</div>
		</div>
	);
};
