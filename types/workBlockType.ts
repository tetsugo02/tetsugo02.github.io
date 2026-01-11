export type WorkType = "event" | "oss" | "article" | "publication" | "other";

export interface WorkBlockType {
	title: string | { ja: string; en: string };
	workType: WorkType;
	date?: string;
	link?: string[];
	description: string | { ja: string; en: string };
	badges?: BadgeType[];
	imageUrl?: string;
}

export interface BadgeType {
	name: string;
	className?: string;
	iconName?: string;
}
