import { useEffect } from "react";
import { githubDataAtom } from "@/store/githubDataAtom";
import { useAtom } from "jotai";
import { getSpecificGithubEvent } from "@/lib/getworks/getGithubEvent";

export const useInitData = () => {
	const [githubEventData, setGithubEventData] = useAtom(githubDataAtom);

	useEffect(() => {
		const fetchData = async () => {
			const events = await getSpecificGithubEvent();
			setGithubEventData(events);
		};
		fetchData();
	}, [setGithubEventData]);
	return { githubEventData };
};
