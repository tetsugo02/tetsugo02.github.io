import { GithubActivityCard } from "./githubActivityCard";
import { GithubEvent } from "@/store/githubDataAtom";

export interface RecentExperienceProps {
	githubEventData: GithubEvent[] | null;
}

export const RecentExperience = ({ githubEventData }: RecentExperienceProps) => {
	if (!githubEventData) return null;
	const minlength = Math.min(githubEventData.length, 10);
	const limitedData = githubEventData.slice(0, minlength);

	return (
		<div className="w-full h-fit flex flex-col space-y-4 items-center">
			{limitedData.map((eventData) => {
				return <GithubActivityCard data={eventData} key={eventData.id} />;
			})}
		</div>
	);
};
