import type { Category } from "@/types";
import { LANDSCAPE, unsplashImage } from "./images";

/** Fabric and occasion categories used for browsing and filtering. */
export const categories: Category[] = [
  {
    id: "cat-silk",
    name: "Silk Sarees",
    slug: "silk-sarees",
    description:
      "Pure silk weaves with structure and sheen — Kanjivaram, Tussar and satin silks that hold their drape and sell year after year.",
    image: unsplashImage("1619043518800-7f14be467dca", "Folds of lustrous silk fabric", LANDSCAPE),
    featured: true,
    order: 1,
  },
  {
    id: "cat-banarasi",
    name: "Banarasi Sarees",
    slug: "banarasi-sarees",
    description:
      "Katan and tanchoi silks woven in Varanasi, with dense zari work and clean selvedges. The dependable core of a festive assortment.",
    image: unsplashImage("1771074153149-6b32d0b420bc", "Golden woven fabric with a floral zari pattern", LANDSCAPE),
    featured: true,
    order: 2,
  },
  {
    id: "cat-georgette",
    name: "Georgette Sarees",
    slug: "georgette-sarees",
    description:
      "Fluid georgettes that move well and travel light. Easy to wear, easy to sell and priced for steady repeat orders.",
    image: unsplashImage("1617055407123-3d7130c1f940", "Close-up of soft pink georgette fabric", LANDSCAPE),
    featured: true,
    order: 3,
  },
  {
    id: "cat-cotton",
    name: "Cotton Sarees",
    slug: "cotton-sarees",
    description:
      "Breathable handloom cottons, Chanderi and Jamdani weaves for daily wear, office wear and daytime functions.",
    image: unsplashImage("1615799998603-7c6270a45196", "Plain woven cotton textile texture", LANDSCAPE),
    featured: true,
    order: 4,
  },
  {
    id: "cat-organza",
    name: "Organza Sarees",
    slug: "organza-sarees",
    description:
      "Crisp, sheer organza in soft pastels with pearl, sequin and thread work. Light on the shoulder, strong on the shelf.",
    image: unsplashImage("1770199105820-2e12ecee91a1", "Sheer organza fabric held to the light", LANDSCAPE),
    featured: true,
    order: 5,
  },
  {
    id: "cat-chiffon",
    name: "Chiffon Sarees",
    slug: "chiffon-sarees",
    description:
      "Featherlight chiffons and crepes with soft dyes and fine borders, for customers who want comfort without losing polish.",
    image: unsplashImage("1606259457945-67dc66271ee6", "Soft folds of cream chiffon fabric", LANDSCAPE),
    featured: false,
    order: 6,
  },
  {
    id: "cat-printed",
    name: "Printed Sarees",
    slug: "printed-sarees",
    description:
      "Digital prints, bandhani and hand block work in repeatable designs — the fastest-moving shelf in most stores.",
    image: unsplashImage("1545418743-1f9f98ff0e3f", "Floral printed textile", LANDSCAPE),
    featured: false,
    order: 7,
  },
  {
    id: "cat-embroidered",
    name: "Embroidered Sarees",
    slug: "embroidered-sarees",
    description:
      "Hand embroidery, zardozi, cutdana and thread work on silk, satin and tissue bases for weddings and receptions.",
    image: unsplashImage("1763400126795-d83e07d3449e", "Silk fabric with fine hand embroidery", LANDSCAPE),
    featured: true,
    order: 8,
  },
  {
    id: "cat-party-wear",
    name: "Party Wear",
    slug: "party-wear",
    description:
      "Shimmer satins, ruffles, sequins and metallic tissues for evening functions, sangeet nights and receptions.",
    image: unsplashImage("1600312914724-0c318dd0eb29", "Woman in a red and gold party saree", LANDSCAPE),
    featured: true,
    order: 9,
  },
  {
    id: "cat-bridal",
    name: "Bridal Sarees",
    slug: "bridal-sarees",
    description:
      "Heirloom bridal pieces in heavy zari, tissue and zardozi handwork, available from a single unit so you can offer exclusivity.",
    image: unsplashImage("1737515016964-5907f6317531", "Bride in a red saree with gold jewellery", LANDSCAPE),
    featured: true,
    order: 10,
  },
];
