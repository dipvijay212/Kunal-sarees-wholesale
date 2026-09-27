"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { businessSettings } from "@/data/business";
import { getAvailability } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import type { Product } from "@/types";

/** Stock line derived from the product's stock count. */
export function StockStatusLabel({ product, className }: { product: Product; className?: string }) {
  const { t, language } = useLanguage();
  const availability = getAvailability(product);

  const { label, dotClass } =
    availability === "out-of-stock"
      ? {
          label: language === "en"
            ? `Made to order · ${businessSettings.wholesale.madeToOrderDays}`
            : `ऑर्डर पर बनेगी · ${businessSettings.wholesale.madeToOrderDays}`,
          dotClass: "bg-maroon",
        }
      : availability === "low-stock"
        ? {
            label: language === "en"
              ? `Only ${formatNumber(product.stock)} pcs left · Low Stock`
              : `सिर्फ ${formatNumber(product.stock)} पीस बाकी · कम स्टॉक`,
            dotClass: "bg-warning",
          }
        : {
            label: language === "en"
              ? `In Stock · ${formatNumber(product.stock)} pcs · Dispatches in ${businessSettings.wholesale.dispatchDays}`
              : `स्टॉक में है · ${formatNumber(product.stock)} पीस · ${businessSettings.wholesale.dispatchDays} में डिस्पैच`,
            dotClass: "bg-success",
          };

  return (
    <p className={cn("flex items-center gap-2 text-xs leading-normal text-muted font-sans", className)}>
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", dotClass)} />
      <span className="truncate sm:text-wrap">{label}</span>
    </p>
  );
}
