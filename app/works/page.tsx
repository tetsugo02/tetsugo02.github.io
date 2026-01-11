import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkBlock } from "@/components/organism/works/workBlock";
import { getWorksData } from "@/lib/worksLoader";
import { PageAnimationWrapper } from "@/components/atom/pageAnimationWrapper";
import { WorkBlockType, WorkType } from "@/types/workBlockType";

const WorkGrid = ({ type, works }: { type?: WorkType; works: WorkBlockType[] }) => {
	const filteredWorks = type ? works.filter((work) => work.workType === type) : works;

	if (filteredWorks.length === 0) {
		return (
			<div className="w-full h-64 flex items-center justify-center text-muted-foreground">
				No works found.
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
			{filteredWorks.map((work, index) => (
				<WorkBlock
					key={index}
					title={work.title}
					description={work.description}
					link={work.link}
					workType={work.workType}
					badges={work.badges}
					date={work.date}
				/>
			))}
		</div>
	);
};

const WorksPage = () => {
	const works = getWorksData();

	return (
		<PageAnimationWrapper>
			<div className="w-full flex justify-center pb-8">
				<h1 className="text-3xl font-bold tracking-tight">Works</h1>
			</div>

			<Tabs defaultValue="all" className="w-full max-w-6xl mx-auto">
				<TabsList className="w-full flex-wrap h-auto p-1 justify-start overflow-x-auto">
					<TabsTrigger value="all" className="flex-shrink-0">
						All
					</TabsTrigger>
					<TabsTrigger value="event" className="flex-shrink-0">
						Events
					</TabsTrigger>
					<TabsTrigger value="oss" className="flex-shrink-0">
						OSS
					</TabsTrigger>
					<TabsTrigger value="article" className="flex-shrink-0">
						Articles
					</TabsTrigger>
					<TabsTrigger value="publication" className="flex-shrink-0">
						Publications
					</TabsTrigger>
					<TabsTrigger value="other" className="flex-shrink-0">
						Other
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="w-full mt-0">
					<WorkGrid works={works} />
				</TabsContent>
				<TabsContent value="event" className="w-full mt-0">
					<WorkGrid works={works} type="event" />
				</TabsContent>
				<TabsContent value="oss" className="w-full mt-0">
					<WorkGrid works={works} type="oss" />
				</TabsContent>
				<TabsContent value="article" className="w-full mt-0">
					<WorkGrid works={works} type="article" />
				</TabsContent>
				<TabsContent value="publication" className="w-full mt-0">
					<WorkGrid works={works} type="publication" />
				</TabsContent>
				<TabsContent value="other" className="w-full mt-0">
					<WorkGrid works={works} type="other" />
				</TabsContent>
			</Tabs>
		</PageAnimationWrapper>
	);
};
export default WorksPage;
