import { businessSettings } from "@/data/business";
import { getAvailability } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import type { Product } from "@/types";

/** Stock line derived from the product's stock count. */
export function StockStatusLabel({ product, className }: { product: Product; className?: string }) {
  const availability = getAvailability(product);

  const { label, dotClass } =
    availability === "out-of-stock"
      ? {
          label: `Made to order · ${businessSettings.wholesale.madeToOrderDays}`,
          dotClass: "bg-maroon",
        }
      : availability === "low-stock"
        ? { label: `Only ${formatNumber(product.stock)} pieces left · Low stock`, dotClass: "bg-warning" }
        : {
            label: `In stock · ${formatNumber(product.stock)} pieces · Dispatch in ${businessSettings.wholesale.dispatchDays}`,
            dotClass: "bg-success",
          };

  return (
    <p className={cn("flex items-center gap-2 text-xs leading-normal text-muted font-sans", className)}>
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", dotClass)} />
      <span className="truncate sm:text-wrap">{label}</span>
    </p>
  );
}
