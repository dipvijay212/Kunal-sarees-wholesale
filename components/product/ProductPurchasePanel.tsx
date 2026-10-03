"use client";

import Link from "next/link";
import { useState } from "react";
import { useUI } from "@/components/providers/UIProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { BagIcon, CheckIcon, MinusIcon, PlusIcon } from "@/components/ui/Icons";
import { useOrderList } from "@/hooks/use-order-list";
import { rememberCatalogueProduct } from "@/lib/admin-stores";
import { formatPieces, formatPrice } from "@/lib/format";
import { getQuantityRules } from "@/lib/quantity";
import type { Product } from "@/types";
import { WishlistButton } from "./WishlistButton";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { t, getLocalized, language } = useLanguage();
  const rules = getQuantityRules(product);
  const isOutOfStock = product.stock <= 0;
  const displayName = getLocalized(product, "name") || product.name;

  // Initialize color quantities map
  const [colorQuantities, setColorQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v, index) => {
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
        const addQty = totalQuantity === 0 ? Math.min(rules.min, maxStock) : Math.min(rules.step || 1, maxStock);
        return { ...prev, [colorName]: addQty };
      }
    });
  };

  const handleAddToOrderList = () => {
    if (isBelowMoq || isOutOfStock) return;
    rememberCatalogueProduct(product);
    addItem(product.id, totalQuantity);
    openOrderList();
  };

  const existingLine = lines.find((line) => line.product.id === product.id);

  return (
    <div className="flex flex-col gap-6">
      {/* Color Selection Header */}
      <div>
        <div className="flex items-center justify-between">
          <label className="type-eyebrow text-ink">{t.productDetails.colorLabel}</label>
          <span className="text-xs text-muted">
            {language === "en" ? "Select one or more colors" : "एक से ज्यादा कलर चुन सकते हैं"}
          </span>
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
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Color Quantity Controls */}
      <div className="rounded-xs border border-line bg-canvas-deep p-4 flex flex-col gap-3">
        <p className="type-eyebrow text-xs text-muted">
          {language === "en" ? "Quantity per Color" : "कलर अनुसार मात्रा"}
        </p>
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
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateColorQty(color.name, -1, color.stock)}
                    className="flex size-7 items-center justify-center rounded-xs border border-line bg-canvas text-ink hover:border-accent"
                    aria-label={`${color.name} - ${t.buttons.decrease}`}
                  >
                    <MinusIcon size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-ink tabular-nums">{qty}</span>
                  <button
                    type="button"
                    disabled={qty >= color.stock}
                    onClick={() => updateColorQty(color.name, 1, color.stock)}
                    className="flex size-7 items-center justify-center rounded-xs border border-line bg-canvas text-ink hover:border-accent disabled:opacity-40"
                    aria-label={`${color.name} - ${t.buttons.increase}`}
                  >
                    <PlusIcon size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {totalQuantity === 0 ? (
            <p className="py-2 text-xs italic text-muted">
              {language === "en"
                ? "No color selected yet. Click any color above to add pieces."
                : "अभी कोई कलर नहीं चुना गया। ऊपर दिए गए कलर पर क्लिक करके मात्रा जोड़ें।"}
            </p>
          ) : null}
        </div>

        {/* Total Summary */}
        <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {t.orderList.totalPieces}
            </p>
            <p className="font-display text-lg text-ink">
              {totalQuantity} {t.products.pieces}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {t.orderList.totalEstimated}
            </p>
            <p className="type-price text-xl text-ink" aria-live="polite">
              {formatPrice(estimatedTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* MOQ & Stock Validation Alerts */}
      {isOutOfStock ? (
        <div className="rounded-xs border border-neutral-300 bg-neutral-100 p-3.5 text-xs text-neutral-800">
          <p className="font-semibold">{t.products.outOfStock}</p>
          <p className="mt-0.5">
            {language === "en"
              ? "This saree is made-to-order. Connect on WhatsApp to discuss delivery timelines."
              : "यह साड़ी ऑर्डर पर तैयार की जाएगी। WhatsApp पर बात करके समय की जानकारी लें।"}
          </p>
        </div>
      ) : isBelowMoq ? (
        <div className="rounded-xs border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900">
          <p className="font-semibold">
            {language === "en" ? "Minimum Order Requirement" : "कम से कम ऑर्डर की शर्त"}
          </p>
          <p className="mt-0.5">
            {language === "en" ? (
              <>
                Minimum order for this saree is <span className="font-bold">{rules.min} pcs</span>. Please add{" "}
                <span className="font-bold">{moqDeficit} more pcs</span>.
              </>
            ) : (
              <>
                इस साड़ी के लिए कम से कम <span className="font-bold">{rules.min} पीस</span> का ऑर्डर जरूरी है। कृपया{" "}
                <span className="font-bold">{moqDeficit} पीस और जोड़ें</span>।
              </>
            )}
          </p>
        </div>
      ) : null}

      <p className="-mt-2 text-xs leading-relaxed text-subtle">
        {language === "en"
          ? `Minimum order ${rules.min} pcs${rules.step > 1 ? ` in sets of ${rules.step}` : ""}. GST & freight extra.`
          : `कम से कम ऑर्डर ${rules.min} पीस${rules.step > 1 ? `, ${rules.step} के सेट में` : ""}। GST और डिलीवरी चार्ज अलग से।`}
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
          {isOutOfStock
            ? t.products.outOfStock
            : isBelowMoq
              ? (language === "en" ? `Need at least ${rules.min} pcs (add ${moqDeficit} more)` : `कम से कम ${rules.min} पीस चाहिए (${moqDeficit} और जोड़ें)`)
              : (language === "en" ? `Add to Order List (${totalQuantity} pcs)` : `ऑर्डर लिस्ट में जोड़ें (${totalQuantity} पीस)`)}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <WishlistButton productId={product.id} productName={displayName} variant="inline" />
        {existingLine ? (
          <p className="text-sm text-muted">
            {existingLine.item.quantity} {t.products.pieces}{" "}
            <Link
              href="/order-list"
              className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              {t.nav.orderList}
            </Link>{" "}
            {language === "en" ? "are in your list" : "में हैं"}
          </p>
        ) : null}
      </div>

      {/* Mobile Sticky Bottom Order Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-2.5 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="min-w-0 flex flex-col justify-center">
            <span className="text-[0.625rem] font-bold uppercase tracking-wider text-muted truncate">
              {totalQuantity} {t.products.pieces} {rules.min > 1 ? `· Min ${rules.min}` : ""}
            </span>
            <span className="type-price text-xl font-bold text-maroon tabular-nums leading-tight">
              {formatPrice(estimatedTotal)}
            </span>
          </div>

          <Button
            size="md"
            disabled={isOutOfStock || isBelowMoq}
            onClick={handleAddToOrderList}
            leadingIcon={<BagIcon size={16} />}
            className="font-semibold shadow-sm px-4 sm:px-5 shrink-0"
          >
            {isOutOfStock
              ? t.products.outOfStock
              : isBelowMoq
                ? (language === "en" ? `Need +${moqDeficit} pcs` : `+${moqDeficit} पीस चाहिए`)
                : (language === "en" ? `Add to Order (${totalQuantity})` : `ऑर्डर में जोड़ें (${totalQuantity})`)}
          </Button>
        </div>
      </div>
    </div>
  );
}
