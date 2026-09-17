import type { Collection } from "@/types";

export const collections: Collection[] = [
  {
    slug: "banarasi-silk",
    name: "Banarasi Silk",
    tagline: "Katan and tanchoi weaves from Varanasi",
    description:
      "Pure katan and tanchoi silks woven on traditional looms in Varanasi. Dense zari, clean selvedges and a weight that drapes well — the dependable core of a festive and wedding assortment.",
    image: {
      src: "/images/collections/banarasi-silk.svg",
      alt: "Banarasi silk saree with gold zari pallu",
    },
    isFeatured: true,
  },
  {
    slug: "kanjivaram-weaves",
    name: "Kanjivaram Weaves",
    tagline: "Temple borders and korvai contrasts",
    description:
      "Mulberry silk Kanjivarams with interlocked korvai borders and temple motifs. Heavier, more structured sarees for customers who buy once and keep for decades.",
    image: {
      src: "/images/collections/kanjivaram-weaves.svg",
      alt: "Kanjivaram silk saree with contrast temple border",
    },
    isFeatured: true,
  },
  {
    slug: "organza-luxe",
    name: "Organza Luxe",
    tagline: "Sheer, light and quietly embellished",
    description:
      "Crisp organza in soft pastels with pearl, sequin and thread embroidery. Light enough for day functions, finished well enough for evening receptions.",
    image: {
      src: "/images/collections/organza-luxe.svg",
      alt: "Pastel organza saree with pearl embroidery",
    },
    isFeatured: true,
  },
  {
    slug: "georgette-chiffon",
    name: "Georgette & Chiffon",
    tagline: "Fluid party wear that moves fast",
    description:
      "Fluid georgettes and chiffons with sequin, mirror and ombre finishes. Easy to wear, easy to sell, and priced for steady repeat orders.",
    image: {
      src: "/images/collections/georgette-chiffon.svg",
      alt: "Black georgette saree with silver sequin work",
    },
    isFeatured: true,
  },
  {
    slug: "linen-cotton",
    name: "Linen & Cotton",
    tagline: "Handloom textures for everyday elegance",
    description:
      "Linen, Chanderi and Jamdani handlooms for workwear and daytime occasions. Breathable fabrics with a refined finish that suit year-round sales.",
    image: {
      src: "/images/collections/linen-cotton.svg",
      alt: "Indigo linen saree with hand block print",
    },
    isFeatured: false,
  },
  {
    slug: "bridal-couture",
    name: "Bridal Couture",
    tagline: "Heirloom pieces, available from a single unit",
    description:
      "Statement bridal sarees in heavy zari, tissue and zardozi handwork. Available as single pieces so boutiques can offer exclusivity without holding deep stock.",
    image: {
      src: "/images/collections/bridal-couture.svg",
      alt: "Red bridal Banarasi saree with dense gold zari",
    },
    isFeatured: true,
  },
];
