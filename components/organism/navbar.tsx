"use client";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SunMoon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { LanguageSelector } from "../molecules/languageSelector";
import { SidebarSheet } from "./sidebarSheet";

export const Navibar = () => {
	const { theme, setTheme } = useTheme();
	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="flex h-16 items-center justify-between px-4 sm:px-8 lg:px-8 lg:max-w-6xl lg:mx-auto">
				<NavigationMenu viewport={false}>
					<NavigationMenuList className="gap-1">
						<NavigationMenuItem className="lg:hidden">
							<SidebarSheet />
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
				<NavigationMenu viewport={false}>
					<NavigationMenuList className="gap-1">
						<NavigationMenuItem>
							<LanguageSelector />
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Button variant="ghost" className="h-10 w-10 md:h-12 md:w-12" onClick={toggleTheme}>
								<SunMoon className="h-5 w-5 md:h-6 md:w-6" />
							</Button>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</header>
	);
};
