import type { Banner } from "@/types";

/**
 * Promotional banners. The home hero reads the highest-priority active
 * `home-hero` banner, so seasonal messaging can change without touching JSX.
 */
export const banners: Banner[] = [
  {
    id: "ban-home-hero",
    placement: "home-hero",
    eyebrow: "Premium Wholesale Sarees",
    title: "Heirloom weaves,",
    titleAccent: "curated for boutiques",
    description:
      "Kunal Sarees supplies retailers across India with Banarasi, Kanjivaram, organza and bridal sarees — selected for weave, finish and how well they sell.",
    primaryCta: { label: "Explore collections", href: "/collections" },
    whatsAppCta: { label: "Wholesale enquiry" },
    active: true,
    priority: 1,
  },
  {
    id: "ban-home-hero-festive",
    placement: "home-hero",
    eyebrow: "Festive 2026",
    title: "Festive sets,",
    titleAccent: "ready to dispatch",
    description:
      "Sequin, mirror and bandhani work in the colours that move through Navratri and the wedding season. Book your sets early.",
    primaryCta: { label: "Shop the festive edit", href: "/collections/festive-collection" },
    whatsAppCta: { label: "Ask for the festive catalogue" },
    active: false,
    priority: 2,
  },
  {
    id: "ban-home-promo-bridal",
    placement: "home-promo",
    eyebrow: "Bridal couture",
    title: "Single-piece bridal orders",
    description:
      "Offer exclusivity without holding deep stock. Bridal designs ship as single pieces, in a presentation box.",
    primaryCta: { label: "View bridal collection", href: "/collections/bridal-collection" },
    active: true,
    priority: 1,
  },
  {
    id: "ban-catalogue-moq",
    placement: "catalogue",
    title: "Minimums start at a single bridal piece",
    description: "Every design lists its own minimum order quantity and set size.",
    primaryCta: { label: "Wholesale terms", href: "/wholesale" },
    active: true,
    priority: 1,
  },
];
