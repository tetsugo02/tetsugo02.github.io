import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const url = searchParams.get("url");

	if (!url) {
		return NextResponse.json({ error: "URL is required" }, { status: 400 });
	}

	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": "bot-crawler", // Some sites block requests without UA
			},
		});

		if (!response.ok) {
			return NextResponse.json({ error: "Failed to fetch URL" }, { status: response.status });
		}

		const html = await response.text();
		const $ = cheerio.load(html);

		const getMetaTag = (name: string) =>
			$(`meta[name="${name}"]`).attr("content") ||
			$(`meta[property="${name}"]`).attr("content") ||
			$(`meta[property="og:${name}"]`).attr("content");

		const title = getMetaTag("title") || $("title").text() || "";
		const description = getMetaTag("description") || "";
		const image = getMetaTag("image") || "";
		const siteName = getMetaTag("site_name") || "";

		return NextResponse.json({
			title,
			description,
			image,
			siteName,
			url,
		});
	} catch (error) {
		console.error("Error fetching preview:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
