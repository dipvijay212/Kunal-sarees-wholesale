import type { Metadata } from "next";
import { ProductsPageContent } from "@/components/product/ProductsPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchProducts } from "@/lib/catalog";
import { categoryRepository } from "@/lib/repositories";
import {
  breadcrumbJsonLd,
  categoryDisplayName,
  categoryPath,
  categorySeo,
  jsonLdGraph,
  pageMetadata,
  type BreadcrumbItem,
} from "@/lib/seo";
import type { Category } from "@/types";

export const revalidate = 60;

type SearchParams = Awaited<PageProps<"/products">["searchParams"]>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Category listings live at /products?category=<slug>. Any category created in admin
 * gets its page and SEO automatically. Only a valid category slug is kept in the
 * canonical URL; sort, search and other filters canonicalise to the unfiltered page.
 */
async function resolveCategory(searchParams: SearchParams): Promise<Category | undefined> {
  const param = firstParam(searchParams.category);
  if (!param) return undefined;
  const categories = await categoryRepository.fetchAll();
  return categories.find((category) => category.slug === param || category.id === param);
}

export async function generateMetadata({ searchParams }: PageProps<"/products">): Promise<Metadata> {
  const category = await resolveCategory(await searchParams);

  if (!category) {
    return pageMetadata({
      title: "Wholesale Saree Catalogue",
      description:
        "Browse the Kunal Sarees wholesale saree catalogue with the latest designs, per-piece wholesale pricing and minimum order quantities for boutiques and retailers.",
      path: "/products",
    });
  }

  // Same cached request as the page body.
  const products = await fetchProducts();
  return pageMetadata(categorySeo(category, products));
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const [products, categories, category] = await Promise.all([
    fetchProducts(),
    categoryRepository.fetchAll(),
    searchParams.then(resolveCategory),
  ]);

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "Sarees", path: "/products" },
  ];
  if (category) breadcrumbs.push({ name: categoryDisplayName(category), path: categoryPath(category) });

  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbJsonLd(breadcrumbs))} />
      <ProductsPageContent products={products} categories={categories} />
    </>
  );
}
