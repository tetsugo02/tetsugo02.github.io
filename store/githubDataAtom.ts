import { atom } from "jotai";

// getSpecificGithubEventの戻り値型を定義
export type GithubEvent = {
	id: string;
	type: string | null;
	actor: {
		id: number;
		login: string;
		display_login?: string;
		gravatar_id: string | null;
		url: string;
		avatar_url: string;
	};
	repo: {
		id: number;
		name: string;
		url: string;
	};
	org?: {
		id: number;
		login: string;
		display_login?: string;
		gravatar_id: string | null;
		url: string;
		avatar_url: string;
	};
	payload: {
		forkee?: {
			id: number;
			full_name: string;
			html_url: string;
		};
		action?: string;
		issue?: {
			title?: string;
			html_url?: string;
		};
		comment?: unknown;
		pages?: unknown[];
		pull_request?: {
			title?: string;
			html_url?: string;
		};
		ref_type?: string;
		ref?: string;
	};
	public: boolean;
	created_at: string | null;
};

export const githubDataAtom = atom<GithubEvent[] | null>(null);
