import fs from "node:fs";
import path from "node:path";
import experiencePreviews from "@/data/experience-preview.json";

export type ExperiencePreview = {
	title?: string;
	description?: string;
	image?: string;
	siteName?: string;
	url?: string;
	fetchedAt?: string;
	error?: string;
};

export type ExperiencePreviewMap = Record<string, ExperiencePreview>;

const staticPreviewPath = path.join(
	process.cwd(),
	".cache",
	"experience-preview.json"
);

export const getExperiencePreviews = (): ExperiencePreviewMap => {
	if (fs.existsSync(staticPreviewPath)) {
		try {
			return JSON.parse(fs.readFileSync(staticPreviewPath, "utf8")) as ExperiencePreviewMap;
		} catch {
			// Fall back to the tracked remote OG URLs during local development.
		}
	}

	return experiencePreviews as ExperiencePreviewMap;
};
