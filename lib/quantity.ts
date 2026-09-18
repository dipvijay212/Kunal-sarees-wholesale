import type { Product } from "@/types";

/** Upper bound for a single design on one order. Larger orders are handled directly. */
export const MAX_ORDER_QUANTITY = 500;

export interface QuantityRules {
  min: number;
  max: number;
  step: number;
}

type QuantityInput = Pick<Product, "moq" | "orderMultiple" | "stock">;

/**
 * Order rules for a design: the minimum order quantity, the set size it must be
 * ordered in, and an upper bound. Available stock caps the maximum; designs
 * with no stock can still be enquired about (they are made to order).
 */
export function getQuantityRules({ moq, orderMultiple, stock }: QuantityInput): QuantityRules {
  const step = Math.max(1, orderMultiple);
  const min = Math.max(step, Math.ceil(moq / step) * step);
  const cap = stock > 0 ? Math.min(stock, MAX_ORDER_QUANTITY) : MAX_ORDER_QUANTITY;
  const max = Math.max(min, Math.floor(cap / step) * step);
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
