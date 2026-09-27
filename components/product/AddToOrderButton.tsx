"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { useUI } from "@/components/providers/UIProvider";
import { CheckIcon, PlusIcon } from "@/components/ui/Icons";
import { useOrderList } from "@/hooks/use-order-list";
import { cn } from "@/lib/cn";
import { getQuantityRules } from "@/lib/quantity";
import type { Product } from "@/types";

interface AddToOrderButtonProps {
  product: Product;
  className?: string;
}

export function AddToOrderButton({ product, className }: AddToOrderButtonProps) {
  const { getLocalized, language } = useLanguage();
  const { lines, addItem, hydrated } = useOrderList();
  const { openOrderList } = useUI();
  const { min, step } = getQuantityRules(product);
  const displayName = getLocalized(product, "name") || product.name;

  // Real store state: check if product is currently in order list
  const existingLine = hydrated ? lines.find((line) => line.product.id === product.id) : undefined;
  const isInOrderList = Boolean(existingLine);
  const currentQuantity = existingLine ? existingLine.item.quantity : 0;

  const handleAddInitial = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, min);
  };

  const handleAddMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, step || min);
  };

  const handleOpenList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openOrderList();
  };

  const addLabel = language === "en"
    ? `Add to Order (${min} pcs)`
    : `ऑर्डर लिस्ट में जोड़ें (${min} पीस)`;

  const inOrderLabel = language === "en"
    ? `In Order (${currentQuantity} pcs)`
    : `लिस्ट में है (${currentQuantity} पीस)`;

  if (isInOrderList) {
    return (
      <div className={cn("relative z-10 flex items-center gap-1.5 w-full", className)}>
        {/* Main button: Click to view/manage order list */}
        <button
          type="button"
          onClick={handleOpenList}
          aria-label={`${displayName} - ${inOrderLabel}`}
          className="flex-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-xs border border-success/60 bg-success/15 px-3 font-sans text-[0.8125rem] font-semibold tracking-[0.03em] text-success transition-all duration-200 hover:bg-success/25 focus-visible:outline-2 focus-visible:outline-gold shadow-xs active:scale-[0.99]"
        >
          <CheckIcon size={16} className="shrink-0 text-success" />
          <span className="truncate">{inOrderLabel}</span>
        </button>

        {/* Quick + button: Add more pieces */}
        <button
          type="button"
          onClick={handleAddMore}
          aria-label={language === "en" ? `Add ${step || min} more pieces of ${displayName}` : `${displayName} के ${step || min} पीस और जोड़ें`}
          title={language === "en" ? `Add +${step || min} pcs` : `+${step || min} पीस और जोड़ें`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xs border border-line-strong bg-cream-warm text-maroon hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 shadow-xs active:scale-[0.95]"
        >
          <PlusIcon size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddInitial}
      aria-label={`${displayName} - ${addLabel}`}
      className={cn(
        "relative z-10 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xs border border-maroon bg-maroon px-4 font-sans text-[0.8125rem] font-semibold tracking-[0.04em] text-white transition-all duration-200 hover:bg-maroon-dark hover:border-maroon-dark focus-visible:outline-2 focus-visible:outline-gold shadow-xs active:scale-[0.99]",
        className,
      )}
    >
      <PlusIcon size={16} className="shrink-0" />
      <span>{addLabel}</span>
    </button>
  );
}
