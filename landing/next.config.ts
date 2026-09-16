import type { NextConfig } from "next";
import path from "path";

// The landing page retains its established public URLs while all media is
// stored locally in a private, organised directory mounted at /app/public.
// These rewrites also preserve existing bookmarks and search-engine links.
const privateAssetRewrites = [
  { source: "/images/:path*", destination: "/catalogue/images/:path*" },
  { source: "/projects-images/:path*", destination: "/projects/gallery/:path*" },
  { source: "/big-project/:path*", destination: "/projects/featured/:path*" },
  { source: "/BingSiteAuth.xml", destination: "/site/verification/BingSiteAuth.xml" },
  { source: "/fr/BingSiteAuth.xml", destination: "/site/verification/fr/BingSiteAuth.xml" },
  { source: "/llms.txt", destination: "/site/verification/llms.txt" },
  { source: "/univmar-logo.png", destination: "/site/brand/univmar-logo.png" },
  { source: "/univmar-logo-w.png", destination: "/site/brand/univmar-logo-w.png" },
  { source: "/logo.png", destination: "/site/brand/logo.png" },
  { source: "/logo-svg.svg", destination: "/site/brand/logo-svg.svg" },
  { source: "/icon-png.png", destination: "/site/brand/icon-png.png" },
  { source: "/favicon-32.png", destination: "/site/brand/favicon-32.png" },
  { source: "/hero-image.jpg", destination: "/site/home/hero-image.jpg" },
  { source: "/hero-image.png", destination: "/site/home/hero-image.png" },
  { source: "/hero-image.webp", destination: "/site/home/hero-image.webp" },
  { source: "/image-produits-1.jpeg", destination: "/site/home/image-produits-1.jpeg" },
  { source: "/image-produits-2.jpeg", destination: "/site/home/image-produits-2.jpeg" },
  { source: "/image-produits-3.jpeg", destination: "/site/home/image-produits-3.jpeg" },
  { source: "/mesure-:number.jpeg", destination: "/site/home/mesure-:number.jpeg" },
  { source: "/h1-wedo03.png", destination: "/site/home/h1-wedo03.png" },
  { source: "/h1-wedo04.png", destination: "/site/home/h1-wedo04.png" },
  { source: "/s.jpeg", destination: "/site/about/s.jpeg" },
  { source: "/about-hero-section-2.jpeg", destination: "/site/about/about-hero-section-2.jpeg" },
  { source: "/about-hero-section.jpeg", destination: "/site/about/about-hero-section.jpeg" },
  { source: "/about-hero-section.webp", destination: "/site/about/about-hero-section.webp" },
  { source: "/about-us-01.jpeg", destination: "/site/about/about-us-01.jpeg" },
  { source: "/h4-our.jpg", destination: "/site/about/h4-our.jpg" },
  { source: "/project-9.jpg", destination: "/site/about/project-9.jpg" },
  { source: "/project-12.jpg", destination: "/site/about/project-12.jpg" },
  { source: "/slide1.jpg", destination: "/site/about/slide1.jpg" },
  { source: "/slide2.jpg", destination: "/site/about/slide2.jpg" },
  { source: "/slide3.jpg", destination: "/site/about/slide3.jpg" },
  { source: "/WhatsApp Image 2026-06-27 at 14.47.48.jpeg", destination: "/site/about/WhatsApp Image 2026-06-27 at 14.47.48.jpeg" },
  { source: "/:number.jpeg", destination: "/site/services/:number.jpeg" },
  { source: "/service-:number.jpg", destination: "/site/services/service-:number.jpg" },
  { source: "/service-v2.jpg", destination: "/site/services/service-v2.jpg" },
];

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
  async rewrites() {
    return privateAssetRewrites;
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
