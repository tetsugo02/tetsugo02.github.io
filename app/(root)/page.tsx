import Link from "next/link";

export default function RootRedirectPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<p className="text-sm text-muted-foreground">
				Redirecting to <Link href="/en/">the English site</Link>…
			</p>
		</main>
	);
}
