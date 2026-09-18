import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { getAvailability } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { getQuantityRules } from "@/lib/quantity";
import type { Product } from "@/types";
import { AddToOrderButton } from "./AddToOrderButton";
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
  const [primaryImage, secondaryImage] = product.images;
  const { min, step } = getQuantityRules(product);
  const availability = getAvailability(product);
  const href = `/products/${product.slug}`;

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="media-frame aspect-[3/4] rounded-xs">
        {primaryImage ? (
          <RemoteImage
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            className="object-cover group-hover:scale-[1.03]"
          />
        ) : null}
        {secondaryImage ? (
          <RemoteImage
            src={secondaryImage.url}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        ) : null}

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.newArrival ? <Badge variant="neutral">New</Badge> : null}
          {product.featured ? <Badge variant="solid">Featured</Badge> : null}
          {availability === "out-of-stock" ? <Badge variant="neutral">Made to order</Badge> : null}
          {availability === "low-stock" ? <Badge variant="accent">Few left</Badge> : null}
        </div>

        <WishlistButton productId={product.id} productName={product.name} className="absolute top-3 right-3 z-10" />
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="type-eyebrow text-[0.625rem] text-subtle">{product.fabric}</p>
          <span className="text-[0.6875rem] font-mono font-medium text-muted">{product.productCode}</span>
        </div>
        <h3 className="font-display text-lg leading-snug text-ink sm:text-xl">
          <Link
            href={href}
            className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent-strong"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto pt-1">
          <p className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="type-price text-ink">{formatPrice(product.price)}</span>
            <span className="text-xs text-muted">/ piece</span>
          </p>
          <p className="type-caption mt-0.5 text-muted">
            MOQ {min} {min === 1 ? "piece" : "pieces"}
            {step > 1 ? ` · Sets of ${step}` : ""}
          </p>
          <StockStatusLabel product={product} className="mt-2 text-xs" />
        </div>
        {showAddToOrder ? <AddToOrderButton product={product} /> : null}
      </div>
    </article>
  );
}
