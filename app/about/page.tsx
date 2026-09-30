import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { fetchCategories, fetchProducts } from "@/lib/catalog";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Learn about Kunal Sarees, a Surat-based wholesale saree supplier serving boutiques, retailers and resellers across India with the latest wholesale saree designs.",
  path: "/about",
});

export default async function AboutPage() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  return <AboutPageContent categories={categories} products={products} />;
}

