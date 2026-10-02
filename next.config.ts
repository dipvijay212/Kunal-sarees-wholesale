import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Reuse already-visited pages from the client router cache instead of re-rendering on every navigation
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // The old demo domain is served by this same Vercel project. Send every URL on it
      // permanently to the production domain so Google replaces the indexed demo pages.
      // Only this exact host matches — preview deployments are unaffected.
      {
        source: "/:path*",
        has: [{ type: "host", value: "kunal-saree.vercel.app" }],
        destination: "https://www.kunalsarees.in/:path*",
        permanent: true,
      },
      // These pages only redirect; make it permanent so they don't linger as separate URLs.
      { source: "/new-arrivals", destination: "/products", permanent: true },
      { source: "/order-list", destination: "/order", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      // Development product photography (see data/images.ts).
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      // Cloudinary media uploads
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "*.cloudinary.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
