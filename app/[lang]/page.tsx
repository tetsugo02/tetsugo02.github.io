import { Interest } from "@/components/organism/interest";
import { Education } from "@/components/organism/education";
import { Career } from "@/components/organism/career";
import { getDictionary, isLocale } from "@/i18n";
import { notFound } from "next/navigation";
import { Terminal } from "lucide-react";

export default async function Home({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	if (!isLocale(lang)) notFound();
	const dictionary = getDictionary(lang);
	const { bio, career, education, interests } = dictionary.home;

	return (
		<section className="space-y-10 pb-8">
			<header className="max-w-3xl pt-2 sm:pt-4">
				<div className="inline-flex items-center rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
					<Terminal aria-hidden="true" className="mr-2 size-4" />
					{bio.eyebrow}
				</div>
				<h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
					{bio.title}
				</h1>
				<p className="mt-5 text-xl leading-8 text-foreground/85">{bio.subtitle}</p>
				<div className="mt-5 space-y-2 text-base leading-8 text-muted-foreground sm:text-lg">
					{bio.main.map((item) => (
						<p key={item}>{item}</p>
					))}
				</div>
			</header>

			<div className="space-y-6">
				<Career title={career.title} items={bio.career} />
				<div className="grid gap-6 md:grid-cols-2">
					<Education title={education.title} items={bio.education} />
					<Interest title={interests.title} items={bio.interests} />
				</div>
			</div>
		</section>
	);
}
