import type { OrderListItem, OrderListLine, OrderListSummary } from "@/types";
import { getProductById } from "./catalog";
import { getQuantityRules, normalizeQuantity } from "./quantity";

/**
 * Resolves stored order list items against the catalogue. Items whose product
 * no longer exists are dropped, and quantities are re-validated against the
 * product's current order rules.
 */
export function resolveOrderListLines(items: OrderListItem[]): OrderListLine[] {
  const lines: OrderListLine[] = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) continue;

    const quantity = normalizeQuantity(item.quantity, getQuantityRules(product.pricing));
    lines.push({
      item: { ...item, quantity },
      product,
      lineTotal: quantity * product.pricing.pricePerPiece,
    });
  }

  return lines.sort((a, b) => a.item.addedAt - b.item.addedAt);
}

export function summarizeOrderList(lines: OrderListLine[]): OrderListSummary {
  return lines.reduce<OrderListSummary>(
    (summary, line) => ({
      designCount: summary.designCount + 1,
      totalPieces: summary.totalPieces + line.item.quantity,
      estimatedValue: summary.estimatedValue + line.lineTotal,
    }),
    { designCount: 0, totalPieces: 0, estimatedValue: 0 },
  );
}
