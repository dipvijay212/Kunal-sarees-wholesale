export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
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

export interface BusinessAddress {
  lines: string[];
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  positioning: string;
  description: string;
  url: string;
  locale: string;
  brand: {
    logo: {
      src: string;
      width: number;
      height: number;
    };
    ogImage: string;
  };
  contact: {
    whatsappNumber: string;
    phoneDisplay: string;
    phoneHref: string;
    email: string;
    address: BusinessAddress;
    hours: BusinessHours[];
  };
  social: SocialLink[];
}

export interface Highlight {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
