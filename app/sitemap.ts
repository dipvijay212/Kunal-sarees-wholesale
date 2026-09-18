import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getCategories, getCollections, getProducts } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/collections`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/new-arrivals`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/wholesale`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getCategories().map((category) => ({
    url: `${base}/products?category=${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = getCollections().map((collection) => ({
    url: `${base}/collections/${collection.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = getProducts().map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: product.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...categoryRoutes, ...productRoutes];
}
