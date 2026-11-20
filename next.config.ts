import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true, // ponytail: webp already optimized; saves CDN requests + image quota
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.youtube.com",
			},
		],
	},
};

export default nextConfig;
