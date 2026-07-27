import commonEN from "./locales/en/common.json";
import commonJA from "./locales/ja/common.json";
import homeEN from "./locales/en/home.json";
import homeJA from "./locales/ja/home.json";
import skillsEN from "./locales/en/skills.json";
import skillsJA from "./locales/ja/skills.json";

export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries = {
	en: {
		common: commonEN,
		home: homeEN,
		skills: skillsEN,
	},
	ja: {
		common: commonJA,
		home: homeJA,
		skills: skillsJA,
	},
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export const isLocale = (value: string): value is Locale =>
	locales.includes(value as Locale);

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
