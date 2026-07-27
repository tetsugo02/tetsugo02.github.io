import { Sparkles } from "lucide-react";

export const Interest = ({
	title,
	items,
}: {
	title: string;
	items: readonly string[];
}) => (
	<section className="h-full rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
		<h2 className="flex items-center gap-2 text-xl font-semibold">
			<Sparkles aria-hidden="true" className="size-5 text-muted-foreground" />
			{title}
		</h2>
		<ul className="mt-6 flex flex-wrap gap-2">
			{items.map((item) => (
				<li key={item} className="rounded-lg bg-muted px-3 py-2 text-sm font-medium">
					{item}
				</li>
			))}
		</ul>
	</section>
);
