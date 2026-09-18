"use client";

import Link from "next/link";
import { useState } from "react";
import { useUI } from "@/components/providers/UIProvider";
import { Button } from "@/components/ui/Button";
import { BagIcon, CheckIcon, MinusIcon, PlusIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useOrderList } from "@/hooks/use-order-list";
import { formatPieces, formatPrice } from "@/lib/format";
import { getQuantityRules } from "@/lib/quantity";
import { buildMultiColorEnquiryMessage } from "@/lib/whatsapp";
import type { Product } from "@/types";
import { WishlistButton } from "./WishlistButton";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const rules = getQuantityRules(product);
  const isOutOfStock = product.stock <= 0;

  // Initialize color quantities map
  const [colorQuantities, setColorQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v, index) => {
        // Set first colorway default to MOQ if in stock
        initial[v.color.name] = index === 0 && !isOutOfStock ? Math.max(rules.min, v.stock > 0 ? rules.min : 0) : 0;
      });
    } else if (product.colors && product.colors.length > 0) {
      product.colors.forEach((c, index) => {
        initial[c.name] = index === 0 && !isOutOfStock ? rules.min : 0;
      });
    } else {
      initial["Standard"] = isOutOfStock ? 0 : rules.min;
    }
    return initial;
  });

  const { lines, addItem } = useOrderList();
  const { openOrderList } = useUI();

  // Compute overall total quantity & value
  const totalQuantity = Object.values(colorQuantities).reduce((sum, q) => sum + q, 0);
  const estimatedTotal = totalQuantity * product.price;

  // MOQ & Stock validation
  const isBelowMoq = totalQuantity < rules.min;
  const moqDeficit = rules.min - totalQuantity;

  const availableColors = product.variants?.length
    ? product.variants.map((v) => ({ name: v.color.name, hex: v.color.hex, stock: v.stock }))
    : product.colors.map((c) => ({ name: c.name, hex: c.hex, stock: product.stock }));

  const updateColorQty = (colorName: string, delta: number, maxStock: number) => {
    setColorQuantities((prev) => {
      const current = prev[colorName] || 0;
      const next = Math.max(0, Math.min(maxStock, current + delta));
      return { ...prev, [colorName]: next };
    });
  };

  const toggleColorSelection = (colorName: string, maxStock: number) => {
    setColorQuantities((prev) => {
      const current = prev[colorName] || 0;
      if (current > 0) {
        return { ...prev, [colorName]: 0 };
      } else {
        // If adding, add at least 1 or step/min if total is 0
        const addQty = totalQuantity === 0 ? Math.min(rules.min, maxStock) : Math.min(rules.step || 1, maxStock);
        return { ...prev, [colorName]: addQty };
      }
    });
  };

  const handleAddToOrderList = () => {
    if (isBelowMoq || isOutOfStock) return;
    addItem(product.id, totalQuantity);
    openOrderList();
  };

  const existingLine = lines.find((line) => line.product.id === product.id);

  return (
    <div className="flex flex-col gap-6">
      {/* Color Selection Header */}
      <div>
        <div className="flex items-center justify-between">
          <label className="type-eyebrow text-ink">Select Colorways</label>
          <span className="text-xs text-muted">Click to select multiple colors</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2.5">
          {availableColors.map((color) => {
            const qty = colorQuantities[color.name] || 0;
            const isSelected = qty > 0;
            const colorOutOfStock = color.stock <= 0;

            return (
              <button
                key={color.name}
                type="button"
                disabled={colorOutOfStock}
                onClick={() => toggleColorSelection(color.name, color.stock)}
                aria-pressed={isSelected}
                className={`group relative flex items-center gap-2 rounded-xs border px-3 py-2 text-xs font-medium transition-all ${
                  colorOutOfStock
                    ? "border-line bg-canvas-deep opacity-50 cursor-not-allowed text-muted"
                    : isSelected
                      ? "border-accent bg-accent/10 text-ink ring-1 ring-accent"
                      : "border-line bg-canvas text-ink hover:border-accent/50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="size-3.5 rounded-full border border-line-strong shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
                {isSelected ? (
                  <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[0.625rem] font-bold text-white">
                    {qty}
                  </span>
                ) : (
                  <span className="text-[0.6875rem] text-muted">({color.stock})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Color Quantity Controls */}
      <div className="rounded-xs border border-line bg-canvas-deep p-4 flex flex-col gap-3">
        <p className="type-eyebrow text-xs text-muted">Per-Color Quantities</p>
        <div className="flex flex-col gap-2.5 divide-y divide-line">
          {availableColors.map((color) => {
            const qty = colorQuantities[color.name] || 0;
            if (qty === 0) return null;

            return (
              <div key={color.name} className="flex items-center justify-between pt-2.5 first:pt-0">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-3 rounded-full border border-line-strong"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm font-medium text-ink">{color.name}</span>
                  <span className="text-xs text-subtle">(Max: {color.stock})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateColorQty(color.name, -1, color.stock)}
                    className="flex size-7 items-center justify-center rounded-xs border border-line bg-canvas text-ink hover:border-accent"
                    aria-label={`Decrease quantity for ${color.name}`}
                  >
                    <MinusIcon size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-ink tabular-nums">{qty}</span>
                  <button
                    type="button"
                    disabled={qty >= color.stock}
                    onClick={() => updateColorQty(color.name, 1, color.stock)}
                    className="flex size-7 items-center justify-center rounded-xs border border-line bg-canvas text-ink hover:border-accent disabled:opacity-40"
                    aria-label={`Increase quantity for ${color.name}`}
                  >
                    <PlusIcon size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {totalQuantity === 0 ? (
            <p className="py-2 text-xs italic text-muted">No colors selected yet. Click a color above to add pieces.</p>
          ) : null}
        </div>

        {/* Total Summary */}
        <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total Quantity</p>
            <p className="font-display text-lg text-ink">
              {formatPieces(totalQuantity)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Estimated Subtotal</p>
            <p className="type-price text-xl text-ink" aria-live="polite">
              {formatPrice(estimatedTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* MOQ & Stock Validation Alerts */}
      {isOutOfStock ? (
        <div className="rounded-xs border border-neutral-300 bg-neutral-100 p-3.5 text-xs text-neutral-800">
          <p className="font-semibold">Currently Out of Stock</p>
          <p className="mt-0.5">This design is made to order. Please contact us on WhatsApp to check production timelines.</p>
        </div>
      ) : isBelowMoq ? (
        <div className="rounded-xs border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900">
          <p className="font-semibold">Minimum Order Quantity (MOQ) Requirement</p>
          <p className="mt-0.5">
            Minimum order for this design is <span className="font-bold">{rules.min} pieces</span>. Please add{" "}
            <span className="font-bold">{moqDeficit} more piece(s)</span> across your selected colors.
          </p>
        </div>
      ) : null}

      <p className="-mt-2 text-xs leading-relaxed text-subtle">
        Minimum order {formatPieces(rules.min)}
        {rules.step > 1 ? `, in sets of ${rules.step}` : ""}. Excludes GST and shipping.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleAddToOrderList}
          size="lg"
          fullWidth
          disabled={isOutOfStock || isBelowMoq}
          leadingIcon={<BagIcon size={18} />}
        >
          {isOutOfStock ? "Out of Stock" : isBelowMoq ? `Add ${moqDeficit} more for MOQ (${rules.min} min)` : `Add ${totalQuantity} pcs to Order List`}
        </Button>

        <WhatsAppButton
          variant="secondary"
          size="lg"
          fullWidth
          label="Order on WhatsApp"
          message={buildMultiColorEnquiryMessage(product, colorQuantities, totalQuantity)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <WishlistButton productId={product.id} productName={product.name} variant="inline" className="-ml-3" />
        {existingLine ? (
          <p className="text-sm text-muted">
            {formatPieces(existingLine.item.quantity)} in your{" "}
            <Link
              href="/order-list"
              className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              order list
            </Link>
          </p>
        ) : null}
      </div>

      {/* Mobile Sticky Bottom Order Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-line bg-canvas/95 p-3.5 backdrop-blur-md shadow-lg lg:hidden">
        <div>
          <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-muted">
            {formatPieces(totalQuantity)}
          </p>
          <p className="type-price text-lg text-ink">{formatPrice(estimatedTotal)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={isOutOfStock || isBelowMoq}
            onClick={handleAddToOrderList}
            leadingIcon={<CheckIcon size={16} />}
          >
            Add ({totalQuantity})
          </Button>
          <WhatsAppButton
            variant="secondary"
            size="sm"
            label="WhatsApp"
            message={buildMultiColorEnquiryMessage(product, colorQuantities, totalQuantity)}
          />
        </div>
      </div>
    </div>
  );
}
