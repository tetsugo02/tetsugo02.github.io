import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkBlock } from "@/components/organism/works/workBlock";
import { worksContent } from "@/constant/works/works";
import { PageAnimationWrapper } from "@/components/atom/pageAnimationWrapper";

const WorksPage = () => {
	return (
		<PageAnimationWrapper>
			<Tabs defaultValue="all" className="w-full h-fit m-auto lg:w-3/4 ">
				<TabsList className="grid w-full grid-cols-2 grid-rows-2 h-1/10 lg:grid-cols-4 lg:grid-rows-1 lg:h-1/20">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="research">Research</TabsTrigger>
					<TabsTrigger value="development">Development</TabsTrigger>
					<TabsTrigger value="other">Other</TabsTrigger>
				</TabsList>
				<TabsContent value="all" className="w-full h-full ">
					<div className="w-full h-full flex flex-wrap gap-4 justify-center mt-2 lg:justify-between">
						{worksContent.map((work, index) => (
							<WorkBlock
								key={index}
								title={work.title}
								description={work.description}
								link={work.link}
								workType={work.workType}
								badges={work.badges}
							/>
						))}
					</div>
				</TabsContent>
				<TabsContent value="research" className="w-full h-full ">
					<div className="w-full h-full flex flex-wrap gap-4 justify-center mt-2 lg:justify-between">
						{worksContent
							.filter((work) => work.workType === "research")
							.map((work, index) => (
								<WorkBlock
									key={index}
									title={work.title}
									description={work.description}
									link={work.link}
									workType={work.workType}
									badges={work.badges}
								/>
							))}
					</div>
				</TabsContent>
				<TabsContent value="development" className="w-full h-full ">
					<div className="w-full h-full flex flex-wrap gap-4 justify-center mt-2 lg:justify-between">
						{worksContent
							.filter((work) => work.workType === "development")
							.map((work, index) => (
								<WorkBlock
									key={index}
									title={work.title}
									description={work.description}
									link={work.link}
									workType={work.workType}
									badges={work.badges}
								/>
							))}
					</div>
				</TabsContent>
				<TabsContent value="other" className="w-full h-full ">
					<div className="w-full h-full flex flex-wrap gap-4 justify-center mt-2 lg:justify-between">
						{worksContent
							.filter((work) => work.workType === "other")
							.map((work, index) => (
								<WorkBlock
									key={index}
									title={work.title}
									description={work.description}
									link={work.link}
									workType={work.workType}
									badges={work.badges}
								/>
							))}
					</div>
				</TabsContent>
			</Tabs>
		</PageAnimationWrapper>
	);
};
export default WorksPage;
