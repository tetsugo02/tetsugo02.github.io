import { Icon } from "@iconify/react/offline";
import { getTechSkillList } from "@/constant/skills/techSkillGrid";

export const TechSkill = ({
	title,
	skills,
}: {
	title: string;
	skills: readonly { name: string }[];
}) => {
	const techSkillList = getTechSkillList(skills);

	return (
		<section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
			<h2 className="text-xl font-semibold">
				{title}
			</h2>
			<ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
				{techSkillList.map((skill) => (
					<li
						key={skill.name}
						className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background p-3 text-center transition-shadow hover:shadow-md"
					>
						<Icon
							icon={skill.icon}
							aria-hidden="true"
							className={`size-7 ${skill.className ?? ""}`}
							style={skill.color ? { color: skill.color } : undefined}
						/>
						<span className="text-xs font-medium leading-4">{skill.name}</span>
					</li>
				))}
			</ul>
		</section>
	);
};
