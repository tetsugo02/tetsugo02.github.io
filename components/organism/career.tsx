import { ArrowUpRight, Briefcase, CalendarDays } from "lucide-react";
import type { CareerContent } from "@/types/bioType";

export const Career = ({
	title,
	items,
}: {
	title: string;
	items: readonly CareerContent[];
}) => {
	if (items.length === 0) return null;

	return (
		<section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
			<h2 className="flex items-center gap-2 text-xl font-semibold">
				<Briefcase aria-hidden="true" className="size-5 text-muted-foreground" />
				{title}
			</h2>
			<div className="mt-6 space-y-7 border-l-2 border-border pl-6">
				{items.map((item) => (
					<article key={`${item.company}-${item.period}`} className="relative">
						<span className="absolute -left-[1.82rem] top-1.5 size-3 rounded-full border-2 border-primary bg-background" />
						<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
							<h3 className="text-lg font-bold leading-7">{item.title}</h3>
							<span className="text-sm font-medium text-muted-foreground">{item.company}</span>
						</div>
						<p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
							<CalendarDays aria-hidden="true" className="size-4" />
							{item.period}
						</p>
						{item.description && (
							<p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
								{item.description}
							</p>
						)}
						{item.url && (
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
							>
								{new URL(item.url).hostname}
								<ArrowUpRight aria-hidden="true" className="size-3.5" />
							</a>
						)}
					</article>
				))}
			</div>
		</section>
	);
};
