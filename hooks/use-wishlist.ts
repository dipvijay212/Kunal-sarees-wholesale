import { useMemo } from "react";
import { getProductById } from "@/lib/catalog";
import { removeFromWishlist, toggleWishlist, wishlistStore } from "@/lib/stores";
import type { Product } from "@/types";
import { useHydrated } from "./use-hydrated";
import { useLocalStore } from "./use-local-store";

/**
 * Saved design ids live in this browser. Pass `source` (products fetched from the API)
 * to resolve them; the client-side product store is empty for storefront visitors.
 */
export function useWishlist(source?: Product[]) {
  const ids = useLocalStore(wishlistStore);
  const hydrated = useHydrated();

  const products = useMemo(
    () =>
      ids
        .map((id) => (source ? source.find((product) => product.id === id) : getProductById(id)))
        .filter((product): product is Product => product !== undefined),
    [ids, source],
  );

  return {
    ids,
    products,
    /** Number of saved designs (for badges; doesn't need the product list). */
    count: ids.length,
    hydrated,
    isSaved: (productId: string) => ids.includes(productId),
    toggle: toggleWishlist,
    remove: removeFromWishlist,
  };
}
