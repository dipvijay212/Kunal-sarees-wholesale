import type { Product } from "./product";

/**
 * A line in the wholesale order list, persisted to localStorage.
 * Only identifiers and quantities are stored; product details are resolved
 * from the catalogue at render time so they never go stale.
 */
export interface OrderListItem {
  productId: string;
  quantity: number;
  /** Epoch milliseconds, used to keep the list in the order items were added. */
  addedAt: number;
}

export interface OrderListLine {
  item: OrderListItem;
  product: Product;
  lineTotal: number;
}

export interface OrderListSummary {
  designCount: number;
  totalPieces: number;
  estimatedValue: number;
}
