import type { ProductImage } from "./product";

export type BannerPlacement = "home-hero" | "home-promo" | "catalogue";

export interface Banner {
  id: string;
  placement: BannerPlacement;
  eyebrow?: string;
  title: string;
  /** Italic second line of the headline, used by the home hero. */
  titleAccent?: string;
  description?: string;
  image?: ProductImage;
  primaryCta?: { label: string; href: string };
  /** When set, rendered as a WhatsApp click-to-chat button. */
  whatsAppCta?: { label: string };
  active: boolean;
  /** Lower numbers are shown first. */
  priority: number;
}
