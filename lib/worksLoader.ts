import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { WorkBlockType } from "@/types/workBlockType";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "works.yaml");

export const getWorksData = (): WorkBlockType[] => {
	try {
		if (!fs.existsSync(DATA_FILE_PATH)) {
			console.warn(`Data file not found at ${DATA_FILE_PATH}`);
			return [];
		}
		const fileContents = fs.readFileSync(DATA_FILE_PATH, "utf8");
		const data = yaml.load(fileContents) as WorkBlockType[];
		return data || [];
	} catch (error) {
		console.error("Error loading works data:", error);
		return [];
	}
};
