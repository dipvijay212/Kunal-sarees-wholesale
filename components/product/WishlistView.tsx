"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeartIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductGrid } from "./ProductGrid";

export function WishlistView() {
  const { products, hydrated } = useWishlist();

  if (!hydrated) {
    return <LoadingState variant="products" count={4} label="Loading saved designs" />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon size={26} />}
        title="No saved designs yet"
        description="Tap the heart on any design to keep it here while you plan your order."
        action={<Button href="/products">Browse catalogue</Button>}
      />
    );
  }

  return (
    <>
      <p className="mb-8 text-sm text-muted">
        {products.length} saved {products.length === 1 ? "design" : "designs"} · stored on this device
      </p>
      <ProductGrid products={products} eagerCount={4} />
    </>
  );
}
