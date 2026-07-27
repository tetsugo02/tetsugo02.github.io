import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n";

const localeCookie = "NEXT_LOCALE";

function detectLocale(request: NextRequest): Locale {
	const savedLocale = request.cookies.get(localeCookie)?.value;
	if (savedLocale && isLocale(savedLocale)) return savedLocale;

	const acceptedLanguages = request.headers.get("accept-language")?.toLowerCase() ?? "";
	return acceptedLanguages
		.split(",")
		.map((language) => language.trim().split(";")[0])
		.some((language) => language === "ja" || language.startsWith("ja-"))
		? "ja"
		: defaultLocale;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const firstSegment = pathname.split("/")[1];

	if (isLocale(firstSegment)) {
		const response = NextResponse.next();
		response.cookies.set(localeCookie, firstSegment, {
			maxAge: 60 * 60 * 24 * 365,
			path: "/",
			sameSite: "lax",
		});
		return response;
	}

	if (/^\/[a-z]{2}(?:\/|$)/i.test(pathname)) {
		return NextResponse.next();
	}

	const locale = detectLocale(request);
	const url = request.nextUrl.clone();
	url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
