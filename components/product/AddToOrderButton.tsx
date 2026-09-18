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
      aria-label={`Add ${min} pieces of ${product.name} to wholesale order list`}
      className={cn(
        "relative z-10 mt-3.5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xs px-4 font-sans text-[0.8125rem] font-semibold tracking-[0.08em] uppercase transition-all duration-200 focus-visible:outline-2 focus-visible:outline-gold shadow-xs active:scale-[0.99]",
        added
          ? "border border-success/40 bg-success/15 text-success"
          : "border border-maroon bg-maroon text-white hover:bg-maroon-dark hover:border-maroon-dark",
        className,
      )}
    >
      {added ? (
        <>
          <CheckIcon size={16} className="shrink-0 text-success" />
          <span>Added to Order ({min} pcs)</span>
        </>
      ) : (
        <>
          <PlusIcon size={16} className="shrink-0" />
          <span>Add to Order ({min} pcs)</span>
        </>
      )}
    </button>
  );
}

