import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private, per-user and internal screens. Public pages, /_next assets and images stay crawlable.
      disallow: [
        "/admin",
        "/api/",
        "/account",
        "/login",
        "/forgot-password",
        "/reset-password",
        "/checkout",
        "/order",
        "/wishlist",
        "/design-system",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
