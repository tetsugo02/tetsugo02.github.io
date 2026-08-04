import cPlusPlusIcon from "@iconify-icons/logos/c-plusplus";
import linuxIcon from "@iconify-icons/logos/linux-tux";
import nextJsIcon from "@iconify-icons/logos/nextjs-icon";
import numpyIcon from "@iconify-icons/logos/numpy";
import pythonIcon from "@iconify-icons/logos/python";
import pytorchIcon from "@iconify-icons/logos/pytorch";
import reactIcon from "@iconify-icons/logos/react";
import typescriptIcon from "@iconify-icons/logos/typescript-icon";
import unityIcon from "@iconify-icons/logos/unity";
import rustIcon from "@iconify-icons/simple-icons/rust";
import type { TechSkillGridInterface } from "@/types/techSkillGridType";

const iconMap = {
	Python: { icon: pythonIcon },
	TypeScript: { icon: typescriptIcon },
	"C++": { icon: cPlusPlusIcon },
	Rust: { icon: rustIcon, color: "#CE422B" },
	React: { icon: reactIcon },
	"Next.js": { icon: nextJsIcon },
	PyTorch: { icon: pytorchIcon },
	Linux: { icon: linuxIcon },
	NumPy: { icon: numpyIcon },
	Unity: { icon: unityIcon, className: "rounded-sm bg-white p-0.5" },
};

export const getTechSkillList = (
	skillsData: readonly { name: string }[]
): TechSkillGridInterface[] => {
	return skillsData.map((skill) => {
		const iconConfig =
			iconMap[skill.name as keyof typeof iconMap] ?? iconMap.Python;

		return {
			name: skill.name,
			...iconConfig,
		};
	});
};
