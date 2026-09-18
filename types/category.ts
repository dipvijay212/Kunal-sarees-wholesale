import type { ProductImage } from "./product";

/** Fabric- or occasion-based grouping used for browsing and filtering. */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: ProductImage;
  featured: boolean;
  /** Display order in navigation and listings. */
  order: number;
}

export interface CategoryWithCount extends Category {
  productCount: number;
}
