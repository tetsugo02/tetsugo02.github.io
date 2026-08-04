import type { WorkType } from "@/types/workBlockType";

export const getWorkTypeBadge = (type: WorkType) => {
	switch (type) {
		case "event":
			return {
				name: "Event",
				className:
					"border-amber-300/70 bg-amber-100 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/60 dark:text-amber-200",
			};
		case "oss":
			return {
				name: "OSS",
				className:
					"border-emerald-300/70 bg-emerald-100 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-950/60 dark:text-emerald-200",
			};
		case "article":
			return {
				name: "Article",
				className:
					"border-sky-300/70 bg-sky-100 text-sky-900 dark:border-sky-700/60 dark:bg-sky-950/60 dark:text-sky-200",
			};
		case "publication":
			return {
				name: "Publication",
				className:
					"border-violet-300/70 bg-violet-100 text-violet-900 dark:border-violet-700/60 dark:bg-violet-950/60 dark:text-violet-200",
			};
		default:
			return {
				name: "Other",
				className:
					"border-slate-300/70 bg-slate-100 text-slate-800 dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-200",
			};
	}
};
