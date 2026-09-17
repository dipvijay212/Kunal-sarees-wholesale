import { collections } from "@/data/collections";
import { products } from "@/data/products";
import type {
  CatalogueFilters,
  CatalogueSort,
  Collection,
  CollectionWithCount,
  Fabric,
  FilterOption,
  Occasion,
  Product,
} from "@/types";

/*
 * Data access layer. Every page reads catalogue data through these functions,
 * so swapping the mock arrays for an API or database later only touches this file.
 */

const productsById = new Map(products.map((product) => [product.id, product]));
const productsBySlug = new Map(products.map((product) => [product.slug, product]));

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return productsById.get(id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return productsBySlug.get(slug);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return products.filter((product) => product.collectionSlug === collectionSlug);
}

function byNewest(a: Product, b: Product): number {
  return b.addedOn.localeCompare(a.addedOn);
}

export function getNewArrivals(limit = 4): Product[] {
  return products
    .filter((product) => product.isNew)
    .sort(byNewest)
    .slice(0, limit);
}

export function getBestsellers(limit = 4): Product[] {
  return products.filter((product) => product.isBestseller).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCollection = products.filter(
    (candidate) => candidate.id !== product.id && candidate.collectionSlug === product.collectionSlug,
  );
  const sameFabric = products.filter(
    (candidate) =>
      candidate.id !== product.id &&
      candidate.collectionSlug !== product.collectionSlug &&
      candidate.fabric === product.fabric,
  );
  const others = products.filter(
    (candidate) => candidate.id !== product.id && !sameCollection.includes(candidate) && !sameFabric.includes(candidate),
  );

  return [...sameCollection, ...sameFabric, ...others].slice(0, limit);
}

export function getAllCollections(): CollectionWithCount[] {
  return collections.map((collection) => ({
    ...collection,
    productCount: getProductsByCollection(collection.slug).length,
  }));
}

export function getFeaturedCollections(limit = 4): CollectionWithCount[] {
  return getAllCollections()
    .filter((collection) => collection.isFeatured)
    .slice(0, limit);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* Catalogue filtering                                                        */
/* -------------------------------------------------------------------------- */

export const sortOptions: { value: CatalogueSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const sortValues = new Set<string>(sortOptions.map((option) => option.value));

function isSort(value: string | null): value is CatalogueSort {
  return value !== null && sortValues.has(value);
}

function countBy<T extends string>(values: T[]): FilterOption<T>[] {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getFabricOptions(source: Product[] = products): FilterOption<Fabric>[] {
  return countBy(source.map((product) => product.fabric));
}

export function getOccasionOptions(source: Product[] = products): FilterOption<Occasion>[] {
  return countBy(source.flatMap((product) => product.occasions));
}

export function getCollectionOptions(source: Product[] = products): FilterOption[] {
  return collections
    .map((collection) => ({
      value: collection.slug,
      label: collection.name,
      count: source.filter((product) => product.collectionSlug === collection.slug).length,
    }))
    .filter((option) => option.count > 0);
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

const MAX_QUERY_LENGTH = 80;

function normalizeText(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

const searchIndex = new Map(
  products.map((product) => [
    product.id,
    normalizeText(
      [
        product.name,
        product.sku,
        product.fabric,
        product.work,
        product.color.name,
        product.occasions.join(" "),
        getCollectionBySlug(product.collectionSlug)?.name ?? "",
      ].join(" "),
    ),
  ]),
);

function queryTokens(query: string): string[] {
  return normalizeText(query.slice(0, MAX_QUERY_LENGTH)).split(/\s+/).filter(Boolean);
}

/** True when every word of the query appears in the product's searchable text. */
export function matchesQuery(product: Product, query: string): boolean {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return true;
  const haystack = searchIndex.get(product.id) ?? "";
  return tokens.every((token) => haystack.includes(token));
}

export interface SearchResults {
  products: Product[];
  collections: Collection[];
  totalProducts: number;
}

export function searchCatalogue(query: string, limit = 6): SearchResults {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return { products: [], collections: [], totalProducts: 0 };

  const matchingProducts = products.filter((product) => matchesQuery(product, query));
  const matchingCollections = collections.filter((collection) => {
    const haystack = normalizeText(`${collection.name} ${collection.tagline}`);
    return tokens.every((token) => haystack.includes(token));
  });

  return {
    products: matchingProducts.slice(0, limit),
    collections: matchingCollections.slice(0, 3),
    totalProducts: matchingProducts.length,
  };
}

interface SearchParamsReader {
  get(name: string): string | null;
}

/** Reads filters from URL search params, ignoring unknown values. */
export function parseCatalogueFilters(params: SearchParamsReader): CatalogueFilters {
  const query = params.get("q")?.trim().slice(0, MAX_QUERY_LENGTH) ?? "";
  const collection = params.get("collection");
  const fabric = params.get("fabric");
  const occasion = params.get("occasion");
  const sort = params.get("sort");

  return {
    query: query || null,
    collection: collection && getCollectionBySlug(collection) ? collection : null,
    fabric: fabric && products.some((product) => product.fabric === fabric) ? (fabric as Fabric) : null,
    occasion:
      occasion && products.some((product) => product.occasions.includes(occasion as Occasion))
        ? (occasion as Occasion)
        : null,
    sort: isSort(sort) ? sort : "featured",
  };
}

export function filterProducts(source: Product[], filters: CatalogueFilters): Product[] {
  const filtered = source.filter(
    (product) =>
      (!filters.query || matchesQuery(product, filters.query)) &&
      (!filters.collection || product.collectionSlug === filters.collection) &&
      (!filters.fabric || product.fabric === filters.fabric) &&
      (!filters.occasion || product.occasions.includes(filters.occasion)),
  );

  switch (filters.sort) {
    case "newest":
      return [...filtered].sort(byNewest);
    case "price-asc":
      return [...filtered].sort((a, b) => a.pricing.pricePerPiece - b.pricing.pricePerPiece);
    case "price-desc":
      return [...filtered].sort((a, b) => b.pricing.pricePerPiece - a.pricing.pricePerPiece);
    default:
      return filtered;
  }
}
