import type { Metadata } from "next";
import { CollectionsPageContent } from "@/components/collection/CollectionsPageContent";
import { fetchCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "साड़ी श्रेणियां व कलेक्शन | Saree Collections & Categories | Kunal Sarees",
  description:
    "Explore our complete wholesale saree categories: Silk Sarees, Cotton, Banarasi, Organza, Georgette, and Bridal Sarees.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const categories = await fetchCategories();
  return <CollectionsPageContent categories={categories} />;
}

