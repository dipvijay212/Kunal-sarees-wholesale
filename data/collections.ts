import type { Collection } from "@/types";
import { unsplashImage } from "./images";

/** Curated edits shown on the storefront. */
export const collections: Collection[] = [
  {
    id: "col-new-arrivals",
    name: "New Arrivals",
    slug: "new-arrivals",
    tagline: "The latest designs on the floor",
    description:
      "Fresh sets added to the catalogue this season, across organza, georgette and silk. Reserve early — new designs move quickly.",
    image: unsplashImage("1787020308815-cf964f915b2b", "Woman in a blue and pink patterned saree"),
    featured: true,
    order: 1,
  },
  {
    id: "col-festive",
    name: "Festive Collection",
    slug: "festive-collection",
    tagline: "Navratri, Diwali and wedding season",
    description:
      "Sequin, mirror and bandhani work in colours that sell through the festive calendar. Built for volume ordering.",
    image: unsplashImage("1774437897985-9a7f1b7867a8", "Woman in a colourful festive saree"),
    featured: true,
    order: 2,
  },
  {
    id: "col-premium-banarasi",
    name: "Premium Banarasi",
    slug: "premium-banarasi",
    tagline: "Katan and tanchoi from Varanasi",
    description:
      "Our top Banarasi weaves — pure katan silk, real zari and jaal pallus, sourced directly from weaving families in Varanasi.",
    image: unsplashImage("1641699862936-be9f49b1c38d", "Woman in a purple and gold Banarasi saree"),
    featured: true,
    order: 3,
  },
  {
    id: "col-silk",
    name: "Silk Collection",
    slug: "silk-collection",
    tagline: "Kanjivaram, Tussar and satin silks",
    description:
      "Structured silks for customers who buy once and keep for decades. Temple borders, korvai contrasts and handloom Tussar.",
    image: unsplashImage("1679006831648-7c9ea12e5807", "Woman in a green silk saree with jewellery"),
    featured: true,
    order: 4,
  },
  {
    id: "col-bridal",
    name: "Bridal Collection",
    slug: "bridal-collection",
    tagline: "Trousseau pieces, single unit orders",
    description:
      "Statement bridal sarees in heavy zari and zardozi handwork, supplied in presentation boxes and available as single pieces.",
    image: unsplashImage("1570212773364-e30cd076539e", "Bride wearing a wedding saree"),
    featured: true,
    order: 5,
  },
  {
    id: "col-daily-elegance",
    name: "Daily Elegance",
    slug: "daily-elegance",
    tagline: "Handloom cottons and light silks",
    description:
      "Everyday sarees with a refined finish — Chanderi, Jamdani, linen and printed chiffons for work and daytime wear.",
    image: unsplashImage("1774437561949-17b3bcf88db9", "Woman in a handloom cotton saree"),
    featured: true,
    order: 6,
  },
];
