"use client";

import React from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "text" | "buttons";
  tone?: "default" | "dark";
}

export function LanguageSwitcher({ className, variant = "pill", tone = "default" }: LanguageSwitcherProps) {
  const { language, setLanguage, isSwitchAllowed, availableLanguages } = useLanguage();

  if (!isSwitchAllowed) return null;

  const isDarkTone = tone === "dark";

  if (variant === "text") {
    return (
      <div className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
        {availableLanguages.includes("hi") && (
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            aria-label="Switch to Hindi"
            className={cn(
              "transition-colors py-0.5 px-1.5 rounded-xs",
              isDarkTone
                ? language === "hi"
                  ? "text-gold-light font-bold underline decoration-gold-light underline-offset-4"
                  : "text-cream/80 hover:text-white"
                : language === "hi"
                  ? "text-maroon font-bold underline decoration-maroon/60 underline-offset-4"
                  : "text-muted hover:text-maroon"
            )}
          >
            हिंदी
          </button>
        )}
        {availableLanguages.includes("hi") && availableLanguages.includes("en") && (
          <span className={cn("select-none", isDarkTone ? "text-gold/40" : "text-line")}>|</span>
        )}
        {availableLanguages.includes("en") && (
          <button
            type="button"
            onClick={() => setLanguage("en")}
            aria-label="Switch to English"
            className={cn(
              "transition-colors py-0.5 px-1.5 rounded-xs",
              isDarkTone
                ? language === "en"
                  ? "text-gold-light font-bold underline decoration-gold-light underline-offset-4"
                  : "text-cream/80 hover:text-white"
                : language === "en"
                  ? "text-maroon font-bold underline decoration-maroon/60 underline-offset-4"
                  : "text-muted hover:text-maroon"
            )}
          >
            English
          </button>
        )}
      </div>
    );
  }

  // Pill variant
  return (
    <div
      role="group"
      aria-label="Language selection"
      className={cn(
        "inline-flex items-center rounded-full p-0.5 text-xs shadow-2xs",
        isDarkTone
          ? "border border-gold/40 bg-white/10 backdrop-blur-xs"
          : "border border-line bg-surface/80 backdrop-blur-xs",
        className
      )}
    >
      {availableLanguages.includes("hi") && (
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          aria-pressed={language === "hi"}
          className={cn(
            "rounded-full px-3 py-1 text-xs transition-all duration-200",
            isDarkTone
              ? language === "hi"
                ? "bg-gold text-maroon-dark font-bold shadow-xs"
                : "text-cream/90 hover:text-white hover:bg-white/10 font-medium"
              : language === "hi"
                ? "bg-maroon text-white font-semibold shadow-xs"
                : "text-muted hover:text-ink hover:bg-black/5 font-medium"
          )}
        >
          हिंदी
        </button>
      )}

      {availableLanguages.includes("en") && (
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={cn(
            "rounded-full px-3 py-1 text-xs transition-all duration-200",
            isDarkTone
              ? language === "en"
                ? "bg-gold text-maroon-dark font-bold shadow-xs"
                : "text-cream/90 hover:text-white hover:bg-white/10 font-medium"
              : language === "en"
                ? "bg-maroon text-white font-semibold shadow-xs"
                : "text-muted hover:text-ink hover:bg-black/5 font-medium"
          )}
        >
          English
        </button>
      )}
    </div>
  );
}

