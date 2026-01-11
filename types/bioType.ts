export interface EducationContent {
	field: string;
	time: string;
}

export interface CareerContent {
	title: string;
	company: string;
	period: string;
	description?: string;
	url?: string;
}

export type BioContentType = {
	main: string[];
	interest: string[];
	education: EducationContent[];
	career: CareerContent[];
};
