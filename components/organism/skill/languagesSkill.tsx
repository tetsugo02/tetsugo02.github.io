import type { LanguageLevel } from "@/types/languageLevel";

export const LanguagesSkill = ({
	title,
	languages,
}: {
	title: string;
	languages: readonly LanguageLevel[];
}) => (
	<section className="h-full rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
		<h2 className="text-xl font-semibold">
			{title}
		</h2>
		<ul className="mt-6 space-y-6">
			{languages.map((language) => (
				<li key={language.name}>
					<div className="flex items-baseline justify-between gap-4">
						<h3 className="text-lg font-medium">{language.name}</h3>
						<span className="text-xs tabular-nums text-muted-foreground">
							{language.percentage}%
						</span>
					</div>
					<div
						className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
						role="progressbar"
						aria-label={language.name}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={language.percentage}
					>
						<div
							className="h-full rounded-full bg-primary"
							style={{ width: `${language.percentage}%` }}
						/>
					</div>
					<p className="mt-3 text-sm leading-6 text-muted-foreground">
						{language.description}
					</p>
				</li>
			))}
		</ul>
	</section>
);
