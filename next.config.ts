import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Product photography will be served locally from /public for now.
    // Add `remotePatterns` here when images move to a CDN.
  },
};

export default nextConfig;
