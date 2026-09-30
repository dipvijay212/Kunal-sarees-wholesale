import type { Metadata } from "next";
import { categoryListPhrase, pageMetadata, truncate } from "@/lib/seo";
import { CollectionsPageContent } from "@/components/collection/CollectionsPageContent";
import { fetchCategories, fetchProducts } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> {
  // Same cached requests as the page body, so this adds no extra backend call.
  const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);
  const list = categoryListPhrase(categories, products, 5);

  return pageMetadata({
    title: "Saree Categories",
    description: truncate(
      list
        ? `Browse Kunal Sarees wholesale saree categories, including ${list} sarees, supplied from Surat to boutiques and retailers across India.`
        : "Browse Kunal Sarees wholesale saree categories, supplied from Surat to boutiques and retailers across India.",
    ),
    path: "/collections",
  });
}

export default async function CollectionsPage() {
  const categories = await fetchCategories();
  return <CollectionsPageContent categories={categories} />;
}

