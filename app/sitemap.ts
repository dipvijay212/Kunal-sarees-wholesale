import type { MetadataRoute } from "next";
import { productsApi, type BackendProduct } from "@/lib/api";
import { fetchCollections } from "@/lib/catalog";
import { categoryRepository } from "@/lib/repositories";
import { absoluteUrl, categoryPath, productPath } from "@/lib/seo";

// Built entirely from backend data and regenerated in the background, so products and
// categories added in admin appear within about a minute — no code change or redeploy.
export const revalidate = 60;

/** The backend caps a page at 50 items, so walk every page to list the full catalogue. */
async function fetchAllPublicProducts(): Promise<BackendProduct[]> {
  const products: BackendProduct[] = [];
  for (let page = 1; page <= 100; page++) {
    try {
      const res = await productsApi.getAll({ isAvailable: true, limit: 50, page });
      products.push(...res.products);
      // The API returns { page, totalPages }; older responses used { hasNextPage }.
      const pagination = res.pagination as { totalPages?: number; hasNextPage?: boolean } | undefined;
      const hasMore = pagination?.hasNextPage ?? page < (pagination?.totalPages ?? 1);
      if (!hasMore || res.products.length === 0) break;
    } catch (err) {
      console.error("Sitemap: failed to fetch products page", page, err);
      break;
    }
  }
  return products;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections] = await Promise.all([
    fetchAllPublicProducts(),
    categoryRepository.fetchAll(),
    fetchCollections(),
  ]);

  // /new-arrivals and /order-list only redirect, so they are not listed.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/products"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/collections"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/wholesale"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Every active category from the backend (inactive ones aren't returned by the API).
  const latestProductUpdate = new Map<string, string>();
  for (const product of products) {
    const key = `cat-${product.categoryId}`;
    const updated = product.updatedAt || product.createdAt;
    if (updated && (!latestProductUpdate.has(key) || updated > latestProductUpdate.get(key)!)) {
      latestProductUpdate.set(key, updated);
    }
  }
  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((category) => category.slug)
    .map((category) => ({
      url: absoluteUrl(categoryPath(category)),
      ...(latestProductUpdate.has(category.id) ? { lastModified: latestProductUpdate.get(category.id) } : {}),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const collectionRoutes: MetadataRoute.Sitemap = collections
    .filter((collection) => collection.productCount > 0)
    .map((collection) => ({
      url: absoluteUrl(`/collections/${collection.slug}`),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const seen = new Set<string>();
  const productRoutes: MetadataRoute.Sitemap = [];
  for (const product of products) {
    if (!product.slug || seen.has(product.slug)) continue;
    seen.add(product.slug);
    const images = (product.images ?? [])
      .slice()
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((image) => image.imageUrl)
      .filter((url) => /^https:\/\//.test(url))
      .slice(0, 5);
    productRoutes.push({
      url: absoluteUrl(productPath(product)),
      lastModified: product.updatedAt || product.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
      ...(images.length > 0 ? { images } : {}),
    });
  }

  return [...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...productRoutes];
}
