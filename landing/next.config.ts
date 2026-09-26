import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "https", hostname: "moussamarbre.com" },
      { protocol: "https", hostname: "univmar.com" },
    ],
  },
  async headers() {
    const longCache = "public, max-age=31536000, immutable";
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, noimageindex, noai, noimageai" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
          { key: "Cache-Control", value: longCache },
        ],
      },
      {
        source: "/hero-image.webp",
        headers: [{ key: "Cache-Control", value: longCache }],
      },
      {
        source: "/about-hero-section-2.webp",
        headers: [{ key: "Cache-Control", value: longCache }],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: longCache }],
      },
    ];
  },
};

export default nextConfig;
