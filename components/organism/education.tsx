import { CalendarDays, GraduationCap } from "lucide-react";
import type { EducationContent } from "@/types/bioType";

export const Education = ({
	title,
	items,
}: {
	title: string;
	items: readonly EducationContent[];
}) => (
	<section className="h-full rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
		<h2 className="flex items-center gap-2 text-xl font-semibold">
			<GraduationCap aria-hidden="true" className="size-5 text-muted-foreground" />
			{title}
		</h2>
		<ol className="mt-6 space-y-6">
			{items.map((item) => (
				<li key={`${item.field}-${item.time}`}>
					<p className="font-medium leading-7">{item.field}</p>
					<p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
						<CalendarDays aria-hidden="true" className="size-3.5" />
						{item.time}
					</p>
				</li>
			))}
		</ol>
	</section>
);
