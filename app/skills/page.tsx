"use client";

import { LanguagesSkill } from "@/components/organism/skill/languagesSkill";
import { TechSkill } from "@/components/organism/skill/techSkill";
import { Certification } from "@/components/organism/skill/certification";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { animate } from "motion";

const SkillsPage = () => {
	const { i18n } = useTranslation();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (i18n.isInitialized) {
			setIsReady(true);
		} else {
			const handleInit = () => setIsReady(true);
			i18n.on("initialized", handleInit);
			return () => i18n.off("initialized", handleInit);
		}
	}, [i18n]);

	const pageRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const el = pageRef.current;
		if (!el) return;
		const children = Array.from(el.querySelectorAll(":scope > *")) as HTMLElement[];
		children.forEach((c) => {
			c.style.opacity = "0";
			c.style.transform = "translateY(12px)";
		});
		children.forEach((c, i) => {
			const props = { opacity: 1, transform: "translateY(0px)" } as const;
			const opts = { delay: i * 0.06, duration: 0.28 } as const;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			animate(c as any, props as any, opts as any);
		});
	}, [isReady]);

	if (!isReady) {
		return (
			<div className="flex items-center justify-center h-64">
				<div>Loading...</div>
			</div>
		);
	}

	return (
		<div ref={pageRef}>
			<div className="grid grid-cols-1 lg:grid-cols-2 mx-0 px-0 h-fit">
				<TechSkill />
				<Certification />
			</div>
			<LanguagesSkill />
		</div>
	);
};

export default SkillsPage;
