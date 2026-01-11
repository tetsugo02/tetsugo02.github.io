import { BioContentType, EducationContent, CareerContent } from "@/types/bioType";
import { TFunction } from "i18next";

export const getBioContent = (t: TFunction): BioContentType => {
	return {
		main: t("bio.main", { returnObjects: true }) as string[],
		interest: t("bio.interests", { returnObjects: true }) as string[],
		education: t("bio.education", { returnObjects: true }) as EducationContent[],
		career: t("bio.career", { returnObjects: true }) as CareerContent[],
	};
};

// 後方互換性のための既存のエクスポート（必要に応じて削除可能）
export const bioContent: BioContentType = {
	main: [
		"I am a undergraduate student at the Keio University in Japan",
		"I also work as a Research Engineer intern.",
	] as string[],
	interest: ["Machine Learning", "Computer Network", "operating system"] as string[],
	education: [
		{
			field: "Keio University, Faculty of Science and Technology ",
			time: "2022/4 ~",
		},
		{
			field: "Keio University, Electronics and Electrical Engineering",
			time: "2023/4 ~",
		},
		{
			field: "keio University, Murata Laboratory",
			time: "2025/4 ~",
		},
	] as EducationContent[],
	career: [] as CareerContent[],
};
