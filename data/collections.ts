import type { Collection } from "@/types";
import { unsplashImage } from "./images";

/** Curated wholesale collections shown on the storefront. */
export const collections: Collection[] = [
  {
    id: "col-premium-banarasi",
    name: "Banarasi Sarees",
    slug: "banarasi-sarees",
    tagline: "Katan and tanchoi from Varanasi",
    description:
      "Our top Banarasi weaves — pure katan silk, real zari and jaal pallus, sourced directly from master weavers.",
    image: unsplashImage("1641699862936-be9f49b1c38d", "Woman in an elegant gold and wine Banarasi saree"),
    featured: true,
    order: 1,
  },
  {
    id: "col-silk",
    name: "Silk Sarees",
    slug: "silk-sarees",
    tagline: "Kanjivaram, Tussar and satin silks",
    description:
      "Structured silks for customers who buy once and keep for decades. Temple borders, korvai contrasts and handloom Tussar.",
    image: unsplashImage("1679006831648-7c9ea12e5807", "Woman in a rich green silk saree with gold border"),
    featured: true,
    order: 2,
  },
  {
    id: "col-georgette",
    name: "Georgette Sarees",
    slug: "georgette-sarees",
    tagline: "Fluid georgettes & Chikankari work",
    description:
      "Fluid georgettes that move well and travel light. Easy to wear, easy to sell and priced for steady repeat orders.",
    image: unsplashImage("1617055407123-3d7130c1f940", "Soft fluid georgette saree texture with subtle zari"),
    featured: true,
    order: 3,
  },
  {
    id: "col-cotton",
    name: "Cotton Sarees",
    slug: "cotton-sarees",
    tagline: "Handloom Chanderi & Jamdani",
    description:
      "Breathable handloom cottons, Chanderi and Jamdani weaves for daily wear, boutique collections, and daytime wear.",
    image: unsplashImage("1774437561949-17b3bcf88db9", "Woman in an elegant handloom cotton saree"),
    featured: true,
    order: 4,
  },
  {
    id: "col-organza",
    name: "Organza Sarees",
    slug: "organza-sarees",
    tagline: "Crisp pastel tissue & cutwork",
    description:
      "Crisp, sheer organza in soft pastels with pearl, sequin and thread work. Light on the shoulder, strong on the shelf.",
    image: unsplashImage("1770199105820-2e12ecee91a1", "Sheer pastel organza saree fabric with fine borders"),
    featured: true,
    order: 5,
  },
  {
    id: "col-bridal",
    name: "Bridal Collection",
    slug: "bridal-collection",
    tagline: "Trousseau pieces, single unit orders",
    description:
      "Statement bridal sarees in heavy zari and zardozi handwork, supplied in presentation boxes and available as single pieces.",
    image: unsplashImage("1570212773364-e30cd076539e", "Bride wearing an heirloom wedding saree"),
    featured: true,
    order: 6,
  },
];

