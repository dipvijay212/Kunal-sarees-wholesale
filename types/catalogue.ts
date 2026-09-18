import type { Fabric, ProductAvailability } from "./product";

export type CatalogueSort = "featured" | "newest" | "price-asc" | "price-desc" | "name-asc";

export interface CatalogueFilters {
  /** Free-text search across name, product code, fabric, design and colours. */
  query: string | null;
  categoryId: string | null;
  collectionId: string | null;
  fabric: Fabric | null;
  color: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  availability: ProductAvailability | null;
  sort: CatalogueSort;
  page: number;
}

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  count: number;
}
