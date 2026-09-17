import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { getQuantityRules } from "@/lib/quantity";
import type { Product } from "@/types";
import { WishlistButton } from "./WishlistButton";

export interface ProductCardProps {
  product: Product;
  /** Load the image eagerly for cards visible on first paint. */
  eager?: boolean;
  sizes?: string;
  className?: string;
}

const DEFAULT_SIZES = "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

export function ProductCard({ product, eager = false, sizes = DEFAULT_SIZES, className }: ProductCardProps) {
  const [primaryImage, secondaryImage] = product.images;
  const { min, step } = getQuantityRules(product.pricing);
  const href = `/products/${product.slug}`;

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="media-frame aspect-[3/4] rounded-xs">
        {primaryImage ? (
          <Image
            src={primaryImage.src}
            alt={primaryImage.alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            className="object-cover group-hover:scale-[1.03]"
          />
        ) : null}
        {secondaryImage ? (
          <Image
            src={secondaryImage.src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        ) : null}

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.isNew ? <Badge variant="neutral">New</Badge> : null}
          {product.isBestseller ? <Badge variant="solid">Bestseller</Badge> : null}
        </div>

        <WishlistButton productId={product.id} productName={product.name} className="absolute top-3 right-3 z-10" />
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        <p className="type-eyebrow text-[0.625rem] text-subtle">{product.fabric}</p>
        <h3 className="font-display text-lg leading-snug text-ink sm:text-xl">
          <Link
            href={href}
            className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent-strong"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto flex flex-wrap items-baseline gap-x-1.5 pt-1">
          <span className="type-price text-ink">{formatPrice(product.pricing.pricePerPiece)}</span>
          <span className="text-xs text-muted">/ piece</span>
        </p>
        <p className="type-caption text-muted">
          MOQ {min} {min === 1 ? "piece" : "pieces"}
          {step > 1 ? ` · Sets of ${step}` : ""}
        </p>
      </div>
    </article>
  );
}
