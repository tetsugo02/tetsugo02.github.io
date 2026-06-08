import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { WorkBlockType } from "@/types/workBlockType";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "works.yaml");
const PREVIEW_FILE_PATH = path.join(process.cwd(), "data", "works-preview.json");

type WorksPreviewMap = Record<
	string,
	{
		image?: string;
	}
>;

const getWorksPreviewData = (): WorksPreviewMap => {
	try {
		if (!fs.existsSync(PREVIEW_FILE_PATH)) return {};
		return JSON.parse(fs.readFileSync(PREVIEW_FILE_PATH, "utf8")) as WorksPreviewMap;
	} catch (error) {
		console.error("Error loading works preview data:", error);
		return {};
	}
};

export const getWorksData = (): WorkBlockType[] => {
	try {
		if (!fs.existsSync(DATA_FILE_PATH)) {
			console.warn(`Data file not found at ${DATA_FILE_PATH}`);
			return [];
		}
		const fileContents = fs.readFileSync(DATA_FILE_PATH, "utf8");
		const data = yaml.load(fileContents) as WorkBlockType[];
		const previews = getWorksPreviewData();

		return (data || []).map((work) => {
			const primaryLink = work.link?.[0];
			const previewImageUrl = primaryLink ? previews[primaryLink]?.image : undefined;

			return {
				...work,
				imageUrl: work.imageUrl || previewImageUrl,
			};
		});
	} catch (error) {
		console.error("Error loading works data:", error);
		return [];
	}
};
