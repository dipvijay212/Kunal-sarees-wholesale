import type { Metadata } from "next";
import { ProductsPageContent } from "@/components/product/ProductsPageContent";
import { fetchProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "साड़ियां | Sarees Wholesale Catalogue | Kunal Sarees",
  description:
    "Explore Kunal Sarees complete wholesale saree catalog with latest new arrivals, transparent per-piece pricing, and minimum order quantities.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await fetchProducts();

  return <ProductsPageContent products={products} />;
}

