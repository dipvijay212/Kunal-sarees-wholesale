import type { Fabric, Occasion } from "./product";

export type CatalogueSort = "featured" | "newest" | "price-asc" | "price-desc";

export interface CatalogueFilters {
  /** Free-text search across name, design code, fabric, work and colour. */
  query: string | null;
  collection: string | null;
  fabric: Fabric | null;
  occasion: Occasion | null;
  sort: CatalogueSort;
}

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  count: number;
}
