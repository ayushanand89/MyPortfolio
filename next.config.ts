import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // WebP, not AVIF: AVIF is ~20% smaller but far costlier to decode, and
    // these are large screenshots decoded mid-scroll — WebP keeps scrolling
    // smooth on mid-range phones while still beating JPEG by ~30%.
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      // The recovery platform launched as "Quit Gambling" (quitgambling.in).
      {
        source: "/work/sukh-sadam",
        destination: "/work/quit-gambling",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Recordings/screenshots: cache for a day, serve stale while
        // revalidating for a week. Changed media gets a NEW filename —
        // optimized images and CDN caches are keyed by URL.
        source: "/work/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
