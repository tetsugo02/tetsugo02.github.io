import { WorkType } from "@/types/workBlockType";

export const getWorkTypeBadge = (type: WorkType) => {
	switch (type) {
		case "event":
			return {
				name: "Event",
				className: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
			};
		case "oss":
			return {
				name: "OSS",
				className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
			};
		case "article":
			return {
				name: "Article",
				className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
			};
		case "publication":
			return {
				name: "Publication",
				className: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
			};
		default:
			return {
				name: "Other",
				className: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
			};
	}
};
