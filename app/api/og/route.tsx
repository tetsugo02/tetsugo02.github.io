import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
	// Google Fonts APIを使用して必要な文字のみを含むサブセットフォントを取得
	// Edge Functionの制限を回避するため、使用されている文字に絞ってフォントをロードします
	const text =
		"Tetsugo To 董 哲豪 Keio University B4 Student Software Engineer / Researcher Machine Learning Computer Systems OSS Contributor |";

	const fontData = await fetch(
		`https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(
			text
		)}`
	).then(async (res) => {
		const css = await res.text();
		const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
		if (!resource) return null;
		return fetch(resource[1]).then((res) => res.arrayBuffer());
	});

	if (!fontData) {
		return new Response("Failed to load font", { status: 500 });
	}

	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					backgroundColor: "#ffffff",
					padding: "40px 80px",
					fontFamily: '"Noto Sans JP", sans-serif',
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				{/* 左側：プロフィール情報 */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "flex-start",
						width: "45%",
					}}
				>
					{/* GitHubアイコン */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="https://github.com/tetsugo02.png"
						width="160"
						height="160"
						style={{ borderRadius: "50%", marginBottom: "30px", border: "2px solid #f0f0f0" }}
						alt="Avatar"
					/>

					<h1
						style={{
							fontSize: "64px",
							fontWeight: "900",
							color: "#111",
							margin: 0,
							lineHeight: 1.1,
						}}
					>
						Tetsugo To
					</h1>
					<h2 style={{ fontSize: "42px", fontWeight: "400", color: "#555", margin: "10px 0 0 0" }}>
						董 哲豪
					</h2>

					<div style={{ display: "flex", marginTop: "30px", gap: "15px" }}>
						<span style={{ fontSize: "24px", color: "#666" }}>Keio University</span>
						<span style={{ fontSize: "24px", color: "#ccc" }}>|</span>
						<span style={{ fontSize: "24px", color: "#666" }}>B4 Student</span>
					</div>
				</div>

				{/* 区切り線 */}
				<div style={{ width: "2px", height: "70%", backgroundColor: "#eee" }}></div>

				{/* 右側：スキル・興味 */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						width: "45%",
						paddingLeft: "40px",
					}}
				>
					<div
						style={{
							fontSize: "28px",
							fontWeight: "bold",
							color: "#888",
							marginBottom: "20px",
							letterSpacing: "0.05em",
						}}
					>
						Software Engineer / Researcher
					</div>

					{/* Interest Tags */}
					<div style={{ display: "flex", flexWrap: "wrap", gap: "16px", flexDirection: "column" }}>
						{/* Tag 1 */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								backgroundColor: "#f9f9f9",
								padding: "16px 24px",
								borderRadius: "12px",
								border: "1px solid #eee",
							}}
						>
							<span style={{ fontSize: "32px", marginRight: "15px" }}>🤖</span>
							<span style={{ fontSize: "30px", fontWeight: "600", color: "#333" }}>
								Machine Learning
							</span>
						</div>

						{/* Tag 2 */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								backgroundColor: "#f9f9f9",
								padding: "16px 24px",
								borderRadius: "12px",
								border: "1px solid #eee",
							}}
						>
							<span style={{ fontSize: "32px", marginRight: "15px" }}>🖥️</span>
							<span style={{ fontSize: "30px", fontWeight: "600", color: "#333" }}>
								Computer Systems
							</span>
						</div>

						{/* Tag 3 */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								backgroundColor: "#f9f9f9",
								padding: "16px 24px",
								borderRadius: "12px",
								border: "1px solid #eee",
							}}
						>
							<span style={{ fontSize: "32px", marginRight: "15px" }}>🔧</span>
							<span style={{ fontSize: "30px", fontWeight: "600", color: "#333" }}>
								OSS Contributor
							</span>
						</div>
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "Noto Sans JP",
					data: fontData,
					style: "normal",
				},
			],
		}
	);
}
