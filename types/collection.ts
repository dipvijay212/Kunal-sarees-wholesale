import type { ProductImage } from "./product";

/** A curated edit of products, e.g. "Festive Collection". */
export interface Collection {
  id: string;
  name: string;
  name_en?: string;
  name_hi?: string;
  slug: string;
  tagline: string;
  description: string;
  description_en?: string;
  description_hi?: string;
  image: ProductImage;
  featured: boolean;
  order: number;
  productCount?: number;
}

export interface CollectionWithCount extends Collection {
  productCount: number;
}
