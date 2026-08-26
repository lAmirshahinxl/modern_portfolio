import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
  },
  async headers() {
    const immutableAssetHeaders = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];

    return [
      { source: "/hero-image.webp", headers: immutableAssetHeaders },
      { source: "/brand-mark.svg", headers: immutableAssetHeaders },
      { source: "/icon.svg", headers: immutableAssetHeaders },
      { source: "/projects/:path*", headers: immutableAssetHeaders },
    ];
  },
};

export default nextConfig;
