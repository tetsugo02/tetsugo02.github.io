"use client";

import { ArrowUpRight, CalendarDays, Landmark, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getIconByName } from "@/lib/iconMapper";
import type { ResolvedWorkBlockType, WorkType } from "@/types/workBlockType";

interface WorkLabels {
	empty: string;
	noPreview: string;
	viewDetails: string;
	links: string;
	close: string;
	types: Record<WorkType, string>;
}

export const WorkBlock = ({
	work,
	labels,
}: {
	work: ResolvedWorkBlockType;
	labels: WorkLabels;
}) => {
	const primaryLink = work.link?.[0];

	return (
		<Dialog>
			<article
				className={`flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg ${
					work.workType === "publication" ? "min-h-[20rem]" : "min-h-[28rem]"
				}`}
			>
				{work.workType !== "publication" &&
					(work.imageUrl ? (
						<div className="h-40 overflow-hidden bg-muted">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={work.imageUrl}
								alt=""
								className="h-full w-full object-cover grayscale-[12%]"
							/>
						</div>
					) : primaryLink ? (
						<a
							href={primaryLink}
							target="_blank"
							rel="noopener noreferrer"
							className="flex h-40 items-center justify-center gap-2 border-b border-border bg-muted/40 px-5 text-sm text-muted-foreground transition-colors hover:bg-muted"
						>
							<ArrowUpRight aria-hidden="true" className="size-5" />
							<span className="truncate">{new URL(primaryLink).hostname}</span>
						</a>
					) : (
						<div className="flex h-40 items-center justify-center border-b border-border bg-muted/40 text-xs text-muted-foreground">
							{labels.noPreview}
						</div>
					))}

				<div className="flex flex-1 flex-col p-5">
					<div className="flex items-start justify-between gap-4">
						<span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
							{labels.types[work.workType]}
						</span>
						{work.date && (
							<span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
								<CalendarDays aria-hidden="true" className="size-3" />
								{work.date}
							</span>
						)}
					</div>

					<h2 className="mt-5 text-xl font-medium leading-snug">{work.title}</h2>
					<p className="mt-4 line-clamp-4 text-sm leading-7 text-muted-foreground">
						{work.description}
					</p>

					<div className="mt-auto pt-5">
						{work.badges && work.badges.length > 0 && (
							<ul className="flex flex-wrap gap-2">
								{work.badges.slice(0, 4).map((badge) => {
									const Icon = getIconByName(badge.iconName);
									return (
										<li key={badge.name}>
											<Badge
												variant="outline"
												className="rounded-sm border-border bg-transparent font-normal text-muted-foreground"
											>
												{Icon && <Icon aria-hidden="true" className="mr-1 size-3" />}
												{badge.name}
											</Badge>
										</li>
									);
								})}
							</ul>
						)}

						<DialogTrigger asChild>
							<button
								type="button"
								className={`flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
									work.badges && work.badges.length > 0 ? "mt-4" : ""
								}`}
							>
								{labels.viewDetails}
								<ArrowUpRight aria-hidden="true" className="size-4" />
							</button>
						</DialogTrigger>
					</div>
				</div>
			</article>

			<DialogContent
				closeLabel={labels.close}
				className="max-h-[88vh] overflow-y-auto rounded-sm border-border bg-background p-6 shadow-xl sm:max-w-2xl sm:p-8"
			>
				<DialogHeader>
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
						{labels.types[work.workType]}
					</p>
					<DialogTitle className="pr-8 text-left text-2xl font-medium leading-snug">
						{work.title}
					</DialogTitle>
					<DialogDescription className="sr-only">{work.description}</DialogDescription>
				</DialogHeader>

				{(work.authors?.length || work.conference || work.date) && (
					<div className="space-y-2 border-y border-border py-4 text-sm text-muted-foreground">
						{work.authors?.length ? (
							<p className="flex items-start gap-2">
								<Users aria-hidden="true" className="mt-1 size-4 shrink-0" />
								<span>{work.authors.join(", ")}</span>
							</p>
						) : null}
						{work.conference && (
							<p className="flex items-start gap-2">
								<Landmark aria-hidden="true" className="mt-1 size-4 shrink-0" />
								<span>{work.conference}</span>
							</p>
						)}
						{work.date && (
							<p className="flex items-center gap-2">
								<CalendarDays aria-hidden="true" className="size-4" />
								{work.date}
							</p>
						)}
					</div>
				)}

				<p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
					{work.description}
				</p>

				{work.link && work.link.length > 0 && (
					<div className="border-t border-border pt-5">
						<h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
							{labels.links}
						</h3>
						<ul className="mt-3 space-y-2">
							{work.link.map((url) => (
								<li key={url}>
									<a
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-start gap-2 break-all text-sm underline decoration-border underline-offset-4 hover:decoration-foreground"
									>
										<ArrowUpRight aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
										{url}
									</a>
								</li>
							))}
						</ul>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
