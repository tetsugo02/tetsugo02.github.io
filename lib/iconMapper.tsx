import {
	Code,
	Database,
	Globe,
	Layout,
	Server,
	Terminal,
	Smartphone,
	Cpu,
	Cloud,
	Box,
	PenTool,
	GitBranch,
} from "lucide-react";
import { BsGpuCard } from "react-icons/bs";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { FaPython, FaReact, FaAws, FaDocker, FaNodeJs, FaRust } from "react-icons/fa6";
import {
	SiNextdotjs,
	SiTypescript,
	SiJavascript,
	SiTailwindcss,
	SiPostgresql,
	SiMongodb,
	SiGraphql,
	SiGo,
} from "react-icons/si";

export type IconComponent = LucideIcon | IconType;

export const iconMap: Record<string, IconComponent> = {
	code: Code,
	database: Database,
	web: Globe,
	layout: Layout,
	server: Server,
	terminal: Terminal,
	mobile: Smartphone,
	cpu: Cpu,
	cloud: Cloud,
	box: Box,
	design: PenTool,
	git: GitBranch,
	// Tech Stack via react-icons
	python: FaPython,
	react: FaReact,
	aws: FaAws,
	docker: FaDocker,
	node: FaNodeJs,
	rust: FaRust,
	nextjs: SiNextdotjs,
	typescript: SiTypescript,
	javascript: SiJavascript,
	tailwind: SiTailwindcss,
	postgres: SiPostgresql,
	mongo: SiMongodb,
	graphql: SiGraphql,
	go: SiGo,
	gpu: BsGpuCard,
};

export const getIconByName = (name?: string): IconComponent | null => {
	if (!name) return null;
	const key = name.toLowerCase();
	return iconMap[key] || null;
};
