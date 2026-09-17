/**
 * A tiny localStorage-backed store designed for React's useSyncExternalStore.
 *
 * - Safe to import on the server: storage is only touched in the browser.
 * - The server snapshot is always `initialValue`, so hydration never mismatches.
 * - Keeps multiple tabs in sync through the `storage` event.
 * - Invalid or corrupted stored data falls back to `initialValue`.
 */

export interface LocalStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (next: T | ((previous: T) => T)) => void;
  reset: () => void;
}

interface LocalStoreOptions<T> {
  key: string;
  initialValue: T;
  validate: (value: unknown) => value is T;
}

export function createLocalStore<T>({ key, initialValue, validate }: LocalStoreOptions<T>): LocalStore<T> {
  const listeners = new Set<() => void>();
  let state = initialValue;
  let hasLoaded = false;

  function readFromStorage(): T {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed: unknown = JSON.parse(raw);
      return validate(parsed) ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  }

  function writeToStorage(value: T) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable (private mode, quota exceeded). The in-memory
      // state still works for the current session.
    }
  }

  function ensureLoaded() {
    if (hasLoaded || typeof window === "undefined") return;
    hasLoaded = true;
    state = readFromStorage();
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  function handleStorage(event: StorageEvent) {
    if (event.key !== null && event.key !== key) return;
    state = readFromStorage();
    emit();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", handleStorage);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
      };
    },

    getSnapshot() {
      ensureLoaded();
      return state;
    },

    getServerSnapshot() {
      return initialValue;
    },

    set(next) {
      ensureLoaded();
      const value = typeof next === "function" ? (next as (previous: T) => T)(state) : next;
      if (Object.is(value, state)) return;
      state = value;
      writeToStorage(value);
      emit();
    },

    reset() {
      state = initialValue;
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore unavailable storage.
      }
      emit();
    },
  };
}
