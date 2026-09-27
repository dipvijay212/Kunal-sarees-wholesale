"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeartIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { useWishlist } from "@/hooks/use-wishlist";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ProductGrid } from "./ProductGrid";

export function WishlistView() {
  const { products, hydrated } = useWishlist();
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  if (!hydrated) {
    return <LoadingState variant="products" count={4} label={t.loading.products} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon size={26} />}
        title={t.wishlist.emptyTitle}
        description={t.wishlist.emptySubtitle}
        action={<Button href="/products">{t.wishlist.btnBrowse}</Button>}
      />
    );
  }

  return (
    <>
      <p className="mb-8 text-sm text-muted">
        {products.length} {isHi ? "पसंदीदा साड़ियां · इस डिवाइस पर सुरक्षित" : "saved sarees · Saved on this device"}
      </p>
      <ProductGrid products={products} eagerCount={4} />
    </>
  );
}

