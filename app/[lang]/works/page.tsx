import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkBlock } from "@/components/organism/works/workBlock";
import { getWorksData } from "@/lib/worksLoader";
import { ResolvedWorkBlockType, WorkType, type LocalizedText } from "@/types/workBlockType";
import { getDictionary, isLocale, type Locale } from "@/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface WorkLabels {
	empty: string;
	noPreview: string;
	viewDetails: string;
	links: string;
	close: string;
	types: Record<WorkType, string>;
}

const WorkGrid = ({
	type,
	works,
	labels,
}: {
	type?: WorkType;
	works: ResolvedWorkBlockType[];
	labels: WorkLabels;
}) => {
	const filteredWorks = type ? works.filter((work) => work.workType === type) : works;

	if (filteredWorks.length === 0) {
		return (
			<div className="flex h-64 w-full items-center justify-center border-t border-border text-muted-foreground">
				{labels.empty}
			</div>
		);
	}

	return (
		<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{filteredWorks.map((work) => (
				<WorkBlock key={`${work.workType}-${work.title}`} work={work} labels={labels} />
			))}
		</div>
	);
};

const localize = (value: LocalizedText | undefined, locale: Locale) => {
	if (!value) return "";
	return typeof value === "string" ? value : value[locale] || value.en || value.ja;
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	return { title: lang === "ja" ? "主な実績" : "Selected Works" };
}

const WorksPage = async ({ params }: { params: Promise<{ lang: string }> }) => {
	const { lang } = await params;
	if (!isLocale(lang)) notFound();

	const dictionary = getDictionary(lang);
	const copy = dictionary.common.works;
	const works: ResolvedWorkBlockType[] = getWorksData().map((work) => ({
		...work,
		title: localize(work.title, lang),
		description: localize(work.description, lang),
		authors: work.authors?.map((author) => localize(author, lang)),
		conference: localize(work.conference, lang) || undefined,
	}));
	const labels: WorkLabels = {
		empty: copy.empty,
		noPreview: copy.noPreview,
		viewDetails: copy.viewDetails,
		links: copy.links,
		close: dictionary.common.controls.close,
		types: copy.types,
	};

	return (
		<div>
			<header className="mx-auto max-w-3xl text-center">
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					{copy.title}
				</h1>
				<p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">{copy.intro}</p>
			</header>

			<Tabs defaultValue="all" className="mt-8 w-full">
				<TabsList className="h-auto w-full justify-start overflow-x-auto p-1">
					<TabsTrigger value="all">
						{copy.filters.all}
					</TabsTrigger>
					<TabsTrigger value="event">
						{copy.filters.event}
					</TabsTrigger>
					<TabsTrigger value="oss">
						{copy.filters.oss}
					</TabsTrigger>
					<TabsTrigger value="article">
						{copy.filters.article}
					</TabsTrigger>
					<TabsTrigger value="publication">
						{copy.filters.publication}
					</TabsTrigger>
					<TabsTrigger value="other">
						{copy.filters.other}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<WorkGrid works={works} labels={labels} />
				</TabsContent>
				<TabsContent value="event">
					<WorkGrid works={works} type="event" labels={labels} />
				</TabsContent>
				<TabsContent value="oss">
					<WorkGrid works={works} type="oss" labels={labels} />
				</TabsContent>
				<TabsContent value="article">
					<WorkGrid works={works} type="article" labels={labels} />
				</TabsContent>
				<TabsContent value="publication">
					<WorkGrid works={works} type="publication" labels={labels} />
				</TabsContent>
				<TabsContent value="other">
					<WorkGrid works={works} type="other" labels={labels} />
				</TabsContent>
			</Tabs>
		</div>
	);
};
export default WorksPage;
