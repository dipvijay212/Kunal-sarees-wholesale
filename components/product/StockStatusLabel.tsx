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
          dotClass: "bg-accent",
        }
      : availability === "low-stock"
        ? { label: `Only ${formatNumber(product.stock)} pieces left`, dotClass: "bg-warning" }
        : {
            label: `In stock · ${formatNumber(product.stock)} pieces · dispatch in ${businessSettings.wholesale.dispatchDays}`,
            dotClass: "bg-success",
          };

  return (
    <p className={cn("flex items-start gap-2.5 text-sm text-muted", className)}>
      <span aria-hidden="true" className={cn("mt-1.5 size-2 shrink-0 rounded-full", dotClass)} />
      {label}
    </p>
  );
}
