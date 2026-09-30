import { getLiveSettings } from "@/lib/business-settings";
import type { BusinessSettings } from "@/types";
import { businessSettings } from "./business";

/**
 * Storefront view of the business settings, kept as a small flat object because
 * layout, metadata and UI components read these values constantly.
 * Edit the values in data/business.ts — this is only a projection.
 */
export const siteConfig = {
  name: businessSettings.businessName,
  shortName: businessSettings.brandMark,
  positioning: businessSettings.positioning,
  description: businessSettings.description,
  url: businessSettings.seo.siteUrl,
  locale: businessSettings.locale,
  brand: businessSettings.brand,
  contact: businessSettings.contact,
  social: businessSettings.social,
} as const;

/** Single-line postal address from the saved (database) settings, e.g. for map links. */
export function formatAddress(separator = ", ", settings: BusinessSettings = getLiveSettings()): string {
  const { address } = settings.contact;
  const cityLine = [address.city, [address.region, address.postalCode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return [...address.lines, cityLine, address.country].filter(Boolean).join(separator);
}

/** Google Maps search link for the saved business address. */
export function getDirectionsUrl(settings: BusinessSettings = getLiveSettings()): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.businessName}, ${formatAddress(", ", settings)}`)}`;
}
