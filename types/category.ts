import type { ProductImage } from "./product";

/** Fabric- or occasion-based grouping used for browsing and filtering. */
export interface Category {
  id: string;
  name: string;
  name_en?: string;
  name_hi?: string;
  slug: string;
  description: string;
  description_en?: string;
  description_hi?: string;
  image: ProductImage;
  featured: boolean;
  /** Display order in navigation and listings. */
  order: number;
}

export interface CategoryWithCount extends Category {
  productCount: number;
}
