import { useMemo } from "react";
import { adminProductsStore } from "@/lib/admin-stores";
import { resolveOrderListLines, summarizeOrderList } from "@/lib/order-list";
import {
  addToOrderList,
  clearOrderList,
  orderListStore,
  removeFromOrderList,
  setOrderListQuantity,
} from "@/lib/stores";
import { useHydrated } from "./use-hydrated";
import { useLocalStore } from "./use-local-store";

export function useOrderList() {
  const items = useLocalStore(orderListStore);
  const hydrated = useHydrated();

  // Lines are resolved against the client catalogue, so recompute when it loads or changes.
  const catalogue = useLocalStore(adminProductsStore);
  const lines = useMemo(() => resolveOrderListLines(items, catalogue), [items, catalogue]);
  const summary = useMemo(() => summarizeOrderList(lines), [lines]);

  return {
    lines,
    summary,
    hydrated,
    addItem: addToOrderList,
    updateQuantity: setOrderListQuantity,
    removeItem: removeFromOrderList,
    clear: clearOrderList,
  };
}
