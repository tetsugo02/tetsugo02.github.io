"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Waypoints, Wrench } from "lucide-react";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import { SnsBar } from "@/components/molecules/snsBar";

export interface SidebarLabels {
	about: string;
	skills: string;
	works: string;
}

export const SidebarContentView = ({
	locale,
	labels,
	mobile = false,
}: {
	locale: Locale;
	labels: SidebarLabels;
	mobile?: boolean;
}) => {
	const pathname = usePathname();
	const items = [
		{ title: labels.about, href: `/${locale}`, icon: Inbox },
		{ title: labels.skills, href: `/${locale}/skills`, icon: Wrench },
		{ title: labels.works, href: `/${locale}/works`, icon: Waypoints },
	];

	return (
		<div className={cn("flex h-full flex-col", mobile ? "px-4 py-5" : "px-5 py-8")}>
			<div className="flex flex-col items-center text-center">
				<Image
					src="/avatar.png"
					alt="Tetsugo To"
					className="size-32 rounded-full border-2 border-border object-cover"
					width={128}
					height={128}
					priority
				/>
				<p className="mt-4 text-xl font-bold">Tetsugo To</p>
				<p className="mt-0.5 text-base text-muted-foreground">董 哲豪</p>
				<div className="mt-4">
					<SnsBar />
				</div>
			</div>

			<nav aria-label="Primary navigation" className="mt-10">
				<ul className="space-y-2">
					{items.map((item) => {
						const active =
							item.href === `/${locale}`
								? pathname === item.href
								: pathname.startsWith(item.href);
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									aria-current={active ? "page" : undefined}
									className={cn(
										"flex min-h-12 items-center gap-3 rounded-lg px-4 text-base font-medium transition-colors",
										active
											? "bg-primary text-primary-foreground shadow-sm"
											: "text-muted-foreground hover:bg-accent hover:text-foreground"
									)}
								>
									<item.icon aria-hidden="true" className="size-5 shrink-0" />
									<span>{item.title}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
};

export const AppSidebar = ({
	locale,
	labels,
}: {
	locale: Locale;
	labels: SidebarLabels;
}) => (
	<aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border bg-sidebar lg:block">
		<SidebarContentView locale={locale} labels={labels} />
	</aside>
);
