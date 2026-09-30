import type { Metadata } from "next";
import { WishlistPageContent } from "@/components/product/WishlistPageContent";
import { fetchProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Saved Sarees",
  description: "Your saved wholesale sarees wishlist.",
  robots: { index: false, follow: true },
};

export default async function WishlistPage() {
  // Saved ids are resolved against the live catalogue (same cached request as other pages).
  const products = await fetchProducts();
  return <WishlistPageContent products={products} />;
}

