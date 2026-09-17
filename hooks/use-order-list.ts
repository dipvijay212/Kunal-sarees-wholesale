import { useMemo } from "react";
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

  const lines = useMemo(() => resolveOrderListLines(items), [items]);
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
