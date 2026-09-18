import type { ProductImage } from "./product";

/** A curated edit of products, e.g. "Festive Collection". */
export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: ProductImage;
  featured: boolean;
  order: number;
}

export interface CollectionWithCount extends Collection {
  productCount: number;
}
