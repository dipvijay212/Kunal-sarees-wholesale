"use client";

import { useSyncExternalStore, useState, useEffect, useCallback } from "react";
import { pwaStore, initPwa } from "@/lib/pwa";

export function usePwaInstall() {
  const state = useSyncExternalStore(
    pwaStore.subscribe,
    pwaStore.getSnapshot,
    pwaStore.getServerSnapshot,
  );

  const [isPrompting, setIsPrompting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    initPwa();
  }, []);

  const triggerInstall = useCallback(async () => {
    if (state.isInstalled) {
      setModalOpen(true);
      return;
    }

    if (state.canPromptNative) {
      setIsPrompting(true);
      try {
        const result = await pwaStore.prompt();
        if (result === "unsupported" || result === "dismissed") {
          // If native prompt was cancelled or failed, give manual instructions
          setModalOpen(true);
        }
      } catch {
        setModalOpen(true);
      } finally {
        setIsPrompting(false);
      }
    } else {
      setModalOpen(true);
    }
  }, [state.canPromptNative, state.isInstalled]);

  return {
    ...state,
    isPrompting,
    modalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    triggerInstall,
  };
}
