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
  /** Optional admin override for the category page <title>; auto-generated when empty. */
  seoTitle?: string;
  /** Optional admin override for the category meta description; auto-generated when empty. */
  seoDescription?: string;
  featured: boolean;
  /** Display order in navigation and listings. */
  order: number;
}

export interface CategoryWithCount extends Category {
  productCount: number;
}
