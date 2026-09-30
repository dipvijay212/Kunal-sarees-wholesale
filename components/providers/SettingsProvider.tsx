"use client";

import { createContext, useContext } from "react";
import { getLiveSettings, setLiveSettings } from "@/lib/business-settings";
import type { BusinessSettings } from "@/types";

interface SettingsContextValue {
  settings: BusinessSettings;
  /** True when the admin has saved settings in the database. */
  fromDatabase: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

/** Provides the database-backed business settings fetched in the root layout. */
export function SettingsProvider({
  settings,
  fromDatabase,
  children,
}: SettingsContextValue & { children: React.ReactNode }) {
  // Keep non-React helpers (WhatsApp links, directions) in sync; idempotent assignment.
  setLiveSettings(settings);
  return <SettingsContext.Provider value={{ settings, fromDatabase }}>{children}</SettingsContext.Provider>;
}

export function useBusinessSettings(): BusinessSettings {
  return useContext(SettingsContext)?.settings ?? getLiveSettings();
}

/** Whether Admin → Settings has been saved to the database yet. */
export function useSettingsSavedInDatabase(): boolean {
  return useContext(SettingsContext)?.fromDatabase ?? false;
}
