import { TechSkillGridInterface } from "@/types/techSkillGridType";
import { FaPython } from "react-icons/fa";
import { SiTypescript, SiPytorch, SiLinux, SiNumpy, SiCplusplus } from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { FaUnity } from "react-icons/fa6";

const iconMap = {
	Python: FaPython,
	TypeScript: SiTypescript,
	"C++": SiCplusplus,
	React: FaReact,
	"Next.js": RiNextjsFill,
	PyTorch: SiPytorch,
	Linux: SiLinux,
	NumPy: SiNumpy,
	Unity: FaUnity,
};

export const getTechSkillList = (
	skillsData: readonly { name: string }[]
): TechSkillGridInterface[] => {
	return skillsData.map((skill) => ({
		name: skill.name,
		icon: iconMap[skill.name as keyof typeof iconMap] || FaPython,
	}));
};
