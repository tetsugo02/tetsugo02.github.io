import "../globals.css";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tetsugo02.github.io";

export const metadata: Metadata = {
	title: "Tetsugo To",
	description: "Personal website of Tetsugo To, software engineer and researcher.",
	metadataBase: new URL(baseUrl),
	alternates: {
		canonical: "/en/",
	},
	icons: { icon: "/favicon.ico" },
};

export default function RootRedirectLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta httpEquiv="refresh" content="0; url=/en/" />
				<script
					dangerouslySetInnerHTML={{
						__html: 'window.location.replace("/en/");',
					}}
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
