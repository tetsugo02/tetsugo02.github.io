import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/atom/themeProvider";
import { AppSidebar } from "@/components/organism/appSidebar";
import { Navibar } from "@/components/organism/navbar";
import { I18nClientProvider } from "@/components/atom/i18nProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Tetsugo",
	description: "tetsugo's personal website",
	icons: {
		icon: "/avatar.ico",
	},
	openGraph: {
		title: "Tetsugo To",
		description:
			"Software Engineer / Researcher - Machine Learning, Computer Systems, OSS Contributor",
		images: [
			{
				url: "/api/og",
				width: 1200,
				height: 630,
			},
		],
		locale: "ja_JP",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Tetsugo To",
		description: "Software Engineer / Researcher",
		images: ["/api/og"],
	},
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://tetsugo02.github.io"),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<I18nClientProvider>
						<SidebarProvider>
							<div className="flex h-screen w-full">
								<div className="shrink-0 h-full">
									<AppSidebar />
								</div>
								<div className="flex flex-col flex-1 w-full overflow-hidden">
									<Navibar />
									<main className="flex-1 w-full overflow-y-auto overflow-x-hidden">
										<div className="w-full px-6 sm:px-8 md:px-8 lg:max-w-6xl lg:mx-auto flex flex-col gap-6 justify-items-start h-fit py-4 sm:py-8">
											{children}
										</div>
									</main>
								</div>
							</div>
						</SidebarProvider>
					</I18nClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
