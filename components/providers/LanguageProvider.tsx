"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LANGUAGE_SETTINGS,
  hi,
  translations,
  getLocalizedValue,
  type Language,
  type TranslationDictionary,
  type WebsiteLanguageSettings,
} from "@/lib/translations";
import { settingsApi } from "@/lib/api";

const STORAGE_KEY = "kunal_preferred_language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  settings: WebsiteLanguageSettings;
  getLocalized: <T extends Record<string, any>>(item: T | null | undefined, field: string) => string;
  refreshSettings: () => Promise<void>;
  isSwitchAllowed: boolean;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getSavedUserLanguage(): Language | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "hi" || saved === "en") return saved as Language;

    const match = document.cookie.match(/kunal_lang=(hi|en)/);
    if (match && (match[1] === "hi" || match[1] === "en")) {
      return match[1] as Language;
    }
  } catch {
    // ignore
  }
  return null;
}

export function LanguageProvider({
  children,
  initialLanguage = "hi",
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [settings, setSettings] = useState<WebsiteLanguageSettings>(DEFAULT_LANGUAGE_SETTINGS);

  // Synchronously initialize language from user preference or SSR prop to eliminate any flash
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = getSavedUserLanguage();
    if (saved) return saved;
    if (initialLanguage && (initialLanguage === "hi" || initialLanguage === "en")) return initialLanguage;
    return "hi";
  });

  // Fetch live settings from backend and apply
  const refreshSettings = async () => {
    try {
      const liveSettings = await settingsApi.getLanguage();
      if (liveSettings && Array.isArray(liveSettings.availableLanguages)) {
        const nextSettings: WebsiteLanguageSettings = {
          defaultLanguage: liveSettings.defaultLanguage || "hi",
          availableLanguages: liveSettings.availableLanguages.length > 0 ? liveSettings.availableLanguages : ["hi", "en"],
          allowCustomerLanguageSwitch: Boolean(liveSettings.allowCustomerLanguageSwitch),
        };
        setSettings(nextSettings);

        // Apply language according to settings & user preference
        const saved = getSavedUserLanguage();
        if (nextSettings.allowCustomerLanguageSwitch && saved && nextSettings.availableLanguages.includes(saved)) {
          setLanguageState(saved);
          if (typeof document !== "undefined") {
            document.documentElement.lang = saved;
          }
        } else if (!nextSettings.allowCustomerLanguageSwitch) {
          // Forced admin language
          setLanguageState(nextSettings.defaultLanguage);
          if (typeof document !== "undefined") {
            document.documentElement.lang = nextSettings.defaultLanguage;
          }
        } else if (!saved) {
          // No user preference: use admin default
          setLanguageState(nextSettings.defaultLanguage);
          if (typeof document !== "undefined") {
            document.documentElement.lang = nextSettings.defaultLanguage;
          }
        }
      }
    } catch {
      // Fallback silently to defaults if backend unavailable
    }
  };

  useEffect(() => {
    // Ensure document.documentElement.lang is correct on mount
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }

    refreshSettings();

    const handleSync = () => {
      refreshSettings();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("kunal_language_settings_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("kunal_language_settings_updated", handleSync);
    };
  }, []);

  const setLanguage = (newLang: Language) => {
    if (!settings.availableLanguages.includes(newLang)) return;
    if (!settings.allowCustomerLanguageSwitch) return;

    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.cookie = `kunal_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
      }
    } catch {
      // ignore storage errors
    }
  };

  const t = useMemo(() => {
    return (translations[language] || hi) as TranslationDictionary;
  }, [language]);

  const getLocalized = useMemo(() => {
    return <T extends Record<string, any>>(item: T | null | undefined, field: string): string => {
      return getLocalizedValue(item, field, language);
    };
  }, [language]);

  const isSwitchAllowed = settings.allowCustomerLanguageSwitch && settings.availableLanguages.length > 1;

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t,
    settings,
    getLocalized,
    refreshSettings,
    isSwitchAllowed,
    availableLanguages: settings.availableLanguages,
  }), [language, t, settings, getLocalized, isSwitchAllowed]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components rendered outside provider
    return {
      language: "hi",
      setLanguage: () => {},
      t: hi as TranslationDictionary,
      settings: DEFAULT_LANGUAGE_SETTINGS,
      getLocalized: (item, field) => getLocalizedValue(item, field, "hi"),
      refreshSettings: async () => {},
      isSwitchAllowed: true,
      availableLanguages: ["hi", "en"],
    };
  }
  return context;
}
