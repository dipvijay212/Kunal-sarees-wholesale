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

/** Google Maps listing for the Surat shop: the embeddable map and the share link that opens it. */
export const shopMap = {
  embedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.9047189398616!2d72.8730469!3d21.156189800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be05155d97c1b05%3A0x997084795ed8a019!2sKunal%20Sarees!5e0!3m2!1sen!2sin!4v1790845044447!5m2!1sen!2sin",
  placeUrl: "https://maps.app.goo.gl/QhiMqT5FrAuZDJ3m6",
} as const;

/** Google Maps search link for the saved business address. */
export function getDirectionsUrl(settings: BusinessSettings = getLiveSettings()): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.businessName}, ${formatAddress(", ", settings)}`)}`;
}
