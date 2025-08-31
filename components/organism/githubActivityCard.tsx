import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Separator } from "../ui/separator";
import { GitHubEventTypeKey } from "@/types/githubEventsType";
import { getActivityCardDetail } from "@/lib/getworks/getActivityCardDetail";
import { GithubEvent } from "@/store/githubDataAtom";

// Open Graph画像取得関数（hostされたサーバーを利用)
const op_proxyUrl = "https://op-porxy.vercel.app/api/parse-ogp";
const fetchOgImage = async (targetUrl: string): Promise<string | null> => {
	try {
		const response = await fetch(op_proxyUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: targetUrl }),
		});

		if (!response.ok) {
			throw new Error("APIリクエストが失敗しました。");
		}

		const result = await response.json();
		return result.data;
	} catch {
		return null;
	}
};

interface GithubActivityCardProps {
	data: GithubEvent;
}

export const GithubActivityCard = ({ data }: GithubActivityCardProps) => {
	const activityType: GitHubEventTypeKey = data.type as GitHubEventTypeKey;
	const {
		icon: Icon,
		title,
		url,
		iconColor,
		description,
	} = getActivityCardDetail(activityType, data);

	const [ogImage, setOgImage] = useState<string | null>(null);

	useEffect(() => {
		const getOg = async () => {
			if (url) {
				const img = await fetchOgImage(url);
				setOgImage(img);
			}
		};
		getOg();
	}, []);

	return (
		<Card
			className="w-full max-w-lg flex flex-col h-full pt-0 pb-0 bg-white rounded-xl shadow hover:shadow-xl transition-all cursor-pointer overflow-hidden"
			onClick={() => window.open(url.startsWith("http") ? url : `https://${url}`, "_blank")}
		>
			{/* 上部：Open Graph画像 */}
			{ogImage ? (
				<img src={ogImage} alt="Open Graph" className="w-full object-cover" />
			) : (
				<div className="w-full h-40 bg-background flex items-center justify-center text-gray-400 text-sm">
					No Preview
				</div>
			)}
			{/* 下部：アイコン＋テキスト */}
			<div className="flex flex-col justify-between flex-1 px-4 py-3">
				<CardContent className="p-0">
					<div className="flex items-center space-x-4">
						<div className="flex items-center justify-center w-12 h-12 rounded-xl">
							<Icon size={28} color={iconColor} />
						</div>
						<Separator orientation="vertical" className="h-8" />
						<div className="flex flex-col space-y-1">
							<h3 className="text-base font-semibold leading-none text-gray-900">{title}</h3>
							{description && <p className="text-xs text-gray-500">{description}</p>}
						</div>
					</div>
				</CardContent>
				<CardFooter className="pt-2 pb-0 text-xs text-gray-400">
					<p>{url.replace(/^https?:\/\//, "")}</p>
				</CardFooter>
			</div>
		</Card>
	);
};
