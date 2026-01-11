import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	// output: "export", // Disabled for Vercel deployment (API Routes support)
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
