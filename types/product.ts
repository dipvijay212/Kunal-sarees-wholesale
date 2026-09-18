export type Fabric =
  | "Banarasi Silk"
  | "Kanjivaram Silk"
  | "Tussar Silk"
  | "Satin Silk"
  | "Tissue Silk"
  | "Chanderi Cotton Silk"
  | "Georgette"
  | "Chiffon"
  | "Organza"
  | "Cotton"
  | "Linen"
  | "Crepe";

/** The dominant work or weaving technique on the saree. */
export type DesignType =
  | "Zari Weave"
  | "Tanchoi Weave"
  | "Korvai Weave"
  | "Jamdani Weave"
  | "Temple Border"
  | "Hand Embroidery"
  | "Zardozi Handwork"
  | "Sequin Work"
  | "Mirror Work"
  | "Digital Print"
  | "Hand Block Print"
  | "Bandhani"
  | "Ombre Dye"
  | "Plain Solid";

/** Catalogue lifecycle. Only `active` products are listed on the storefront. */
export type ProductStatus = "active" | "draft" | "discontinued";

/** Derived from `stock`; never stored on the product itself. */
export type ProductAvailability = "in-stock" | "low-stock" | "out-of-stock";

export interface ProductColor {
  name: string;
  /** Swatch colour for the UI. */
  hex: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

/** A single colourway of a product, with its own stock and code. */
export interface ProductVariant {
  id: string;
  productId: string;
  /** Colour-specific code, e.g. KS-BNS-1001-WN. */
  variantCode: string;
  color: ProductColor;
  /** Pieces available in this colourway. */
  stock: number;
  /** Per-piece price override; falls back to `Product.price` when omitted. */
  price?: number;
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
  /** Design code used by the business when confirming orders. */
  productCode: string;
  name: string;
  slug: string;
  description: string;
  /** One line used on cards, search results and meta descriptions. */
  shortDescription: string;
  categoryId: string;
  collectionId: string;
  fabric: Fabric;
  design: DesignType;
  /** Wholesale price per piece in INR, excluding GST. */
  price: number;
  /** Minimum order quantity, in pieces. */
  moq: number;
  /** Quantities must be multiples of this many pieces (sets). */
  orderMultiple: number;
  /** Pieces available across all colourways. */
  stock: number;
  colors: ProductColor[];
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecifications;
  highlights: string[];
  featured: boolean;
  newArrival: boolean;
  status: ProductStatus;
  /** ISO date the design was added to the catalogue. */
  createdAt: string;
}
