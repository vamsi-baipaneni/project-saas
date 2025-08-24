import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		formats: ['image/webp'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'bfhinpkvqkjzeumateqq.supabase.co',
                port: '',
            },
        ],
        minimumCacheTTL: 60,
        unoptimized: false, // ✅ Ensures Next.js optimizes images
	}
};

export default nextConfig;
