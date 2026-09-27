import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { fetchCategories, fetchProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "हमारे बारे में | About Us | Kunal Sarees",
  description:
    "Kunal Sarees offers premium wholesale sarees direct from Surat for retailers and boutiques.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  return <AboutPageContent categories={categories} products={products} />;
}

