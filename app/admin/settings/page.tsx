"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminSettingsStore, updateAdminSettings } from "@/lib/admin-stores";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { DEFAULT_LANGUAGE_SETTINGS, type Language, type WebsiteLanguageSettings } from "@/lib/translations";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AdminSettingsPage() {
  const settings = useLocalStore(adminSettingsStore);
  const { refreshSettings } = useLanguage();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingLang, setIsSavingLang] = useState(false);

  // Business settings form
  const [form, setForm] = useState({
    businessName: settings.businessName,
    whatsappNumber: settings.contact.whatsappNumber,
    phoneDisplay: settings.contact.phoneDisplay,
    email: settings.contact.email,
    lines: settings.contact.address.lines.join("\n"),
    city: settings.contact.address.city,
    region: settings.contact.address.region,
    postalCode: settings.contact.address.postalCode,
    hoursWeekday: settings.contact.hours[0]?.hours || "10:00 AM – 7:30 PM",
    hoursSunday: settings.contact.hours[1]?.hours || "By appointment",
    instagram: settings.social.find((s) => s.platform === "instagram")?.href || "",
    facebook: settings.social.find((s) => s.platform === "facebook")?.href || "",
    youtube: settings.social.find((s) => s.platform === "youtube")?.href || "",
  });

  // Website language settings state
  const [langSettings, setLangSettings] = useState<WebsiteLanguageSettings>(DEFAULT_LANGUAGE_SETTINGS);

  useEffect(() => {
    adminApi.settings.getLanguage()
      .then((res) => {
        if (res && Array.isArray(res.availableLanguages)) {
          setLangSettings({
            defaultLanguage: res.defaultLanguage,
            availableLanguages: res.availableLanguages,
            allowCustomerLanguageSwitch: res.allowCustomerLanguageSwitch,
          });
        }
      })
      .catch(() => {
        // Fallback to defaults
      });
  }, []);

  const handleLangCheckboxChange = (lang: Language) => {
    let updated = [...langSettings.availableLanguages];
    if (updated.includes(lang)) {
      if (updated.length === 1) {
        setErrorMessage("At least one language must remain enabled.");
        setTimeout(() => setErrorMessage(null), 4000);
        return;
      }
      updated = updated.filter((l) => l !== lang);
    } else {
      updated.push(lang);
    }

    let defaultLang = langSettings.defaultLanguage;
    if (!updated.includes(defaultLang)) {
      defaultLang = updated[0];
    }

    setLangSettings({
      ...langSettings,
      availableLanguages: updated,
      defaultLanguage: defaultLang,
    });
  };

  const [langSuccessMessage, setLangSuccessMessage] = useState<string | null>(null);
  const [langErrorMessage, setLangErrorMessage] = useState<string | null>(null);

  const handleSaveLanguageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLang(true);
    setLangErrorMessage(null);
    setLangSuccessMessage(null);

    try {
      await adminApi.settings.updateLanguage({
        defaultLanguage: langSettings.defaultLanguage,
        availableLanguages: langSettings.availableLanguages,
        allowCustomerLanguageSwitch: langSettings.allowCustomerLanguageSwitch,
      });

      // Update local storage and dispatch event so all open tabs synchronize immediately
      try {
        if (!langSettings.allowCustomerLanguageSwitch) {
          localStorage.setItem("kunal_preferred_language", langSettings.defaultLanguage);
          document.cookie = `kunal_lang=${langSettings.defaultLanguage}; path=/; max-age=31536000; SameSite=Lax`;
        }
        localStorage.setItem("kunal_settings_sync", Date.now().toString());
        window.dispatchEvent(new CustomEvent("kunal_language_settings_updated"));
      } catch {
        // ignore storage errors
      }

      await refreshSettings();
      setLangSuccessMessage("✓ Saved! Language settings updated in MySQL database and applied to storefront.");
      setSuccessMessage("Website Language settings saved successfully! Storefront will update accordingly.");
      setTimeout(() => {
        setLangSuccessMessage(null);
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      const msg = err.message || "Failed to update language settings.";
      setLangErrorMessage(msg);
      setErrorMessage(msg);
      setTimeout(() => {
        setLangErrorMessage(null);
        setErrorMessage(null);
      }, 5000);
    } finally {
      setIsSavingLang(false);
    }
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateAdminSettings({
      businessName: form.businessName,
      contact: {
        whatsappNumber: form.whatsappNumber,
        phoneDisplay: form.phoneDisplay,
        email: form.email,
        phoneHref: `tel:+${form.whatsappNumber}`,
        address: {
          lines: form.lines.split("\n").filter(Boolean),
          city: form.city,
          region: form.region,
          postalCode: form.postalCode,
          country: "India",
        },
        hours: [
          { days: "Monday – Saturday", hours: form.hoursWeekday },
          { days: "Sunday", hours: form.hoursSunday },
        ],
      },
      social: [
        { platform: "instagram", label: "Instagram", href: form.instagram },
        { platform: "facebook", label: "Facebook", href: form.facebook },
        { platform: "youtube", label: "YouTube", href: form.youtube },
      ],
    });

    setSuccessMessage("Business & Store contact settings saved successfully!");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <AdminLayout title="Store & Website Settings">
      <div className="border-b border-line pb-5">
        <h2 className="type-h4 text-ink font-serif">Store Configuration & Language Controls</h2>
        <p className="text-xs text-muted">
          Manage storefront language architecture, contact channels, WhatsApp enquiry routing, store address and hours.
        </p>
      </div>

      {successMessage ? (
        <div className="mt-4 rounded-xs border border-success/30 bg-success/10 p-3 text-xs font-semibold text-success">
          ✓ {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-xs border border-danger/30 bg-danger/10 p-3 text-xs font-semibold text-danger">
          ⚠ {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 space-y-8 max-w-3xl">
        {/* ================================================================= */}
        {/* 1. WEBSITE LANGUAGE & LOCALIZATION SETTINGS                        */}
        {/* ================================================================= */}
        <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs ring-1 ring-gold/20">
          <div className="border-b border-line pb-3">
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-gold">Public Storefront</span>
            <h3 className="type-h4 text-ink font-serif mt-0.5">Website Language Settings</h3>
            <p className="text-xs text-muted mt-1">
              Configure which languages are available on the customer website and control whether visitors can switch languages.
            </p>
          </div>

          <form onSubmit={handleSaveLanguageSettings} className="mt-5 space-y-5 text-xs">
            {/* Enabled / Available Languages */}
            <div>
              <label className="font-semibold text-ink block mb-1.5 text-sm">
                Available Website Languages
              </label>
              <p className="text-muted mb-3 text-xs">
                Select which languages are supported in the storefront catalog and admin forms.
              </p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2.5 rounded-xs border border-line bg-surface p-3 cursor-pointer hover:border-accent">
                  <input
                    type="checkbox"
                    checked={langSettings.availableLanguages.includes("hi")}
                    onChange={() => handleLangCheckboxChange("hi")}
                    className="size-4 rounded text-maroon focus:ring-accent"
                  />
                  <div>
                    <span className="font-semibold text-ink block text-xs">Hindi (हिंदी)</span>
                    <span className="text-[0.6875rem] text-muted">Customer-first native Hindi</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 rounded-xs border border-line bg-surface p-3 cursor-pointer hover:border-accent">
                  <input
                    type="checkbox"
                    checked={langSettings.availableLanguages.includes("en")}
                    onChange={() => handleLangCheckboxChange("en")}
                    className="size-4 rounded text-maroon focus:ring-accent"
                  />
                  <div>
                    <span className="font-semibold text-ink block text-xs">English (EN)</span>
                    <span className="text-[0.6875rem] text-muted">Boutique & Pan-India English</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Default Language Selector */}
            <div className="pt-2">
              <label className="font-semibold text-ink block mb-1.5 text-sm">
                Default Website Language
              </label>
              <p className="text-muted mb-3 text-xs">
                Language shown to first-time visitors and used when language switching is disabled.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {langSettings.availableLanguages.includes("hi") && (
                  <label
                    className={`flex items-center gap-3 rounded-xs border p-3 cursor-pointer transition-all ${
                      langSettings.defaultLanguage === "hi"
                        ? "border-maroon bg-accent-soft text-maroon ring-1 ring-maroon"
                        : "border-line bg-surface text-ink hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="defaultLanguage"
                      value="hi"
                      checked={langSettings.defaultLanguage === "hi"}
                      onChange={() => setLangSettings({ ...langSettings, defaultLanguage: "hi" })}
                      className="size-4 text-maroon"
                    />
                    <div>
                      <span className="font-bold block text-xs">Hindi (हिंदी)</span>
                      <span className="text-[0.6875rem] opacity-80">Default website starts in Hindi</span>
                    </div>
                  </label>
                )}

                {langSettings.availableLanguages.includes("en") && (
                  <label
                    className={`flex items-center gap-3 rounded-xs border p-3 cursor-pointer transition-all ${
                      langSettings.defaultLanguage === "en"
                        ? "border-maroon bg-accent-soft text-maroon ring-1 ring-maroon"
                        : "border-line bg-surface text-ink hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="defaultLanguage"
                      value="en"
                      checked={langSettings.defaultLanguage === "en"}
                      onChange={() => setLangSettings({ ...langSettings, defaultLanguage: "en" })}
                      className="size-4 text-maroon"
                    />
                    <div>
                      <span className="font-bold block text-xs">English (EN)</span>
                      <span className="text-[0.6875rem] opacity-80">Default website starts in English</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Allow Customer Language Switch Toggle */}
            <div className="pt-3 border-t border-line">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={langSettings.allowCustomerLanguageSwitch}
                  onChange={(e) =>
                    setLangSettings({
                      ...langSettings,
                      allowCustomerLanguageSwitch: e.target.checked,
                    })
                  }
                  className="mt-0.5 size-4 rounded text-maroon focus:ring-accent"
                />
                <div>
                  <span className="font-semibold text-ink block text-xs sm:text-sm">
                    Allow Customer Language Switching (Show Switcher in Footer)
                  </span>
                  <span className="text-muted block text-xs mt-0.5">
                    If checked, customers see a "हिंदी | English" toggle in the website footer to choose their preferred language. If unchecked, all customers view the website in the Admin default language.
                  </span>
                </div>
              </label>
            </div>

            {/* Inline Feedback & Action Bar */}
            {langSuccessMessage ? (
              <div className="rounded-xs border border-success/40 bg-success/10 p-3 text-xs font-semibold text-success flex items-center justify-between gap-3 animate-in fade-in">
                <span>{langSuccessMessage}</span>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-success/80 shrink-0 font-bold"
                >
                  Preview Storefront ↗
                </a>
              </div>
            ) : null}

            {langErrorMessage ? (
              <div className="rounded-xs border border-danger/40 bg-danger/10 p-3 text-xs font-semibold text-danger animate-in fade-in">
                ⚠ {langErrorMessage}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-muted">
                Active Default: <strong className="text-maroon font-bold">{langSettings.defaultLanguage === "hi" ? "Hindi (हिंदी)" : "English (EN)"}</strong>
              </span>
              <div className="flex items-center gap-3">
                <Button type="submit" size="md" disabled={isSavingLang}>
                  {isSavingLang ? "Saving to Database..." : "Save Language Settings"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* ================================================================= */}
        {/* 2. BUSINESS CONTACT & IDENTITY FORM                               */}
        {/* ================================================================= */}
        <form onSubmit={handleBusinessSubmit} className="space-y-6">
          <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs">
            <h3 className="type-h4 text-ink font-serif border-b border-line pb-3">Business Identity</h3>
            <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
              <div>
                <label className="font-semibold text-ink block">Business Name</label>
                <input
                  type="text"
                  required
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-ink block">Support Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs">
            <h3 className="type-h4 text-ink font-serif border-b border-line pb-3">Contact & WhatsApp Desk</h3>
            <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
              <div>
                <label className="font-semibold text-ink block">WhatsApp Number (with country code, digits only)</label>
                <input
                  type="text"
                  required
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Phone Display</label>
                <input
                  type="text"
                  required
                  value={form.phoneDisplay}
                  onChange={(e) => setForm({ ...form, phoneDisplay: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs">
            <h3 className="type-h4 text-ink font-serif border-b border-line pb-3">Store Showroom Address</h3>
            <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="font-semibold text-ink block">Address Lines (one per line)</label>
                <textarea
                  rows={2}
                  value={form.lines}
                  onChange={(e) => setForm({ ...form, lines: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">City</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">State / Region</label>
                <input
                  type="text"
                  required
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Postal Code</label>
                <input
                  type="text"
                  required
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs">
            <h3 className="type-h4 text-ink font-serif border-b border-line pb-3">Business Hours & Social Links</h3>
            <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
              <div>
                <label className="font-semibold text-ink block">Monday – Saturday Hours</label>
                <input
                  type="text"
                  value={form.hoursWeekday}
                  onChange={(e) => setForm({ ...form, hoursWeekday: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Sunday Hours</label>
                <input
                  type="text"
                  value={form.hoursSunday}
                  onChange={(e) => setForm({ ...form, hoursSunday: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Instagram URL</label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Facebook URL</label>
                <input
                  type="text"
                  value={form.facebook}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Save Contact Settings
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
