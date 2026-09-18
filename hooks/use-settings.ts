"use client";

import { useLocalStore } from "@/hooks/use-local-store";
import { adminSettingsStore } from "@/lib/admin-stores";
import { businessSettings as staticSettings } from "@/data/business";
import type { BusinessSettings } from "@/types";

export function useSettings(): BusinessSettings {
  const storeSettings = useLocalStore(adminSettingsStore);
  if (typeof window === "undefined") return staticSettings;
  return storeSettings;
}
