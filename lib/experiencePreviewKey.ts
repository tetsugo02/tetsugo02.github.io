export const getExperiencePreviewKey = (url: string, ogUrl?: string) =>
	ogUrl ? `${url}::${ogUrl}` : url;
