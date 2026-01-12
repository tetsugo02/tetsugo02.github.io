"use client";

import { ReactNode, useEffect } from "react";
import i18next from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources, defaultNS, fallbackLng } from "@/i18n";
import { useMemo } from "react";

export function I18nClientProvider({ children }: { children: ReactNode }) {
	const i18n = useMemo(() => {
		const instance = i18next.createInstance().use(LanguageDetector).use(initReactI18next);

		instance.init({
			resources,
			defaultNS,
			fallbackLng,
			lng: undefined, // 検出またはローカルストレージから取得
			supportedLngs: ["en", "ja"],
			nonExplicitSupportedLngs: true,
			load: "languageOnly",
			detection: {
				order: ["localStorage", "navigator"],
				caches: ["localStorage"],
				lookupLocalStorage: "i18nextLng",
				convertDetectedLanguage: (lng: string) => lng.split("-")[0],
			},
			debug: process.env.NODE_ENV === "development",
			interpolation: {
				escapeValue: false, // React already safes from XSS
			},
		});

		return instance;
	}, []);

	useEffect(() => {
		// LanguageDetector が ja-JP などを保存することがあるので正規化して維持する
		const savedLng = localStorage.getItem("i18nextLng");
		if (!savedLng) return;
		const normalized = savedLng.split("-")[0];
		if (normalized && normalized !== savedLng) {
			localStorage.setItem("i18nextLng", normalized);
		}
		if (normalized && i18n.language !== normalized) {
			i18n.changeLanguage(normalized);
		}
	}, [i18n]);

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
