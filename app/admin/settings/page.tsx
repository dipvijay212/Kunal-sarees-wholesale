"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { useSettingsSavedInDatabase, useRefreshBusinessSettings } from "@/components/providers/SettingsProvider";
import { useLocalStore } from "@/hooks/use-local-store";
import { useSettings } from "@/hooks/use-settings";
import { businessSettings as defaultSettings, DEFAULT_STOREFRONT_IMAGES } from "@/data/business";
import { adminSettingsStore } from "@/lib/admin-stores";
import type { BusinessSettings } from "@/types";
import { adminApi, settingsApi } from "@/lib/api";
import { mergeBusinessSettings } from "@/lib/business-settings";
import { Button } from "@/components/ui/Button";
import { DEFAULT_LANGUAGE_SETTINGS, type Language, type WebsiteLanguageSettings } from "@/lib/translations";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { MapPinIcon } from "@/components/ui/Icons";

export default function AdminSettingsPage() {
  // Current values from the database (loaded by the root layout).
  const settings = useSettings();
  const router = useRouter();
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);
  const { refreshSettings } = useLanguage();
  const refreshBusinessSettings = useRefreshBusinessSettings();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingLang, setIsSavingLang] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [imageSuccessMessage, setImageSuccessMessage] = useState<string | null>(null);
  const [mapSuccessMessage, setMapSuccessMessage] = useState<string | null>(null);

  // Business settings form
  const toForm = (source: BusinessSettings) => ({
    businessName: source.businessName,
    whatsappNumber: source.contact.whatsappNumber,
    phoneDisplay: source.contact.phoneDisplay,
    email: source.contact.email,
    mapUrl: source.contact.mapUrl || "",
    lines: source.contact.address.lines.join("\n"),
    city: source.contact.address.city,
    region: source.contact.address.region,
    postalCode: source.contact.address.postalCode,
    hoursWeekday: source.contact.hours[0]?.hours || "",
    hoursSunday: source.contact.hours[1]?.hours || "",
    instagram: source.social.find((s) => s.platform === "instagram")?.href || "",
    facebook: source.social.find((s) => s.platform === "facebook")?.href || "",
    youtube: source.social.find((s) => s.platform === "youtube")?.href || "",
    heroImage: source.storefrontImages?.heroImage || DEFAULT_STOREFRONT_IMAGES.heroImage,
    wholesaleBannerImage: source.storefrontImages?.wholesaleBannerImage || DEFAULT_STOREFRONT_IMAGES.wholesaleBannerImage,
    whyChooseUsImage: source.storefrontImages?.whyChooseUsImage || DEFAULT_STOREFRONT_IMAGES.whyChooseUsImage,
  });
  const [form, setForm] = useState(() => toForm(settings));

  // Load latest live settings directly from the backend on mount
  useEffect(() => {
    settingsApi.getBusiness()
      .then((res) => {
        if (res && res.businessSettings) {
          const merged = mergeBusinessSettings(res.businessSettings);
          setForm(toForm(merged));
        }
      })
      .catch(() => {});
  }, []);

  const saveBusinessData = async (formToSave = form) => {
    setIsSavingBusiness(true);
    setErrorMessage(null);

    try {
      await adminApi.settings.updateBusiness({
        businessName: formToSave.businessName,
        contact: {
          whatsappNumber: formToSave.whatsappNumber,
          phoneDisplay: formToSave.phoneDisplay,
          email: formToSave.email,
          mapUrl: formToSave.mapUrl?.trim() || null,
          address: {
            lines: formToSave.lines.split("\n").filter(Boolean),
            city: formToSave.city,
            region: formToSave.region,
            postalCode: formToSave.postalCode,
            country: "India",
          },
          hours: [
            { days: "Monday – Saturday", hours: formToSave.hoursWeekday },
            { days: "Sunday", hours: formToSave.hoursSunday },
          ],
        },
        social: [
          { platform: "instagram", label: "Instagram", href: formToSave.instagram },
          { platform: "facebook", label: "Facebook", href: formToSave.facebook },
          { platform: "youtube", label: "YouTube", href: formToSave.youtube },
        ].filter((link) => link.href.trim() !== "") as { platform: "instagram" | "facebook" | "youtube"; label: string; href: string }[],
        storefrontImages: {
          heroImage: formToSave.heroImage?.trim() || null,
          wholesaleBannerImage: formToSave.wholesaleBannerImage?.trim() || null,
          whyChooseUsImage: formToSave.whyChooseUsImage?.trim() || null,
        },
      });

      // Synchronize client-side providers and other open tabs immediately
      try {
        localStorage.setItem("kunal_business_settings_sync", Date.now().toString());
        window.dispatchEvent(new CustomEvent("kunal_business_settings_updated"));
      } catch {
        // ignore storage errors
      }

      await refreshBusinessSettings();
      router.refresh();

      setSuccessMessage("✓ Settings saved successfully! Storefront has been updated.");
      setImageSuccessMessage("✓ Saved to database! Your storefront homepage images are now updated.");
      setMapSuccessMessage("✓ Saved to database! Your Google Maps link is now active on the storefront.");
      setTimeout(() => {
        setSuccessMessage(null);
        setImageSuccessMessage(null);
        setMapSuccessMessage(null);
      }, 7000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const handleStorefrontImageUpload = async (
    field: "heroImage" | "wholesaleBannerImage" | "whyChooseUsImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploadingField(field);
    setErrorMessage(null);
    try {
      const res = await adminApi.media.uploadImages([file]);
      if (res && res.urls && res.urls[0]) {
        const updatedForm = {
          ...form,
          [field]: res.urls[0],
        };
        setForm(updatedForm);
        // Automatically save to database immediately upon upload so changes take effect instantly!
        await saveBusinessData(updatedForm);
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to upload image.";
      setErrorMessage(`Upload failed: ${msg}`);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setUploadingField(null);
    }
  };

  // Older versions of this page saved contact details only in this browser. Until the
  // database has settings, offer to load those so they can be saved properly.
  const savedInDatabase = useSettingsSavedInDatabase();
  const browserSaved = useLocalStore(adminSettingsStore);
  const hasBrowserOnlyDetails =
    !savedInDatabase && browserSaved !== defaultSettings && Boolean(browserSaved?.contact?.address);

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

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveBusinessData(form);
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
          {hasBrowserOnlyDetails ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xs border border-gold/50 bg-gold/10 p-4 text-xs text-ink">
              <p>
                Contact details you entered earlier were saved only in this browser, not in the database, so
                visitors don&apos;t see them. Load them into this form, check them, then press Save Contact Settings.
              </p>
              <Button type="button" size="sm" variant="secondary" onClick={() => setForm(toForm(browserSaved))}>
                Use details saved in this browser
              </Button>
            </div>
          ) : null}
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

          <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs ring-1 ring-gold/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
              <div>
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-gold">Location &amp; Maps</span>
                <h3 className="type-h4 text-ink font-serif mt-0.5">Google Maps &amp; Directions</h3>
                <p className="text-xs text-muted mt-0.5">
                  Set the direct Google Maps URL for your showroom so customers can navigate directly to your shop.
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                {form.mapUrl?.trim() ? (
                  <a
                    href={form.mapUrl.trim().startsWith("http") ? form.mapUrl.trim() : `https://${form.mapUrl.trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xs border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-maroon hover:bg-gold/20 transition-colors"
                  >
                    <MapPinIcon size={14} className="text-gold-dark" />
                    <span>Test Map Link ↗</span>
                  </a>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  disabled={isSavingBusiness}
                  onClick={() => saveBusinessData(form)}
                  className="bg-maroon hover:bg-maroon-dark text-white text-xs font-semibold px-4 py-2 shadow-xs"
                >
                  {isSavingBusiness ? "Saving..." : "Save Map URL"}
                </Button>
              </div>
            </div>

            {mapSuccessMessage ? (
              <div className="mt-4 rounded-xs border border-success/40 bg-success/10 p-3 text-xs font-semibold text-success flex items-center justify-between gap-3 animate-in fade-in">
                <span>{mapSuccessMessage}</span>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xs bg-success/20 px-2.5 py-1 text-xs font-bold text-success hover:bg-success/30 underline shrink-0 transition-colors"
                >
                  View Footer on Website ↗
                </a>
              </div>
            ) : null}

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink block text-xs">
                  Google Maps URL (Get Directions Link)
                </label>
                <input
                  type="url"
                  placeholder="https://maps.app.goo.gl/... or https://maps.google.com/..."
                  value={form.mapUrl}
                  onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none font-mono"
                />
              </div>

              <div className="rounded-xs bg-surface p-3.5 border border-line/60 flex items-start gap-2.5 text-muted text-[0.6875rem] leading-relaxed">
                <span className="text-gold font-bold text-xs mt-0.5 shrink-0">📍</span>
                <div>
                  When customers click <strong className="text-ink font-semibold">&ldquo;GET DIRECTIONS (GOOGLE MAPS) &rarr;&rdquo;</strong> in the website footer or the map button on the Contact page, they will directly navigate to this link.
                  <br />
                  <span className="text-subtle mt-0.5 block">
                    Tip: Open Google Maps on your phone or computer &rarr; Search your shop / showroom location &rarr; Click <em>Share</em> &rarr; Click <em>Copy link</em> &rarr; Paste here. If left empty, the website will automatically search Google Maps for your business name &amp; address.
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={isSavingBusiness}
                  onClick={() => saveBusinessData(form)}
                  className="bg-maroon hover:bg-maroon-dark text-white text-xs font-semibold px-4 py-2 shadow-xs"
                >
                  {isSavingBusiness ? "Saving..." : "Save Map URL"}
                </Button>
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

          {/* ================================================================= */}
          {/* STOREFRONT BANNERS & EDITORIAL SHOWCASE IMAGES                    */}
          {/* ================================================================= */}
          <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs ring-1 ring-gold/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
              <div>
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-gold">Storefront Visuals</span>
                <h3 className="type-h4 text-ink font-serif mt-0.5">Homepage Banners &amp; Editorial Showcase Images</h3>
                <p className="text-xs text-muted mt-1">
                  Customize the high-resolution photographs displayed across your homepage sections. Photos uploaded from your device are saved to the website automatically.
                </p>
              </div>
              <div className="shrink-0">
                <Button
                  type="button"
                  size="sm"
                  disabled={isSavingBusiness}
                  onClick={() => saveBusinessData(form)}
                  className="bg-maroon hover:bg-maroon-dark text-white text-xs font-semibold px-4 py-2 shadow-xs"
                >
                  {isSavingBusiness ? "Saving..." : "Save Images to Website"}
                </Button>
              </div>
            </div>

            {imageSuccessMessage ? (
              <div className="mt-4 rounded-xs border border-success/40 bg-success/10 p-3.5 text-xs font-semibold text-success flex items-center justify-between gap-3 animate-in fade-in">
                <span>{imageSuccessMessage}</span>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xs bg-success/20 px-2.5 py-1 text-xs font-bold text-success hover:bg-success/30 underline shrink-0 transition-colors"
                >
                  View Live Website ↗
                </a>
              </div>
            ) : null}

            <div className="mt-6 space-y-6 text-xs">
              {/* 1. Hero Showcase Image */}
              <div className="rounded-xs border border-line bg-surface p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Preview */}
                  <div className="shrink-0">
                    <div className="relative aspect-[3/4] w-28 sm:w-32 overflow-hidden rounded-xs border border-line bg-cream-warm shadow-xs">
                      {form.heroImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.heroImage}
                          alt="Hero banner preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted text-[0.6875rem] p-2 text-center">
                          No Image
                        </div>
                      )}
                    </div>
                    <span className="mt-1 block text-center text-[0.625rem] text-muted">Preview (3:4)</span>
                  </div>

                  {/* Controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-ink text-sm block">
                          1. Homepage Hero Showcase Photo
                        </label>
                        <div className="flex items-center gap-1.5">
                          {form.heroImage && !form.heroImage.includes("unsplash.com") ? (
                            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.625rem] font-semibold text-success">
                              ● Custom Uploaded
                            </span>
                          ) : (
                            <span className="rounded-full bg-line px-2 py-0.5 text-[0.625rem] font-medium text-muted">
                              ● Default Stock
                            </span>
                          )}
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.625rem] font-semibold text-maroon">
                            Top Hero
                          </span>
                        </div>
                      </div>
                      <p className="text-muted mt-1 text-xs">
                        Featured on the right side of the main homepage hero banner (beside <em>&quot;Curated Weaves for Boutiques &amp; Retailers&quot;</em>).
                      </p>

                      <div className="mt-3">
                        <label className="text-[0.6875rem] font-medium text-muted block mb-1">
                          Image URL (Cloudinary or CDN)
                        </label>
                        <input
                          type="url"
                          value={form.heroImage}
                          onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                          placeholder="https://..."
                          className="w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-line/60">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className={`inline-flex items-center gap-1.5 rounded-xs border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:border-accent hover:text-accent cursor-pointer ${uploadingField === "heroImage" ? "opacity-60 pointer-events-none" : ""}`}>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            disabled={uploadingField === "heroImage"}
                            onChange={(e) => handleStorefrontImageUpload("heroImage", e)}
                          />
                          <span>{uploadingField === "heroImage" ? "Uploading to Cloudinary..." : "Upload New Photo"}</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setForm({ ...form, heroImage: DEFAULT_STOREFRONT_IMAGES.heroImage })}
                          className="text-[0.6875rem] text-muted hover:text-maroon underline px-2 py-1"
                        >
                          Reset to Original
                        </button>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isSavingBusiness}
                        onClick={() => saveBusinessData(form)}
                        className="bg-maroon hover:bg-maroon-dark text-white text-[0.6875rem] py-1 px-3"
                      >
                        {isSavingBusiness ? "Saving..." : "Save Photo"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Wholesale Inquiries Banner Image */}
              <div className="rounded-xs border border-line bg-surface p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Preview */}
                  <div className="shrink-0">
                    <div className="relative aspect-[4/3] w-28 sm:w-32 overflow-hidden rounded-xs border border-line bg-cream-warm shadow-xs">
                      {form.wholesaleBannerImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.wholesaleBannerImage}
                          alt="Wholesale banner preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted text-[0.6875rem] p-2 text-center">
                          No Image
                        </div>
                      )}
                    </div>
                    <span className="mt-1 block text-center text-[0.625rem] text-muted">Preview</span>
                  </div>

                  {/* Controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-ink text-sm block">
                          2. Wholesale Enquiry Banner Photo
                        </label>
                        <div className="flex items-center gap-1.5">
                          {form.wholesaleBannerImage && !form.wholesaleBannerImage.includes("unsplash.com") ? (
                            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.625rem] font-semibold text-success">
                              ● Custom Uploaded
                            </span>
                          ) : (
                            <span className="rounded-full bg-line px-2 py-0.5 text-[0.625rem] font-medium text-muted">
                              ● Default Stock
                            </span>
                          )}
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.625rem] font-semibold text-maroon">
                            Wholesale CTA
                          </span>
                        </div>
                      </div>
                      <p className="text-muted mt-1 text-xs">
                        Featured on the maroon wholesale CTA banner (beside <em>&quot;Looking for the Right Sarees for Your Business?&quot;</em>).
                      </p>

                      <div className="mt-3">
                        <label className="text-[0.6875rem] font-medium text-muted block mb-1">
                          Image URL (Cloudinary or CDN)
                        </label>
                        <input
                          type="url"
                          value={form.wholesaleBannerImage}
                          onChange={(e) => setForm({ ...form, wholesaleBannerImage: e.target.value })}
                          placeholder="https://..."
                          className="w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-line/60">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className={`inline-flex items-center gap-1.5 rounded-xs border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:border-accent hover:text-accent cursor-pointer ${uploadingField === "wholesaleBannerImage" ? "opacity-60 pointer-events-none" : ""}`}>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            disabled={uploadingField === "wholesaleBannerImage"}
                            onChange={(e) => handleStorefrontImageUpload("wholesaleBannerImage", e)}
                          />
                          <span>{uploadingField === "wholesaleBannerImage" ? "Uploading to Cloudinary..." : "Upload New Photo"}</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setForm({ ...form, wholesaleBannerImage: DEFAULT_STOREFRONT_IMAGES.wholesaleBannerImage })}
                          className="text-[0.6875rem] text-muted hover:text-maroon underline px-2 py-1"
                        >
                          Reset to Original
                        </button>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isSavingBusiness}
                        onClick={() => saveBusinessData(form)}
                        className="bg-maroon hover:bg-maroon-dark text-white text-[0.6875rem] py-1 px-3"
                      >
                        {isSavingBusiness ? "Saving..." : "Save Photo"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Why Partner with Kunal Sarees Image */}
              <div className="rounded-xs border border-line bg-surface p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Preview */}
                  <div className="shrink-0">
                    <div className="relative aspect-[4/5] w-28 sm:w-32 overflow-hidden rounded-xs border border-line bg-cream-warm shadow-xs">
                      {form.whyChooseUsImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.whyChooseUsImage}
                          alt="Why partner image preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted text-[0.6875rem] p-2 text-center">
                          No Image
                        </div>
                      )}
                    </div>
                    <span className="mt-1 block text-center text-[0.625rem] text-muted">Preview (4:5)</span>
                  </div>

                  {/* Controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-ink text-sm block">
                          3. &quot;Why Partner with Kunal Sarees&quot; Photo
                        </label>
                        <div className="flex items-center gap-1.5">
                          {form.whyChooseUsImage && !form.whyChooseUsImage.includes("unsplash.com") ? (
                            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.625rem] font-semibold text-success">
                              ● Custom Uploaded
                            </span>
                          ) : (
                            <span className="rounded-full bg-line px-2 py-0.5 text-[0.625rem] font-medium text-muted">
                              ● Default Stock
                            </span>
                          )}
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.625rem] font-semibold text-maroon">
                            Why Us Section
                          </span>
                        </div>
                      </div>
                      <p className="text-muted mt-1 text-xs">
                        Featured alongside the wholesale advantage pillars (titled <em>&quot;Exquisite Weaves &amp; Craftsmanship&quot;</em>).
                      </p>

                      <div className="mt-3">
                        <label className="text-[0.6875rem] font-medium text-muted block mb-1">
                          Image URL (Cloudinary or CDN)
                        </label>
                        <input
                          type="url"
                          value={form.whyChooseUsImage}
                          onChange={(e) => setForm({ ...form, whyChooseUsImage: e.target.value })}
                          placeholder="https://..."
                          className="w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-line/60">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className={`inline-flex items-center gap-1.5 rounded-xs border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:border-accent hover:text-accent cursor-pointer ${uploadingField === "whyChooseUsImage" ? "opacity-60 pointer-events-none" : ""}`}>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            disabled={uploadingField === "whyChooseUsImage"}
                            onChange={(e) => handleStorefrontImageUpload("whyChooseUsImage", e)}
                          />
                          <span>{uploadingField === "whyChooseUsImage" ? "Uploading to Cloudinary..." : "Upload New Photo"}</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setForm({ ...form, whyChooseUsImage: DEFAULT_STOREFRONT_IMAGES.whyChooseUsImage })}
                          className="text-[0.6875rem] text-muted hover:text-maroon underline px-2 py-1"
                        >
                          Reset to Original
                        </button>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isSavingBusiness}
                        onClick={() => saveBusinessData(form)}
                        className="bg-maroon hover:bg-maroon-dark text-white text-[0.6875rem] py-1 px-3"
                      >
                        {isSavingBusiness ? "Saving..." : "Save Photo"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" disabled={isSavingBusiness}>
              {isSavingBusiness ? "Saving to Database..." : "Save Store & Banner Settings"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
