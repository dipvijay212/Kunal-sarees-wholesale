import type { SiteConfig } from "@/types";

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

export const siteConfig: SiteConfig = {
  name: "Kunal Sarees",
  shortName: "KS",
  positioning: "Premium Wholesale Sarees",
  description:
    "Kunal Sarees supplies boutiques and retailers across India with premium Banarasi, Kanjivaram, organza and bridal sarees at wholesale prices.",
  url: normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "en_IN",
  brand: {
    logo: {
      src: "/brand/ks-logo-320.png",
      width: 320,
      height: 320,
    },
    ogImage: "/brand/og-image.png",
  },
  contact: {
    whatsappNumber,
    phoneDisplay: `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 7)} ${whatsappNumber.slice(7)}`,
    phoneHref: `tel:+${whatsappNumber}`,
    // TODO: mock details — replace the email, address and hours with the confirmed business details.
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
  // TODO: mock profile URLs — replace with the real social accounts.
  social: [
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/kunalsarees" },
    { platform: "facebook", label: "Facebook", href: "https://www.facebook.com/kunalsarees" },
    { platform: "youtube", label: "YouTube", href: "https://www.youtube.com/@kunalsarees" },
  ],
};

/** Single-line postal address, e.g. for map links and structured data. */
export function formatAddress(separator = ", "): string {
  const { address } = siteConfig.contact;
  return [...address.lines, `${address.city}, ${address.region} ${address.postalCode}`, address.country].join(separator);
}

/** Google Maps search link for the business address. */
export function getDirectionsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.name}, ${formatAddress()}`)}`;
}
