export type WorkType = "event" | "oss" | "article" | "publication" | "other";
export type LocalizedText = string | { ja: string; en: string };

export interface WorkBlockType {
	title: LocalizedText;
	workType: WorkType;
	date?: string;
	link?: string[];
	description: LocalizedText;
	authors?: LocalizedText[];
	conference?: LocalizedText;
	badges?: BadgeType[];
	imageUrl?: string;
}

export interface ResolvedWorkBlockType
	extends Omit<WorkBlockType, "title" | "description" | "authors" | "conference"> {
	title: string;
	description: string;
	authors?: string[];
	conference?: string;
}

export interface BadgeType {
	name: string;
	className?: string;
	iconName?: string;
}
