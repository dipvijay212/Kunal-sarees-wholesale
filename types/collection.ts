import type { ProductImage } from "./product";

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: ProductImage;
  isFeatured: boolean;
}

export interface CollectionWithCount extends Collection {
  productCount: number;
}
