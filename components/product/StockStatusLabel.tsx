import { cn } from "@/lib/cn";
import type { StockStatus } from "@/types";

const statusContent: Record<StockStatus, { label: string; dotClass: string }> = {
  "in-stock": { label: "In stock · Ready to dispatch", dotClass: "bg-success" },
  "low-stock": { label: "Limited stock · Enquire soon", dotClass: "bg-warning" },
  "made-to-order": { label: "Made to order · 10–15 working days", dotClass: "bg-ice-500" },
};

export function StockStatusLabel({ status, className }: { status: StockStatus; className?: string }) {
  const { label, dotClass } = statusContent[status];

  return (
    <p className={cn("flex items-center gap-2.5 text-sm text-muted", className)}>
      <span aria-hidden="true" className={cn("size-2 rounded-full", dotClass)} />
      {label}
    </p>
  );
}
