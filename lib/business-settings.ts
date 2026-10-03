import { businessSettings as defaultSettings } from "@/data/business";
import { settingsApi, type StoredBusinessSettings } from "@/lib/api";
import type { BusinessSettings } from "@/types";

/*
 * Business contact details come from the database (Admin → Settings). data/business.ts
 * only supplies fallbacks for fields that have never been saved.
 */

export interface LiveBusinessSettings {
  settings: BusinessSettings;
  /** True when the admin has saved settings in the database. */
  fromDatabase: boolean;
}

function formatPhoneDisplay(whatsappNumber: string): string {
  return `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 7)} ${whatsappNumber.slice(7)}`;
}

/** Saved values over the defaults; recomputes the derived phone link. */
export function mergeBusinessSettings(stored: StoredBusinessSettings | null | undefined): BusinessSettings {
  if (!stored) return defaultSettings;
  const contact = stored.contact ?? ({} as StoredBusinessSettings["contact"]);
  const whatsappNumber = contact.whatsappNumber || defaultSettings.contact.whatsappNumber;
  const address = contact.address;
  const hasAddress = Boolean(address && (address.lines?.length || address.city));

  return {
    ...defaultSettings,
    businessName: stored.businessName || defaultSettings.businessName,
    contact: {
      whatsappNumber,
      phoneDisplay: contact.phoneDisplay || formatPhoneDisplay(whatsappNumber),
      phoneHref: `tel:+${whatsappNumber}`,
      email: contact.email || defaultSettings.contact.email,
      address: hasAddress
        ? {
            lines: address.lines ?? [],
            city: address.city ?? "",
            region: address.region ?? "",
            postalCode: address.postalCode ?? "",
            country: address.country || "India",
          }
        : defaultSettings.contact.address,
      hours: contact.hours?.length ? contact.hours : defaultSettings.contact.hours,
    },
    // Once saved, the admin's list is used as-is (an empty list hides the icons).
    social: Array.isArray(stored.social) ? stored.social : defaultSettings.social,
    storefrontImages: {
      heroImage:
        stored.storefrontImages?.heroImage?.trim() ||
        defaultSettings.storefrontImages?.heroImage,
      wholesaleBannerImage:
        stored.storefrontImages?.wholesaleBannerImage?.trim() ||
        defaultSettings.storefrontImages?.wholesaleBannerImage,
      whyChooseUsImage:
        stored.storefrontImages?.whyChooseUsImage?.trim() ||
        defaultSettings.storefrontImages?.whyChooseUsImage,
    },
  };
}

/** Server: saved settings via the cached public API; defaults if the API is unreachable. */
export async function fetchBusinessSettings(): Promise<LiveBusinessSettings> {
  try {
    const { businessSettings } = await settingsApi.getBusiness();
    return { settings: mergeBusinessSettings(businessSettings), fromDatabase: Boolean(businessSettings) };
  } catch (err) {
    console.error("Error fetching business settings:", err);
    return { settings: defaultSettings, fromDatabase: false };
  }
}

/*
 * Current settings for non-React helpers (WhatsApp links, directions URL). Set by
 * SettingsProvider from the server-fetched value, so helpers and components agree.
 * The value is the same for every visitor, so sharing it across requests is safe.
 */
let current: BusinessSettings = defaultSettings;

export function setLiveSettings(settings: BusinessSettings): void {
  current = settings;
}

export function getLiveSettings(): BusinessSettings {
  return current;
}
