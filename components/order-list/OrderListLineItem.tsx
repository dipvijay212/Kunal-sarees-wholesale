"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { TrashIcon } from "@/components/ui/Icons";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { RemoteImage } from "@/components/ui/RemoteImage";
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
  const rules = getQuantityRules(product);
  const isCompact = density === "compact";
  const href = `/products/${product.slug}`;
  const image = product.images[0];

  // Colors breakdown if stored on item
  const selectedColors = item.selectedColors
    ? Object.entries(item.selectedColors).filter(([, q]) => q > 0)
    : [];

  return (
    <article className={cn("flex gap-4", isCompact ? "py-5" : "py-6 sm:gap-6")}>
      {/* Product Image */}
      <Link
        href={href}
        onClick={onNavigate}
        className={cn("media-frame block aspect-[3/4] shrink-0 rounded-xs", isCompact ? "w-16 xs:w-20" : "w-20 sm:w-32")}
        tabIndex={-1}
        aria-hidden="true"
      >
        {image ? (
          <RemoteImage src={image.url} alt="" fill sizes={isCompact ? "80px" : "128px"} className="object-cover" />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Header: Name, Code, Badges, Remove Button */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-muted">{product.productCode}</span>
              <Badge variant="outline" className="text-[0.625rem]">MOQ {rules.min} pcs</Badge>
            </div>

            <h3 className={cn("font-display leading-snug text-ink mt-0.5", isCompact ? "text-base" : "text-lg sm:text-xl")}>
              <Link href={href} onClick={onNavigate} className="transition-colors hover:text-accent-strong">
                {product.name}
              </Link>
            </h3>

            <p className="mt-1 text-xs text-muted">
              {formatPrice(product.price)} / piece {!isCompact ? `· ${product.fabric} · ${product.design}` : ""}
            </p>

            {/* Selected Colors */}
            {selectedColors.length > 0 ? (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-subtle">
                <span className="font-medium text-ink">Colors:</span>
                {selectedColors.map(([colorName, qty]) => {
                  const colorObj = product.colors.find((c) => c.name === colorName);
                  return (
                    <span key={colorName} className="inline-flex items-center gap-1 rounded-xs bg-canvas-deep px-1.5 py-0.5 border border-line">
                      {colorObj?.hex ? (
                        <span
                          aria-hidden="true"
                          className="size-2.5 rounded-full border border-line-strong"
                          style={{ backgroundColor: colorObj.hex }}
                        />
                      ) : null}
                      <span className="text-ink font-medium">{colorName}</span>
                      <span className="text-muted">({qty} pcs)</span>
                    </span>
                  );
                })}
              </div>
            ) : product.colors && product.colors.length > 0 ? (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-subtle">
                <span>Available Colors:</span>
                <div className="flex gap-1">
                  {product.colors.map((c) => (
                    <span
                      key={c.name}
                      title={c.name}
                      className="size-3 rounded-full border border-line-strong"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <IconButton
            label={`Remove ${product.name} from order list`}
            icon={<TrashIcon size={18} />}
            onClick={() => onRemove(product.id)}
            size="sm"
            className="-mt-1 -mr-1 text-subtle hover:text-danger"
          />
        </div>

        {/* Quantity Controls & Subtotal */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <QuantitySelector
            value={item.quantity}
            onChange={(quantity) => onQuantityChange(product.id, quantity)}
            min={rules.min}
            max={rules.max}
            step={rules.step}
            size="sm"
            label={`Quantity for ${product.name}`}
          />
          <div className="text-right">
            <span className="text-[0.6875rem] uppercase tracking-wider text-subtle block">Subtotal</span>
            <span className="type-price text-base sm:text-lg text-ink">{formatPrice(lineTotal)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
