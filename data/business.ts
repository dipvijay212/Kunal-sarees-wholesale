import type { BusinessSettings } from "@/types";

const DEFAULT_WHATSAPP_NUMBER = "919913238496";

/** Returns digits with the country code, as wa.me links require. A bare 10-digit number is treated as Indian. */
function normaliseWhatsAppNumber(value: string | undefined): string {
  const digits = (value ?? "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) return `91${digits}`;
  return digits.length > 10 ? digits : DEFAULT_WHATSAPP_NUMBER;
}

/** The only canonical production origin. Used for canonical URLs, the sitemap, Open Graph and JSON-LD. */
export const PRODUCTION_SITE_URL = "https://www.kunalsarees.in";

/**
 * Resolves the public site origin. A `*.vercel.app` value (the old demo domain or a
 * preview URL) is never used, so it can't leak into canonical URLs or the sitemap.
 */
function normaliseSiteUrl(value: string | undefined): string {
  const url = (value ?? "").trim().replace(/\/+$/, "");
  let isVercelHost = false;
  try {
    isVercelHost = url !== "" && new URL(url).hostname.endsWith(".vercel.app");
  } catch {
    // Not a valid absolute URL; fall through to the defaults below.
  }
  if (url && !isVercelHost && /^https?:\/\//.test(url)) return url;
  return process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : "http://localhost:3000";
}

const whatsappNumber = normaliseWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

/**
 * Built-in fallbacks for business identity and wholesale policy. Contact details,
 * address, hours and social links are managed in Admin → Settings and stored in the
 * database (see lib/business-settings.ts); only confirmed values are kept here, and
 * anything unset stays empty so the site never shows made-up details.
 */
export const businessSettings: BusinessSettings = {
  id: "biz-kunal-sarees",
  businessName: "Kunal Sarees",
  brandMark: "KS",
  positioning: "प्रीमियम होलसेल साड़ियां",
  description:
    "Kunal Sarees से बुटीक, दुकानदारों और रीसेलर्स को बनारसी, सिल्क, ऑर्गेंजा और ब्राइडल साड़ियों का बेहतरीन होलसेल कलेक्शन मिलता है।",
  currency: "INR",
  locale: "hi_IN",
  gstin: "",
  contact: {
    whatsappNumber,
    phoneDisplay: `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 7)} ${whatsappNumber.slice(7)}`,
    phoneHref: `tel:+${whatsappNumber}`,
    email: "",
    address: {
      lines: [],
      city: "Surat",
      region: "Gujarat",
      postalCode: "",
      country: "India",
    },
    hours: [],
  },
  wholesale: {
    gstRate: 5,
    dispatchDays: "2–4 working days",
    madeToOrderDays: "10–15 working days",
    returnWindowDays: 7,
    lowStockThreshold: 12,
  },
  brand: {
    logo: { src: "/brand/ks-logo-320.png", width: 320, height: 320 },
    ogImage: "/brand/og-image.png",
  },
  seo: {
    siteUrl: normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  },
  // Social links are set in Admin → Settings.
  social: [],
};
