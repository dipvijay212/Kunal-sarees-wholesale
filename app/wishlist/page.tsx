import type { Metadata } from "next";
import { WishlistPageContent } from "@/components/product/WishlistPageContent";

export const metadata: Metadata = {
  title: "पसंदीदा साड़ियां | Saved Sarees | Kunal Sarees",
  description: "Your saved wholesale sarees wishlist.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return <WishlistPageContent />;
}

