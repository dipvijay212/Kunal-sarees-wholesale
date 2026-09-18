import type { BusinessSettings } from "@/types";

const DEFAULT_WHATSAPP_NUMBER = "919913238496";

/** Returns digits with the country code, as wa.me links require. A bare 10-digit number is treated as Indian. */
function normaliseWhatsAppNumber(value: string | undefined): string {
  const digits = (value ?? "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) return `91${digits}`;
  return digits.length > 10 ? digits : DEFAULT_WHATSAPP_NUMBER;
}

function normaliseSiteUrl(value: string | undefined): string {
  return (value ?? "http://localhost:3000").replace(/\/+$/, "");
}

const whatsappNumber = normaliseWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

/**
 * Single source of truth for business identity, contact details and wholesale
 * policy. data/site.ts derives the storefront `siteConfig` from this.
 *
 * TODO: the GSTIN, email, street address, hours and social URLs are mock
 * placeholders — replace them with the confirmed business details.
 */
export const businessSettings: BusinessSettings = {
  id: "biz-kunal-sarees",
  businessName: "Kunal Sarees",
  brandMark: "KS",
  positioning: "Premium Wholesale Sarees",
  description:
    "Kunal Sarees supplies boutiques and retailers across India with premium Banarasi, Kanjivaram, organza and bridal sarees at wholesale prices.",
  currency: "INR",
  locale: "en_IN",
  gstin: "24ABCDE1234F1Z5",
  contact: {
    whatsappNumber,
    phoneDisplay: `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 7)} ${whatsappNumber.slice(7)}`,
    phoneHref: `tel:+${whatsappNumber}`,
    email: "wholesale@kunalsarees.com",
    address: {
      lines: ["Shop 214, Second Floor, Textile Market", "Ring Road"],
      city: "Surat",
      region: "Gujarat",
      postalCode: "395002",
      country: "India",
    },
    hours: [
      { days: "Monday – Saturday", hours: "10:00 AM – 7:30 PM" },
      { days: "Sunday", hours: "By appointment" },
    ],
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
  social: [
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/kunalsarees" },
    { platform: "facebook", label: "Facebook", href: "https://www.facebook.com/kunalsarees" },
    { platform: "youtube", label: "YouTube", href: "https://www.youtube.com/@kunalsarees" },
  ],
};
