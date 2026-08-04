import { ArrowUpRight, BriefcaseBusiness, CalendarDays } from "lucide-react";
import { OgPreviewImage } from "@/components/ui/ogPreviewImage";
import { getExperiencePreviews } from "@/lib/experienceLoader";
import { getExperiencePreviewKey } from "@/lib/experiencePreviewKey";
import type { CareerContent } from "@/types/bioType";

export const Career = ({
	title,
	items,
}: {
	title: string;
	items: readonly CareerContent[];
}) => {
	if (items.length === 0) return null;
	const previews = getExperiencePreviews();

	return (
		<section aria-labelledby="experience-heading">
			<div className="flex items-center gap-3">
				<span className="grid size-10 place-items-center rounded-lg border border-border bg-card shadow-sm">
					<BriefcaseBusiness aria-hidden="true" className="size-5 text-muted-foreground" />
				</span>
				<h2 id="experience-heading" className="text-2xl font-semibold tracking-tight">
					{title}
				</h2>
			</div>

			<ol className="mt-5 space-y-5">
				{items.map((item) => {
					const previewKey = item.url
						? getExperiencePreviewKey(item.url, item.ogUrl)
						: undefined;
					const preview = previewKey ? previews[previewKey] : undefined;
					const previewLabel = item.company;

					return (
						<li key={`${item.company}-${item.period}`}>
							<article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
								<div className="grid md:grid-cols-[minmax(0,1fr)_minmax(20rem,44%)]">
									<div className="flex min-h-64 flex-col p-5 sm:p-6">
										<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
											<p className="text-sm font-semibold text-foreground">{item.company}</p>
											<span aria-hidden="true" className="size-1 rounded-full bg-border" />
											<p className="inline-flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
												<CalendarDays aria-hidden="true" className="size-3.5" />
												{item.period}
											</p>
										</div>

										<h3 className="mt-5 text-xl font-semibold leading-snug sm:text-2xl">
											{item.title}
										</h3>
										{item.description && (
											<p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
												{item.description}
											</p>
										)}

										{item.url && (
											<a
												href={item.url}
												target="_blank"
												rel="noopener noreferrer"
												className="mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-sm font-semibold underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											>
												{item.company}
												<ArrowUpRight aria-hidden="true" className="size-4" />
											</a>
										)}
									</div>

									{preview?.image && (
										<a
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`${item.company}: ${item.title}`}
											className="relative block aspect-[1200/630] overflow-hidden border-t border-border bg-muted/40 md:aspect-auto md:min-h-full md:border-l md:border-t-0"
										>
											<OgPreviewImage
												src={preview.image}
												fallback={previewLabel}
												className="absolute inset-0"
												imageClassName="object-contain"
											/>
											<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12 text-white">
												<p className="line-clamp-2 text-sm font-medium leading-5">
													{item.company}
												</p>
											</div>
										</a>
									)}
								</div>
							</article>
						</li>
					);
				})}
			</ol>
		</section>
	);
};
