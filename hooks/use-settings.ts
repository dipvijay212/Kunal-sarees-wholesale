"use client";

import { useBusinessSettings } from "@/components/providers/SettingsProvider";
import type { BusinessSettings } from "@/types";

/** Business settings saved in Admin → Settings (database), with built-in fallbacks. */
export function useSettings(): BusinessSettings {
  return useBusinessSettings();
}
