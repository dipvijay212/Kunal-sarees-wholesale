import { banners } from "@/data/banners";
import {
  productRepository,
  categoryRepository,
  collectionRepository,
  settingsRepository,
} from "@/lib/repositories";
import type {
  Banner,
  BannerPlacement,
  CatalogueFilters,
  CatalogueSort,
  Category,
  CategoryWithCount,
  Collection,
  CollectionWithCount,
  Fabric,
  FilterOption,
  Product,
  ProductAvailability,
} from "@/types";

/*
 * Catalogue query layer backed by clean Repository abstractions.
 * Dynamically queries localStorage client-side and returns SSR static fallbacks on the server.
 */

const MAX_QUERY_LENGTH = 80;

interface GetProductsOptions {
  /** Include draft and discontinued designs (for admin views). Default false. */
  includeInactive?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

/** All products available to the storefront, in catalogue order. */
export function getProducts({ includeInactive = false }: GetProductsOptions = {}): Product[] {
  return productRepository.getAll({ includeInactive });
}

export function getProductById(id: string, options?: GetProductsOptions): Product | undefined {
  return productRepository.getById(id, options);
}

export function getProductBySlug(slug: string, options?: GetProductsOptions): Product | undefined {
  return productRepository.getBySlug(slug, options);
}

/** Accepts a category id (`cat-silk`) or slug (`silk-sarees`). */
export function getProductsByCategory(categoryIdOrSlug: string, options?: GetProductsOptions): Product[] {
  const category = getCategoryById(categoryIdOrSlug) ?? getCategoryBySlug(categoryIdOrSlug);
  if (!category) return [];
  return getProducts(options).filter((product) => product.categoryId === category.id);
}

/** Accepts a collection id (`col-silk`) or slug (`silk-collection`). */
export function getProductsByCollection(collectionIdOrSlug: string, options?: GetProductsOptions): Product[] {
  const collection = getCollectionById(collectionIdOrSlug) ?? getCollectionBySlug(collectionIdOrSlug);
  if (!collection) return [];
  return getProducts(options).filter((product) => product.collectionId === collection.id);
}

function byNewest(a: Product, b: Product): number {
  return b.createdAt.localeCompare(a.createdAt);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return getProducts().filter((product) => product.featured).slice(0, limit);
}

export function getNewArrivals(limit = 4): Product[] {
  return getProducts()
    .filter((product) => product.newArrival)
    .sort(byNewest)
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const activeProducts = getProducts();
  const candidates = activeProducts.filter((candidate) => candidate.id !== product.id);
  const sameCollection = candidates.filter((candidate) => candidate.collectionId === product.collectionId);
  const sameCategory = candidates.filter(
    (candidate) => candidate.collectionId !== product.collectionId && candidate.categoryId === product.categoryId,
  );
  const sameFabric = candidates.filter(
    (candidate) =>
      candidate.collectionId !== product.collectionId &&
      candidate.categoryId !== product.categoryId &&
      candidate.fabric === product.fabric,
  );

  const ordered = [...sameCollection, ...sameCategory, ...sameFabric, ...candidates];
  return [...new Set(ordered)].slice(0, limit);
}

/** `in-stock`, `low-stock` or `out-of-stock`, derived from the stock count. */
export function getAvailability(product: Product): ProductAvailability {
  const settings = settingsRepository.get();
  if (product.stock <= 0) return "out-of-stock";
  const lowStockThreshold = settings.wholesale?.lowStockThreshold ?? 12;
  return product.stock <= lowStockThreshold ? "low-stock" : "in-stock";
}

/* -------------------------------------------------------------------------- */
/* Categories and collections                                                 */
/* -------------------------------------------------------------------------- */

function countProducts(predicate: (product: Product) => boolean): number {
  return getProducts().filter(predicate).length;
}

export function getCategories(): CategoryWithCount[] {
  return categoryRepository
    .getAll()
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      ...category,
      productCount: countProducts((product) => product.categoryId === category.id),
    }));
}

