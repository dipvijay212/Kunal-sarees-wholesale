export type Fabric =
  | "Banarasi Silk"
  | "Kanjivaram Silk"
  | "Organza"
  | "Georgette"
  | "Chiffon"
  | "Linen"
  | "Chanderi Cotton Silk"
  | "Jamdani Cotton"
  | "Tissue Silk";

export type WorkType =
  | "Zari Weave"
  | "Tanchoi Weave"
  | "Korvai Weave"
  | "Hand Embroidery"
  | "Sequin Work"
  | "Mirror Work"
  | "Hand Block Print"
  | "Ombre Dye"
  | "Jamdani Weave"
  | "Zardozi Handwork";

export type Occasion = "Bridal" | "Wedding" | "Festive" | "Party" | "Workwear" | "Everyday Luxe";

export type StockStatus = "in-stock" | "low-stock" | "made-to-order";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface WholesalePricing {
  /** Wholesale price per piece in INR, exclusive of GST. */
  pricePerPiece: number;
  /** Smallest quantity a retailer can order for this design. */
  minimumOrderQuantity: number;
  /** Quantities must be multiples of this value (e.g. sold in sets of 4). */
  orderMultiple: number;
}

export interface ProductSpecifications {
  sareeLength: string;
  blousePiece: string;
  weight: string;
  washCare: string;
  origin: string;
}

export interface Product {
  id: string;
  slug: string;
  /** Design code used by the business when confirming orders. */
  sku: string;
  name: string;
  collectionSlug: string;
  fabric: Fabric;
  work: WorkType;
  occasions: Occasion[];
  color: ProductColor;
  description: string;
  highlights: string[];
  specifications: ProductSpecifications;
  images: ProductImage[];
  pricing: WholesalePricing;
  stockStatus: StockStatus;
  isNew: boolean;
  isBestseller: boolean;
  /** ISO date the design was added to the catalogue. */
  addedOn: string;
}
