import { useSyncExternalStore } from "react";
import type { LocalStore } from "@/lib/local-store";

/** Subscribes a component to a localStorage-backed store. */
export function useLocalStore<T>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
