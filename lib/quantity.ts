import type { WholesalePricing } from "@/types";

/** Upper bound for a single design on one enquiry. Larger orders are handled directly. */
export const MAX_ORDER_QUANTITY = 500;

export interface QuantityRules {
  min: number;
  max: number;
  step: number;
}

export function getQuantityRules(pricing: WholesalePricing): QuantityRules {
  const step = Math.max(1, pricing.orderMultiple);
  const min = Math.max(step, Math.ceil(pricing.minimumOrderQuantity / step) * step);
  const max = Math.max(min, Math.floor(MAX_ORDER_QUANTITY / step) * step);
  return { min, max, step };
}

/**
 * Snaps a quantity to the nearest valid order: rounded up to a multiple of
 * `step` and clamped between `min` and `max`.
 */
export function normalizeQuantity(value: number, { min, max, step }: QuantityRules): number {
  if (!Number.isFinite(value)) return min;
  const safeStep = Math.max(1, step);
  const stepped = Math.ceil(value / safeStep) * safeStep;
  return Math.min(Math.max(stepped, min), max);
}
