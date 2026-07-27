import { LanguagesSkill } from "@/components/organism/skill/languagesSkill";
import { TechSkill } from "@/components/organism/skill/techSkill";
import { Certification } from "@/components/organism/skill/certification";
import { getDictionary, isLocale } from "@/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	return { title: lang === "ja" ? "スキル" : "Skills" };
}

const SkillsPage = async ({ params }: { params: Promise<{ lang: string }> }) => {
	const { lang } = await params;
	if (!isLocale(lang)) notFound();
	const { skills } = getDictionary(lang);

	return (
		<div>
			<header className="max-w-3xl">
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					{skills.title}
				</h1>
				<p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">{skills.intro}</p>
			</header>

			<div className="mt-8 space-y-6">
				<TechSkill
					title={skills.skillsSection.technical}
					skills={skills.skills.technicalSkills}
				/>
				<div className="grid gap-6 lg:grid-cols-2">
					<LanguagesSkill
						title={skills.skillsSection.languages}
						languages={skills.skills.languageSkills}
					/>
					<Certification
						title={skills.skillsSection.certifications}
						certifications={skills.skills.certifications}
					/>
				</div>
			</div>
		</div>
	);
};

export default SkillsPage;
