"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LanguageSelector } from "@/components/molecules/languageSelector";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	SidebarContentView,
	type SidebarLabels,
} from "@/components/organism/appSidebar";
import type { Locale } from "@/i18n";

interface NavLabels extends SidebarLabels {
	siteName: string;
	changeLanguage: string;
	changeTheme: string;
	openMenu: string;
	close: string;
}

export const Navibar = ({
	locale,
	labels,
}: {
	locale: Locale;
	labels: NavLabels;
}) => {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:justify-end lg:px-10">
				<div className="flex items-center gap-3 lg:hidden">
					<Dialog>
						<DialogTrigger asChild>
							<button
								type="button"
								aria-label={labels.openMenu}
								className="flex size-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<Menu aria-hidden="true" className="size-5" />
							</button>
						</DialogTrigger>
						<DialogContent
							closeLabel={labels.close}
							className="inset-y-0 left-0 top-0 h-screen max-h-screen w-[min(85vw,20rem)] max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-0"
						>
							<DialogTitle className="sr-only">{labels.openMenu}</DialogTitle>
							<SidebarContentView
								locale={locale}
								labels={{
									about: labels.about,
									skills: labels.skills,
									works: labels.works,
								}}
								mobile
							/>
						</DialogContent>
					</Dialog>
					<span className="text-base font-bold">{labels.siteName}</span>
				</div>

				<div className="flex items-center gap-2">
					<LanguageSelector locale={locale} label={labels.changeLanguage} />
					<button
						type="button"
						aria-label={labels.changeTheme}
						onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
						className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						{mounted && resolvedTheme === "dark" ? (
							<Sun aria-hidden="true" className="size-5" />
						) : (
							<Moon aria-hidden="true" className="size-5" />
						)}
					</button>
				</div>
			</div>
		</header>
	);
};
