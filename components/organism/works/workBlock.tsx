"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkBlockType } from "@/types/workBlockType";
import { getWorkTypeBadge } from "@/lib/workHelper";
import { LinkPreview } from "@/components/molecule/linkPreview";
import { CalendarDays, ExternalLink } from "lucide-react";
import { getIconByName } from "@/lib/iconMapper";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export const WorkBlock = ({ title, description, link, workType, badges, date }: WorkBlockType) => {
	const { i18n } = useTranslation();
	const workTypeBadge = getWorkTypeBadge(workType);
	const primaryLink = link && link.length > 0 ? link[0] : null;

	const currentLang = i18n.language === "ja" ? "ja" : "en";

	const displayTitle = useMemo(() => {
		if (typeof title === "string") return title;
		return title[currentLang] || title.en || title.ja || "";
	}, [title, currentLang]);

	const displayDescription = useMemo(() => {
		if (typeof description === "string") return description;
		return description[currentLang] || description.en || description.ja || "";
	}, [description, currentLang]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg h-full border-muted bg-card cursor-pointer">
					{/* Preview Area */}
					{primaryLink ? (
						<div className="w-full h-40 overflow-hidden">
							<LinkPreview
								url={primaryLink}
								className="rounded-none border-x-0 border-t-0 border-b w-full h-full object-cover"
								showText={false}
							/>
						</div>
					) : (
						<div className="h-40 w-full bg-muted/30 flex items-center justify-center text-muted-foreground text-sm">
							No Preview
						</div>
					)}

					<CardContent className="flex flex-col flex-1 gap-4 p-5 text-left">
						{/* Header */}
						<div className="flex flex-col gap-2">
							<div className="flex items-start justify-between gap-2">
								<Badge
									variant="outline"
									className={`${workTypeBadge.className} border-transparent px-2 py-0.5`}
								>
									{workTypeBadge.name}
								</Badge>
								{date && (
									<div className="flex items-center text-xs text-muted-foreground shrink-0">
										<CalendarDays className="mr-1 h-3 w-3" />
										{date}
									</div>
								)}
							</div>
							<h3
								className="text-lg font-bold leading-tight tracking-tight line-clamp-2"
								suppressHydrationWarning
							>
								{displayTitle}
							</h3>
						</div>

						{/* Body */}
						<p
							className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3"
							suppressHydrationWarning
						>
							{displayDescription}
						</p>

						{/* Footer / Badges & Links */}
					</CardContent>
					<CardFooter className="p-5 pt-0 mt-auto">
						<div className="flex flex-col gap-3 w-full">
							{badges && badges.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{badges.slice(0, 3).map((badge, index) => {
										const Icon = getIconByName(badge.iconName);
										return (
											<Badge key={index} variant="secondary" className="text-xs font-normal">
												{Icon && <Icon className="inline w-3 h-3 mr-1" />}
												{badge.name}
											</Badge>
										);
									})}
									{badges.length > 3 && (
										<Badge variant="outline" className="text-xs">
											+{badges.length - 3}
										</Badge>
									)}
								</div>
							)}
						</div>
					</CardFooter>
				</Card>
			</DialogTrigger>
			<DialogContent className="lg:max-w-2xl max-h-[90vh] flex flex-col overflow-y-auto">
				<DialogHeader className="w-full">
					<DialogTitle className="text-2xl font-bold text-start" suppressHydrationWarning>
						{displayTitle}
					</DialogTitle>
				</DialogHeader>
				<Separator />
				{link?.map((url, index) => (
					<a
						key={index}
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline flex items-center gap-1 mt-1 break-all"
					>
						<ExternalLink className="w-4 h-4 shrink-0" />
						{url}
					</a>
				))}
				<Separator className="my-4" />
				<p
					className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed"
					suppressHydrationWarning
				>
					{displayDescription}
				</p>
			</DialogContent>
		</Dialog>
	);
};
