import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/order-list", "/wishlist", "/design-system"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
