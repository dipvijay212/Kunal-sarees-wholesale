"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getAvailability } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { getQuantityRules } from "@/lib/quantity";
import type { Product } from "@/types";
import { AddToOrderButton } from "./AddToOrderButton";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { StockStatusLabel } from "./StockStatusLabel";
import { WishlistButton } from "./WishlistButton";

export interface ProductCardProps {
  product: Product;
  /** Load the image eagerly for cards visible on first paint. */
  eager?: boolean;
  sizes?: string;
  className?: string;
  showAddToOrder?: boolean;
}

const DEFAULT_SIZES = "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

export function ProductCard({
  product,
  eager = false,
  sizes = DEFAULT_SIZES,
  className,
  showAddToOrder = true,
}: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { t, getLocalized } = useLanguage();
  const { min } = getQuantityRules(product);
  const availability = getAvailability(product);
  const href = `/products/${product.slug}`;

  const displayName = getLocalized(product, "name") || product.name;
  const displayFabric = getLocalized(product, "fabric") || product.fabric;

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    // Do not trigger card navigation if user clicked a button, link, or input
    if (target.closest("button") || target.closest("input") || target.closest("select")) {
      return;
    }
    router.push(href);
  };

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xs border border-line bg-surface p-3 sm:p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift cursor-pointer",
        className,
      )}
    >
      {/* Image Frame */}
      <div className="media-frame relative aspect-[4/5] overflow-hidden rounded-xs bg-cream-warm">
        <Link href={href} className="block size-full focus:outline-none" aria-label={displayName}>
          <ProductImageCarousel
            images={product.images}
            alt={displayName}
            eager={eager}
            sizes={sizes}
            isHovered={isHovered}
          />
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute top-3.5 left-3.5 flex flex-col items-start gap-1.5 z-10">
          {product.newArrival ? <Badge variant="accent">{t.products.badgeNew}</Badge> : null}
          {product.featured ? <Badge variant="solid">{t.products.badgeFeatured}</Badge> : null}
          {availability === "out-of-stock" ? <Badge variant="neutral">{t.products.madeToOrder}</Badge> : null}
        </div>

        {/* Wishlist Icon */}
        <WishlistButton
          productId={product.id}
          productName={displayName}
          className="absolute top-3.5 right-3.5 z-20"
        />
      </div>

      {/* Product Information */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Product Code Row */}
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-xs">
            <span className="font-semibold text-gold tracking-[0.04em] uppercase text-xs">
              {displayFabric}
            </span>
            <span className="font-sans font-medium text-muted text-xs">
              {product.productCode}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-display text-lg sm:text-[1.3125rem] font-medium leading-snug text-ink mt-1.5 transition-colors group-hover:text-maroon line-clamp-2 min-h-[2.7em]">
            <Link href={href} className="focus:outline-none hover:underline">
              {displayName}
            </Link>
          </h3>
        </div>

        {/* Commercial & Stock Information */}
        <div className="mt-3 pt-3 border-t border-line/60">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
            <p className="flex items-baseline gap-1.5">
              <span className="type-price text-xl sm:text-[1.375rem] font-semibold text-maroon">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm font-normal text-muted">{t.products.perPiece}</span>
            </p>
            <span className="text-sm font-medium text-muted whitespace-nowrap">
              {t.products.moq} {min} {t.products.pieces}
            </span>
          </div>

          <StockStatusLabel product={product} className="mt-2" />

          {showAddToOrder ? <AddToOrderButton product={product} className="mt-3.5 relative z-10" /> : null}
        </div>
      </div>
    </article>
  );
}
