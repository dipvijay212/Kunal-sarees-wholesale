export interface BusinessAddress {
  lines: string[];
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface BusinessHours {
  days: string;
  hours: string;
}

export type SocialPlatform = "instagram" | "facebook" | "youtube";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

/** Single source of truth for business identity, contact and wholesale policy. */
export interface BusinessSettings {
  id: string;
  businessName: string;
  /** Short brand mark, e.g. "KS". */
  brandMark: string;
  positioning: string;
  description: string;
  currency: "INR";
  locale: string;
  gstin: string;
  contact: {
    whatsappNumber: string;
    phoneDisplay: string;
    phoneHref: string;
    email: string;
    address: BusinessAddress;
    hours: BusinessHours[];
  };
  wholesale: {
    /** GST percentage added to wholesale prices at invoicing. */
    gstRate: number;
    dispatchDays: string;
    madeToOrderDays: string;
    returnWindowDays: number;
    /** Pieces below which a design counts as low stock in the UI. */
    lowStockThreshold: number;
  };
  brand: {
    logo: { src: string; width: number; height: number };
    ogImage: string;
  };
  seo: {
    siteUrl: string;
  };
  social: SocialLink[];
}
