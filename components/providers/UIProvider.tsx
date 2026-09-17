"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Panel = "order-list" | "search" | null;

interface UIContextValue {
  isOrderListOpen: boolean;
  isSearchOpen: boolean;
  openOrderList: () => void;
  closeOrderList: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

/**
 * Shared, non-persisted UI state for global panels (order list drawer and
 * search dialog). Only one panel is open at a time, and each close action only
 * affects its own panel, so a late close event can never dismiss the other.
 */
export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);

  const value = useMemo<UIContextValue>(() => {
    const closeIf = (target: Exclude<Panel, null>) => () =>
      setPanel((current) => (current === target ? null : current));

    return {
      isOrderListOpen: panel === "order-list",
      isSearchOpen: panel === "search",
      openOrderList: () => setPanel("order-list"),
      closeOrderList: closeIf("order-list"),
      openSearch: () => setPanel("search"),
      closeSearch: closeIf("search"),
    };
  }, [panel]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used inside <UIProvider>.");
  }
  return context;
}
