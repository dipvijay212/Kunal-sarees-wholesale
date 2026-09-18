"use client";

import { useState } from "react";
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
  const { addItem } = useOrderList();
  const [added, setAdded] = useState(false);
  const { min } = getQuantityRules(product);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, min);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${min} pieces of ${product.name} to order list`}
      className={cn(
        "relative z-10 mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xs px-3 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent",
        added
          ? "border border-success/30 bg-success/15 text-success"
          : "border border-line bg-canvas-deep text-ink hover:border-accent hover:bg-accent hover:text-white",
        className,
      )}
    >
      {added ? (
        <>
          <CheckIcon size={14} className="shrink-0 text-success" />
          <span>Added {min} pcs</span>
        </>
      ) : (
        <>
          <PlusIcon size={14} className="shrink-0" />
          <span>Add to Order ({min} pcs)</span>
        </>
      )}
    </button>
  );
}
