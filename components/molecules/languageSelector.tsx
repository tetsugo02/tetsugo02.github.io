"use client";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export const LanguageSelector = () => {
	const { i18n, t } = useTranslation();
	const currentValue = i18n.language?.startsWith("ja") ? "ja" : "en";

	const changeLanguage = (value: string) => {
		const normalized = value.split("-")[0];
		i18n.changeLanguage(normalized);
		// オプション：言語設定をローカルストレージに保存
		localStorage.setItem("i18nextLng", normalized);
	};

	// 初期言語設定の適用
	useEffect(() => {
		const savedLang = localStorage.getItem("i18nextLng");
		if (!savedLang) return;
		const normalized = savedLang.split("-")[0];
		if (normalized && normalized !== savedLang) {
			localStorage.setItem("i18nextLng", normalized);
		}
		if (normalized && i18n.language !== normalized) {
			i18n.changeLanguage(normalized);
		}
	}, [i18n]);

	return (
		<Select value={currentValue} onValueChange={changeLanguage}>
			<SelectTrigger className="w-32">
				<SelectValue placeholder={currentValue === "en" ? "English" : "日本語"} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="en">{t("languages.english")}</SelectItem>
				<SelectItem value="ja">{t("languages.japanese")}</SelectItem>
			</SelectContent>
		</Select>
	);
};
