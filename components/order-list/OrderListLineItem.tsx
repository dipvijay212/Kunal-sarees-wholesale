"use client";

import Image from "next/image";
import Link from "next/link";
import { IconButton } from "@/components/ui/IconButton";
import { TrashIcon } from "@/components/ui/Icons";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { getQuantityRules } from "@/lib/quantity";
import type { OrderListLine } from "@/types";

interface OrderListLineItemProps {
  line: OrderListLine;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  /** `compact` for the drawer, `full` for the order list page. */
  density?: "compact" | "full";
  onNavigate?: () => void;
}

export function OrderListLineItem({
  line,
  onQuantityChange,
  onRemove,
  density = "full",
  onNavigate,
}: OrderListLineItemProps) {
  const { product, item, lineTotal } = line;
  const rules = getQuantityRules(product.pricing);
  const isCompact = density === "compact";
  const href = `/products/${product.slug}`;
  const image = product.images[0];

  return (
    <article className={cn("flex gap-4", isCompact ? "py-5" : "py-6 sm:gap-6")}>
      <Link
        href={href}
        onClick={onNavigate}
        className={cn("media-frame block aspect-[3/4] shrink-0 rounded-xs", isCompact ? "w-16 xs:w-20" : "w-20 sm:w-32")}
        tabIndex={-1}
        aria-hidden="true"
      >
        {image ? (
          <Image src={image.src} alt="" fill sizes={isCompact ? "80px" : "128px"} className="object-cover" />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="type-caption text-subtle">{product.sku}</p>
            <h3 className={cn("font-display leading-snug text-ink", isCompact ? "text-lg" : "text-xl sm:text-2xl")}>
              <Link href={href} onClick={onNavigate} className="transition-colors hover:text-accent-strong">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-muted">
              {formatPrice(product.pricing.pricePerPiece)} / piece
              {!isCompact ? ` · ${product.fabric}` : ""}
            </p>
          </div>
          <IconButton
            label={`Remove ${product.name} from order list`}
            icon={<TrashIcon size={18} />}
            onClick={() => onRemove(product.id)}
            size="sm"
            className="-mt-1 -mr-1 text-subtle hover:text-danger"
          />
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(quantity) => onQuantityChange(product.id, quantity)}
            min={rules.min}
            max={rules.max}
            step={rules.step}
            size="sm"
            label={`Quantity for ${product.name}`}
          />
          <p className="type-price text-ink">{formatPrice(lineTotal)}</p>
        </div>
      </div>
    </article>
  );
}
