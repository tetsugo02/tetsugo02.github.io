import "../globals.css";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/atom/themeProvider";
import { Navibar } from "@/components/organism/navbar";
import { AppSidebar } from "@/components/organism/appSidebar";
import { WorksPreviewPreloader } from "@/components/atom/worksPreviewPreloader";
import { getWorksData } from "@/lib/worksLoader";
import { getDictionary, isLocale, locales, type Locale } from "@/i18n";

const notoSansJP = Noto_Sans_JP({
	variable: "--font-noto-sans-jp",
	weight: ["400", "500", "600", "700"],
	preload: false,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tetsugo02-github-io.vercel.app";

export function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	if (!isLocale(lang)) return {};

	const isJapanese = lang === "ja";
	const title = isJapanese ? "董 哲豪 | Tetsugo To" : "Tetsugo To";
	const description = isJapanese
		? "ソフトウェアエンジニア・研究者、董 哲豪の個人ウェブサイト"
		: "Personal website of Tetsugo To, software engineer and researcher.";

	return {
		title: {
			default: title,
			template: `%s | ${isJapanese ? "董 哲豪" : "Tetsugo To"}`,
		},
		description,
		icons: { icon: "/avatar.ico" },
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: `/${lang}`,
			languages: {
				en: "/en",
				ja: "/ja",
			},
		},
		openGraph: {
			title,
			description,
			images: [{ url: "/api/og", width: 1200, height: 630 }],
			locale: isJapanese ? "ja_JP" : "en_US",
			alternateLocale: [isJapanese ? "en_US" : "ja_JP"],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: ["/api/og"],
		},
	};
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}>) {
	const { lang } = await params;
	if (!isLocale(lang)) notFound();

	const dictionary = getDictionary(lang);
	const works = getWorksData();
	const worksImageUrls = works
		.map((work) => work.imageUrl)
		.filter((imageUrl): imageUrl is string => Boolean(imageUrl));
	const worksPreviewUrls = works
		.filter((work) => !work.imageUrl)
		.map((work) => work.link?.[0])
		.filter((url): url is string => Boolean(url));

	return (
		<html lang={lang} suppressHydrationWarning>
			<body
				className={`${notoSansJP.variable} ${
					lang === "ja" ? "font-ja" : "font-en"
				} bg-background text-foreground antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<WorksPreviewPreloader urls={worksPreviewUrls} imageUrls={worksImageUrls} />
					<div className="flex min-h-screen w-full">
						<AppSidebar
							locale={lang as Locale}
							labels={dictionary.common.navigation}
						/>
						<div className="flex min-w-0 flex-1 flex-col">
							<Navibar
								locale={lang as Locale}
								labels={{
									siteName: dictionary.common.siteName,
									about: dictionary.common.navigation.about,
									skills: dictionary.common.navigation.skills,
									works: dictionary.common.navigation.works,
									changeLanguage: dictionary.common.controls.changeLanguage,
									changeTheme: dictionary.common.controls.changeTheme,
									openMenu: dictionary.common.controls.openMenu,
									close: dictionary.common.controls.close,
								}}
							/>
							<main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
								{children}
							</main>
							<footer className="mx-auto flex w-full max-w-6xl items-center justify-between border-t border-border px-5 py-6 text-xs text-muted-foreground sm:px-8 lg:px-10">
								<span>© {new Date().getFullYear()} Tetsugo To</span>
								<span>Tokyo, Japan</span>
							</footer>
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
