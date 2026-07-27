export const Certification = ({
	title,
	certifications,
}: {
	title: string;
	certifications: readonly { name: string }[];
}) => (
	<section className="h-full rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
		<h2 className="text-xl font-semibold">
			{title}
		</h2>
		<ul className="mt-6 list-disc space-y-3 pl-5">
			{certifications.map((certification) => (
				<li key={certification.name} className="pl-1 leading-7 marker:text-muted-foreground">
					{certification.name}
				</li>
			))}
		</ul>
	</section>
);
