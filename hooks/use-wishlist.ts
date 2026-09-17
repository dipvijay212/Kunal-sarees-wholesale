import { useMemo } from "react";
import { getProductById } from "@/lib/catalog";
import { removeFromWishlist, toggleWishlist, wishlistStore } from "@/lib/stores";
import type { Product } from "@/types";
import { useHydrated } from "./use-hydrated";
import { useLocalStore } from "./use-local-store";

export function useWishlist() {
  const ids = useLocalStore(wishlistStore);
  const hydrated = useHydrated();

  const products = useMemo(
    () => ids.map((id) => getProductById(id)).filter((product): product is Product => product !== undefined),
    [ids],
  );

  return {
    ids,
    products,
    count: products.length,
    hydrated,
    isSaved: (productId: string) => ids.includes(productId),
    toggle: toggleWishlist,
    remove: removeFromWishlist,
  };
}