export function getFeaturedCategories(limit = 6): CategoryWithCount[] {
  return getCategories()
    .filter((category) => category.featured)
    .slice(0, limit);
}

export function getCategoryById(id: string): Category | undefined {
  return categoryRepository.getById(id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryRepository.getBySlug(slug);
}

export function getCollections(): CollectionWithCount[] {
  return collectionRepository
    .getAll()
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((collection) => ({
      ...collection,
      productCount: countProducts((product) => product.collectionId === collection.id),
    }));
}

export function getFeaturedCollections(limit = 4): CollectionWithCount[] {
  return getCollections()
    .filter((collection) => collection.featured)
    .slice(0, limit);
}

export function getCollectionById(id: string): Collection | undefined {
  return collectionRepository.getById(id);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collectionRepository.getBySlug(slug);
}

/* -------------------------------------------------------------------------- */
/* Banners                                                                    */
/* -------------------------------------------------------------------------- */

/** Highest-priority active banner for a placement. */
export function getBanner(placement: BannerPlacement): Banner | undefined {
  return banners
    .filter((banner) => banner.active && banner.placement === placement)
    .sort((a, b) => a.priority - b.priority)[0];
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

function queryTokens(query: string): string[] {
  return normalizeText(query.slice(0, MAX_QUERY_LENGTH)).split(/\s+/).filter(Boolean);
}

/** True when every word of the query appears in the product's searchable text. */
export function matchesQuery(product: Product, query: string): boolean {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return true;
  const searchableText = normalizeText(
    [
      product.name,
      product.productCode,
      product.fabric,
      product.design,
      product.shortDescription,
      product.colors.map((color) => color.name).join(" "),
      getCategoryById(product.categoryId)?.name ?? "",
      getCollectionById(product.collectionId)?.name ?? "",
    ].join(" "),
  );
  return tokens.every((token) => searchableText.includes(token));
}

/** Products matching a free-text query, across name, code, fabric, design and colours. */
export function searchProducts(query: string, limit?: number): Product[] {
  if (queryTokens(query).length === 0) return [];
  const results = getProducts().filter((product) => matchesQuery(product, query));
  return limit ? results.slice(0, limit) : results;
}

export interface SearchResults {
  products: Product[];
  collections: Collection[];
  categories: Category[];
  totalProducts: number;
}

/** Grouped results for the header search dialog. */
export function searchCatalogue(query: string, limit = 6): SearchResults {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return { products: [], collections: [], categories: [], totalProducts: 0 };

  const matchingProducts = searchProducts(query);
  const matches = (text: string) => tokens.every((token) => normalizeText(text).includes(token));

  return {
    products: matchingProducts.slice(0, limit),
    collections: collectionRepository.getAll().filter((collection) => matches(`${collection.name} ${collection.tagline}`)).slice(0, 3),
    categories: categoryRepository.getAll().filter((category) => matches(category.name)).slice(0, 3),
    totalProducts: matchingProducts.length,
  };
}

/* -------------------------------------------------------------------------- */
/* Filtering                                                                  */
/* -------------------------------------------------------------------------- */

export const sortOptions: { value: CatalogueSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name A-Z" },
];

const sortValues = new Set<string>(sortOptions.map((option) => option.value));

function isSort(value: string | null): value is CatalogueSort {
  return value !== null && sortValues.has(value);
}

export function getFabricOptions(source: Product[] = getProducts()): FilterOption<Fabric>[] {
  const counts = new Map<Fabric, number>();
  for (const product of source) counts.set(product.fabric, (counts.get(product.fabric) ?? 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getCategoryOptions(source: Product[] = getProducts()): FilterOption[] {
  return getCategories()
    .map((category) => ({
      value: category.id,
      label: category.name,
      count: source.filter((product) => product.categoryId === category.id).length,
    }))
    .filter((option) => option.count > 0);
}

export function getCollectionOptions(source: Product[] = getProducts()): FilterOption[] {
  return getCollections()
    .map((collection) => ({
      value: collection.id,
      label: collection.name,
      count: source.filter((product) => product.collectionId === collection.id).length,
    }))
    .filter((option) => option.count > 0);
}

export interface ColorFilterOption extends FilterOption {
  hex: string;
}

export function getColorOptions(source: Product[] = getProducts()): ColorFilterOption[] {
  const colorMap = new Map<string, { count: number; hex: string }>();
  for (const product of source) {
    for (const color of product.colors) {
      const existing = colorMap.get(color.name);
      if (existing) {
        existing.count += 1;
      } else {
        colorMap.set(color.name, { count: 1, hex: color.hex });
      }
    }
  }
  return [...colorMap.entries()]
    .map(([value, { count, hex }]) => ({ value, label: value, count, hex }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getAvailabilityOptions(source: Product[] = getProducts()): FilterOption<ProductAvailability>[] {
  const counts: Record<ProductAvailability, number> = {
    "in-stock": 0,
    "low-stock": 0,
    "out-of-stock": 0,
  };
  for (const product of source) {
    const status = getAvailability(product);
    counts[status] += 1;
  }
  const labels: Record<ProductAvailability, string> = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Made to Order",
  };
  return (["in-stock", "low-stock", "out-of-stock"] as ProductAvailability[])
    .map((value) => ({ value, label: labels[value], count: counts[value] }))
    .filter((option) => option.count > 0);
}

interface SearchParamsReader {
  get(name: string): string | null;
}

/**
 * Reads catalogue filters from URL search params, ignoring unknown values.
 * Category and collection accept either an id or a slug in the URL.
 */
export function parseCatalogueFilters(params: SearchParamsReader): CatalogueFilters {
  const query = params.get("q")?.trim().slice(0, MAX_QUERY_LENGTH) ?? "";
  const categoryParam = params.get("category");
  const collectionParam = params.get("collection");
  const fabric = params.get("fabric");
  const color = params.get("color");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const availability = params.get("availability");
  const sort = params.get("sort");
  const pageParam = params.get("page");

  const category = categoryParam
    ? (getCategoryById(categoryParam) ?? getCategoryBySlug(categoryParam))
    : undefined;
  const collection = collectionParam
    ? (getCollectionById(collectionParam) ?? getCollectionBySlug(collectionParam))
    : undefined;

  const validAvailability: ProductAvailability | null =
    availability === "in-stock" || availability === "low-stock" || availability === "out-of-stock"
      ? availability
      : null;

  const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const allProds = getProducts();

  return {
    query: query || null,
    categoryId: category?.id ?? null,
    collectionId: collection?.id ?? null,
    fabric: fabric && allProds.some((product) => product.fabric === fabric) ? (fabric as Fabric) : null,
    color: color || null,
    minPrice: minPrice && !isNaN(Number(minPrice)) ? Number(minPrice) : null,
    maxPrice: maxPrice && !isNaN(Number(maxPrice)) ? Number(maxPrice) : null,
    availability: validAvailability,
    sort: isSort(sort) ? sort : "featured",
    page,
  };
}

export function filterProducts(source: Product[], filters: CatalogueFilters): Product[] {
  const filtered = source.filter((product) => {
    if (filters.query && !matchesQuery(product, filters.query)) return false;
    if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
    if (filters.collectionId && product.collectionId !== filters.collectionId) return false;
    if (filters.fabric && product.fabric !== filters.fabric) return false;
    if (filters.color && !product.colors.some((c) => c.name.toLowerCase() === filters.color?.toLowerCase()))
      return false;
    if (filters.minPrice !== null && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;
    if (filters.availability && getAvailability(product) !== filters.availability) return false;
    return true;
  });

  switch (filters.sort) {
    case "newest":
      return [...filtered].sort(byNewest);
    case "price-asc":
      return [...filtered].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...filtered].sort((a, b) => b.price - a.price);
    case "name-asc":
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}
