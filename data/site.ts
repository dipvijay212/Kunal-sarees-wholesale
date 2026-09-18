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

/** Single-line postal address, e.g. for map links and structured data. */
export function formatAddress(separator = ", "): string {
  const { address } = businessSettings.contact;
  return [...address.lines, `${address.city}, ${address.region} ${address.postalCode}`, address.country].join(separator);
}

/** Google Maps search link for the business address. */
export function getDirectionsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.name}, ${formatAddress()}`)}`;
}
