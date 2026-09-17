import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * Returns `false` during server rendering and hydration, then `true`.
 * Use it to avoid flashing empty states before browser-only data is read.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
