"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n";

export const LanguageSelector = ({
	locale,
	label,
}: {
	locale: Locale;
	label: string;
}) => {
	const pathname = usePathname();
	const nextLocale: Locale = locale === "ja" ? "en" : "ja";
	const nextPath = pathname.replace(/^\/(ja|en)(?=\/|$)/, `/${nextLocale}`);

	return (
		<Link
			href={nextPath}
			hrefLang={nextLocale}
			lang={nextLocale}
			aria-label={`${label}: ${nextLocale === "ja" ? "日本語" : "English"}`}
			onClick={() => {
				document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
			}}
			className="flex h-9 min-w-11 items-center justify-center rounded-sm px-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
		>
			{nextLocale.toUpperCase()}
		</Link>
	);
};
