"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getLiveSettings, setLiveSettings, mergeBusinessSettings } from "@/lib/business-settings";
import { settingsApi } from "@/lib/api";
import type { BusinessSettings } from "@/types";

interface SettingsContextValue {
  settings: BusinessSettings;
  /** True when the admin has saved settings in the database. */
  fromDatabase: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

/** Provides the database-backed business settings fetched in the root layout. */
export function SettingsProvider({
  settings: initialSettings,
  fromDatabase: initialFromDatabase,
  children,
}: {
  settings: BusinessSettings;
  fromDatabase: boolean;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [fromDatabase, setFromDatabase] = useState<boolean>(initialFromDatabase);

  const refreshSettings = async () => {
    try {
      const res = await settingsApi.getBusiness();
      if (res && res.businessSettings) {
        const merged = mergeBusinessSettings(res.businessSettings);
        setSettings(merged);
        setFromDatabase(true);
        setLiveSettings(merged);
      }
    } catch {
      // Fallback silently
    }
  };

  useEffect(() => {
    setSettings(initialSettings);
    setFromDatabase(initialFromDatabase);
  }, [initialSettings, initialFromDatabase]);

  useEffect(() => {
    setLiveSettings(settings);
  }, [settings]);

  useEffect(() => {
    // Refresh settings once on mount to guarantee latest database values
    refreshSettings();

    const handleSync = () => {
      refreshSettings();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("kunal_business_settings_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("kunal_business_settings_updated", handleSync);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, fromDatabase, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useBusinessSettings(): BusinessSettings {
  return useContext(SettingsContext)?.settings ?? getLiveSettings();
}

/** Whether Admin → Settings has been saved to the database yet. */
export function useSettingsSavedInDatabase(): boolean {
  return useContext(SettingsContext)?.fromDatabase ?? false;
}

export function useRefreshBusinessSettings(): () => Promise<void> {
  const ctx = useContext(SettingsContext);
  return ctx?.refreshSettings ?? (async () => {});
}
