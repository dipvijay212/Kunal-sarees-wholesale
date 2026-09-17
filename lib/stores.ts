import type { OrderListItem } from "@/types";
import { createLocalStore } from "./local-store";

/*
 * Browser-persisted stores. Keys are versioned so the stored shape can change
 * later without reading incompatible data.
 */

const EMPTY_ORDER_LIST: OrderListItem[] = [];
const EMPTY_WISHLIST: string[] = [];

function isOrderListItem(value: unknown): value is OrderListItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    typeof item.addedAt === "number"
  );
}

function isOrderList(value: unknown): value is OrderListItem[] {
  return Array.isArray(value) && value.every(isOrderListItem);
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

export const orderListStore = createLocalStore<OrderListItem[]>({
  key: "ks:order-list:v1",
  initialValue: EMPTY_ORDER_LIST,
  validate: isOrderList,
});

export const wishlistStore = createLocalStore<string[]>({
  key: "ks:wishlist:v1",
  initialValue: EMPTY_WISHLIST,
  validate: isStringList,
});

/* Order list actions ------------------------------------------------------- */

export function addToOrderList(productId: string, quantity: number) {
  orderListStore.set((items) => {
    const existing = items.find((item) => item.productId === productId);
    if (existing) {
      return items.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
      );
    }
    return [...items, { productId, quantity, addedAt: Date.now() }];
  });
}

export function setOrderListQuantity(productId: string, quantity: number) {
  orderListStore.set((items) =>
    items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
  );
}

export function removeFromOrderList(productId: string) {
  orderListStore.set((items) => items.filter((item) => item.productId !== productId));
}

export function clearOrderList() {
  orderListStore.reset();
}

/* Wishlist actions --------------------------------------------------------- */

export function toggleWishlist(productId: string) {
  wishlistStore.set((ids) =>
    ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId],
  );
}

export function removeFromWishlist(productId: string) {
  wishlistStore.set((ids) => ids.filter((id) => id !== productId));
}
