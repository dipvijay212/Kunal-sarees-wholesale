"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/FormField";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  FilterIcon,
  SearchIcon,
  SparkleIcon,
} from "@/components/ui/Icons";
import {
  filterProducts,
  getCategoryById,
  getCategoryOptions,
  getCollectionById,
  CATALOGUE_SEARCH_EVENT,
  parseCatalogueFilters,
} from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { CatalogueFilters, Category, Product } from "@/types";
import { ProductGrid } from "./ProductGrid";

const ITEMS_PER_PAGE = 12;

type RemovableFilterKey = "query" | "categoryId" | "collectionId" | "fabric" | "color" | "price" | "availability";

const urlParamFor: Record<string, string> = {
  query: "q",
  categoryId: "category",
  collectionId: "collection",
  fabric: "fabric",
  color: "color",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  availability: "availability",
  sort: "sort",
  page: "page",
};

interface PricePreset {
  key: string;
  min: number | null;
  max: number | null;
}

const PRICE_STEPS = [50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000];

/**
 * Price ranges built from the prices actually in the catalogue, so every range can contain
 * products. Splits at round numbers into at most five ranges that do not overlap.
 */
function buildPricePresets(products: Product[]): PricePreset[] {
  const prices = products.map((p) => p.price).filter((price) => Number.isFinite(price) && price > 0);
  if (prices.length === 0) return [];
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);

  for (const step of PRICE_STEPS) {
    const cuts: number[] = [];
    for (let cut = (Math.floor(lowest / step) + 1) * step; cut <= highest; cut += step) cuts.push(cut);
    if (cuts.length > 4) continue;
    if (cuts.length === 0) return [];
    return [
      { key: `under-${cuts[0]}`, min: null, max: cuts[0] - 1 },
      ...cuts.slice(0, -1).map((cut, i) => ({ key: `from-${cut}`, min: cut, max: cuts[i + 1] - 1 })),
      { key: `above-${cuts[cuts.length - 1]}`, min: cuts[cuts.length - 1], max: null },
    ];
  }
  return [];
}

function formatSareeTypeLabel(name: string): string {
  return name.replace(/\s+Sarees$/i, "").trim();
}

interface CatalogueBrowserProps {
  products: Product[];
  /** Categories from the API; the client-side category store is empty on the storefront. */
  categories?: Category[];
  /** Optional override title or pre-filtered collection context (used on /collections/[slug]) */
  defaultCollectionId?: string;
}

export function CatalogueBrowser({ products, categories, defaultCollectionId }: CatalogueBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t, getLocalized, language } = useLanguage();

  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filters = parseCatalogueFilters(searchParams, categories);
  const findCategory = (id: string) => categories?.find((category) => category.id === id) ?? getCategoryById(id);

  // If component is configured with a defaultCollectionId (e.g. inside /collections/[slug])
  const activeCollectionId = defaultCollectionId ?? filters.collectionId;
  const effectiveFilters: CatalogueFilters = {
    ...filters,
    collectionId: activeCollectionId,
    // Fabric, colour and availability filters were removed from the UI; ignore them in old links.
    fabric: null,
    color: null,
    availability: null,
  };

  const results = filterProducts(products, effectiveFilters, categories);

  // Derived options from product pool
  const categoryOptions = getCategoryOptions(products, categories);

  const pricePresets = useMemo(() => buildPricePresets(products), [products]);
  const pricePresetLabel = (preset: PricePreset): string => {
    if (preset.min === null) {
      const limit = formatPrice((preset.max ?? 0) + 1);
      return language === "en" ? `Under ${limit}` : `${limit} से कम`;
    }
    if (preset.max === null) {
      return language === "en" ? `${formatPrice(preset.min)} & above` : `${formatPrice(preset.min)} या ज्यादा`;
    }
    return `${formatPrice(preset.min)} – ${formatPrice(preset.max)}`;
  };

  const sortOptionsList = [
    { value: "newest", label: t.filters.sortOptions.newest },
    { value: "featured", label: t.filters.sortOptions.featured },
    { value: "price-asc", label: t.filters.sortOptions.priceAsc },
    { value: "price-desc", label: t.filters.sortOptions.priceDesc },
    { value: "name-asc", label: t.filters.sortOptions.nameAsc },
  ];

  // Pagination calculations
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(filters.page, totalPages);
  const paginatedResults = results.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (key === "sort" && value === "newest") ||
        (key === "page" && value === 1)
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  /** Pagination buttons: change page and return to the top, so the new page isn't opened at its end. */
  const goToPage = (page: number) => {
    updateParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // The box keeps exactly what is typed (including a trailing space between words);
  // the URL and the search itself use the trimmed text. Clearing actions reset it below.
  const [searchText, setSearchText] = useState(filters.query ?? "");
  useEffect(() => {
    const onExternalSearch = (event: Event) => setSearchText((event as CustomEvent<string>).detail);
    window.addEventListener(CATALOGUE_SEARCH_EVENT, onExternalSearch);
    return () => window.removeEventListener(CATALOGUE_SEARCH_EVENT, onExternalSearch);
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchText(query);
    updateParams({ q: query.trim() || null, page: 1 });
  };

  const clearAllFilters = () => {
    setSearchText("");
    updateParams({
      q: null,
      category: null,
      collection: null,
      fabric: null,
      color: null,
      minPrice: null,
      maxPrice: null,
      availability: null,
      page: 1,
    });
  };

  const removeFilter = (key: RemovableFilterKey) => {
    if (key === "query") setSearchText("");
    if (key === "price") {
      updateParams({ minPrice: null, maxPrice: null, page: 1 });
    } else {
      updateParams({ [urlParamFor[key]]: null, page: 1 });
    }
  };

  // Build list of active filter tags
  const activeFilters: { key: RemovableFilterKey; label: string }[] = [];
  if (effectiveFilters.query) activeFilters.push({ key: "query", label: `${t.search.title}: “${effectiveFilters.query}”` });
  if (effectiveFilters.categoryId) {
    const rawCategory = findCategory(effectiveFilters.categoryId);
    const catDisplayName = rawCategory ? (getLocalized(rawCategory, "name") || rawCategory.name) : effectiveFilters.categoryId;
    activeFilters.push({
      key: "categoryId",
      label: `${t.filters.category}: ${formatSareeTypeLabel(catDisplayName)}`,
    });
  }
  if (!defaultCollectionId && effectiveFilters.collectionId) {
    const rawCollection = getCollectionById(effectiveFilters.collectionId);
    const colDisplayName = rawCollection ? (getLocalized(rawCollection, "name") || rawCollection.name) : effectiveFilters.collectionId;
    activeFilters.push({
      key: "collectionId",
      label: `${t.nav.categories}: ${colDisplayName}`,
    });
  }
  if (effectiveFilters.minPrice !== null || effectiveFilters.maxPrice !== null) {
    const activePreset = pricePresets.find(
      (p) => p.min === effectiveFilters.minPrice && p.max === effectiveFilters.maxPrice,
    );
    if (activePreset) {
      activeFilters.push({ key: "price", label: `${t.filters.price}: ${pricePresetLabel(activePreset)}` });
    } else {
      const min = effectiveFilters.minPrice !== null ? formatPrice(effectiveFilters.minPrice) : "₹0";
      const max = effectiveFilters.maxPrice !== null ? formatPrice(effectiveFilters.maxPrice) : (language === "en" ? "Max" : "अधिकतम");
      activeFilters.push({ key: "price", label: `${t.filters.price}: ${min} – ${max}` });
    }
  }
  /* -------------------------------------------------------------------------- */
  /* Sidebar Filter Sections: Saree Type & Price                                */
  /* -------------------------------------------------------------------------- */

  const renderSareeTypeFilter = () => (
    <div className="border-b border-line pb-5">
      <h3 className="type-eyebrow text-gold-accent font-semibold tracking-[0.12em] uppercase text-[0.6875rem] mb-3">
        {t.filters.category}
      </h3>
      <ul className="flex flex-col space-y-1" role="radiogroup" aria-label={t.filters.category}>
        <li>
          <button
            type="button"
            role="radio"
            aria-checked={!effectiveFilters.categoryId}
            onClick={() => updateParams({ category: null, page: 1 })}
            className={cn(
              "group flex items-center gap-2.5 w-full py-1 text-left text-sm transition-colors",
              !effectiveFilters.categoryId ? "font-semibold text-maroon" : "text-muted hover:text-ink",
            )}
          >
            <span
              className={cn(
                "size-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                !effectiveFilters.categoryId
                  ? "border-maroon bg-maroon"
                  : "border-line-strong group-hover:border-maroon/60",
              )}
            >
              {!effectiveFilters.categoryId && <span className="size-1.5 rounded-full bg-white" />}
            </span>
            <span>{t.products.allProductsTitle}</span>
          </button>
        </li>
        {categoryOptions.map((option) => {
          const category = findCategory(option.value);
          const isSelected = effectiveFilters.categoryId === option.value;
          const displayLabel = category ? formatSareeTypeLabel(getLocalized(category, "name") || category.name) : formatSareeTypeLabel(option.label);
          return (
            <li key={option.value}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateParams({ category: isSelected ? null : (category?.slug ?? option.value), page: 1 })}
                className={cn(
                  "group flex items-center gap-2.5 w-full py-1 text-left text-sm transition-colors",
                  isSelected ? "font-semibold text-maroon" : "text-muted hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "size-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "border-maroon bg-maroon" : "border-line-strong group-hover:border-maroon/60",
                  )}
                >
                  {isSelected && <span className="size-1.5 rounded-full bg-white" />}
                </span>
                <span className="truncate">{displayLabel}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const renderPriceFilter = () => {
    const isAllPrices = effectiveFilters.minPrice === null && effectiveFilters.maxPrice === null;
    // Nothing to choose between when every saree costs about the same.
    if (pricePresets.length === 0 && isAllPrices) return null;
    return (
      <div className="py-5">
        <h3 className="type-eyebrow text-gold-accent font-semibold tracking-[0.12em] uppercase text-[0.6875rem] mb-3">
          {t.filters.price}
        </h3>
        <ul className="flex flex-col space-y-1" role="radiogroup" aria-label={t.filters.price}>
          <li>
            <button
              type="button"
              role="radio"
              aria-checked={isAllPrices}
              onClick={() => updateParams({ minPrice: null, maxPrice: null, page: 1 })}
              className={cn(
                "group flex items-center gap-2.5 w-full py-1 text-left text-sm transition-colors",
                isAllPrices ? "font-semibold text-maroon" : "text-muted hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "size-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                  isAllPrices ? "border-maroon bg-maroon" : "border-line-strong group-hover:border-maroon/60",
                )}
              >
                {isAllPrices && <span className="size-1.5 rounded-full bg-white" />}
              </span>
              <span>{language === "en" ? "All Prices" : "सभी कीमतें"}</span>
            </button>
          </li>
          {pricePresets.map((preset) => {
            const isSelected =
              effectiveFilters.minPrice === preset.min && effectiveFilters.maxPrice === preset.max;
            const presetLabel = pricePresetLabel(preset);
            return (
              <li key={preset.key}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() =>
                    updateParams({
                      minPrice: isSelected ? null : preset.min,
                      maxPrice: isSelected ? null : preset.max,
                      page: 1,
                    })
                  }
                  className={cn(
                    "group flex items-center gap-2.5 w-full py-1 text-left text-sm transition-colors",
                    isSelected ? "font-semibold text-maroon" : "text-muted hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "size-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "border-maroon bg-maroon" : "border-line-strong group-hover:border-maroon/60",
                    )}
                  >
                    {isSelected && <span className="size-1.5 rounded-full bg-white" />}
                  </span>
                  <span>{presetLabel}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  /* -------------------------------------------------------------------------- */
  /* "More Filters" Inner Content (Fabric, Color Swatches, Availability)         */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /* Main Render                                                                */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Top Search Bar */}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-muted">
          <SearchIcon size={19} />
        </div>
        <Input
          type="text"
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t.search.placeholder}
          className="h-12 w-full rounded-xs border-line bg-canvas pl-11 pr-10 text-sm shadow-2xs placeholder:text-muted focus:border-maroon"
        />
        {searchText ? (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="absolute right-3.5 p-1 text-muted hover:text-ink transition-colors"
            aria-label={t.search.clear}
          >
            <CloseIcon size={16} />
          </button>
        ) : null}
      </div>

      {/* Main Layout: Left Sidebar + Product Catalogue */}
      <div className="grid gap-8 lg:grid-cols-[15.5rem_1fr] lg:gap-10">
        {/* Desktop Left Filter Sidebar */}
        <aside aria-label={t.filters.filterBtn} className="hidden lg:block">
          <div className="sticky top-24 rounded-xs border border-line bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-ink">{t.filters.filterBtn}</h2>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-muted hover:text-maroon underline underline-offset-4 transition-colors"
                >
                  {t.filters.clearAll}
                </button>
              )}
            </div>

            {/* Saree Type Filter (Clean single section) */}
            {renderSareeTypeFilter()}

            {/* Price Filter */}
            {renderPriceFilter()}

            {/* More Filters Trigger */}
            <div className="pt-4 border-t border-line flex flex-col gap-2">
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-muted hover:text-maroon underline underline-offset-4 py-1 text-center"
                >
                  {t.filters.clearAll}
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Main Column: Header, Active Filter Chips, Grid, Pagination */}
        <div className="min-w-0 flex-1">
          {/* Catalogue Toolbar */}
          <div className="flex flex-col gap-3.5 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted" aria-live="polite">
                {totalItems > 0 ? (
                  <>
                    <span className="font-semibold text-ink">{totalItems}</span> {language === "en" ? "results · showing" : "में से"}{" "}
                    <span className="font-semibold text-ink">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                      {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                    </span>{" "}
                    {t.products.pieces}
                  </>
                ) : (
                  (language === "en" ? "0 sarees found" : "0 साड़ियां मिलीं")
                )}
              </p>
            </div>

            <div className="flex w-full items-center gap-2.5 sm:w-auto">
              {/* Mobile Filter Trigger */}
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 shrink-0 font-medium sm:flex-none lg:hidden"
                onClick={() => setMobileFilterOpen(true)}
                leadingIcon={<FilterIcon size={16} />}
                aria-haspopup="dialog"
              >
                {t.filters.filterBtn}{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
              </Button>

              {/* Sort Dropdown */}
              <div className="flex flex-1 items-center gap-2 sm:flex-none">
                <label htmlFor="catalogue-sort" className="sr-only sm:not-sr-only text-xs font-medium text-muted whitespace-nowrap">
                  {t.filters.sortBy}
                </label>
                <Select
                  id="catalogue-sort"
                  value={effectiveFilters.sort}
                  onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                  className="min-h-9 w-full py-1.5 text-xs sm:w-44 sm:text-sm"
                >
                  {sortOptionsList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label={t.filters.activeFilters}>
              <span className="text-xs font-medium text-muted mr-1">{t.filters.activeFilters}</span>
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => removeFilter(filter.key)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-gold/40 bg-accent-soft text-maroon text-xs font-medium hover:border-maroon transition-colors"
                  aria-label={`${t.buttons.remove}: ${filter.label}`}
                >
                  <span>{filter.label}</span>
                  <CloseIcon size={13} className="shrink-0 text-maroon/70 hover:text-maroon" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-2 text-xs font-medium text-maroon underline underline-offset-2 hover:text-maroon-dark transition-colors"
              >
                {t.filters.clearAll}
              </button>
            </div>
          )}

          {/* Product Grid / Empty State */}
          <div className={cn("mt-6 transition-opacity duration-200", isPending && "opacity-60")}>
            {paginatedResults.length > 0 ? (
              <>
                <ProductGrid
                  products={paginatedResults}
                  eagerCount={4}
                />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-12 flex flex-col items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between"
                  >
                    <p className="text-xs text-muted">
                      {language === "en" ? "Page" : "पेज"}{" "}
                      <span className="font-semibold text-ink">{currentPage}</span> of{" "}
                      <span className="font-semibold text-ink">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => goToPage(currentPage - 1)}
                        leadingIcon={<ChevronLeftIcon size={16} />}
                      >
                        {language === "en" ? "Previous" : "पिछला"}
                      </Button>
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => goToPage(pageNum)}
                            className={cn(
                              "size-8 rounded-xs text-xs font-semibold transition-colors",
                              pageNum === currentPage
                                ? "bg-maroon text-white"
                                : "text-muted hover:bg-surface hover:text-ink",
                            )}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                        trailingIcon={<ChevronRightIcon size={16} />}
                      >
                        {language === "en" ? "Next" : "अगला"}
                      </Button>
                    </div>
                  </nav>
                )}
              </>
            ) : (
              <EmptyState
                icon={<SparkleIcon size={26} />}
                title={t.products.noProductsFound}
                description={t.products.noProductsDesc}
                action={<Button onClick={clearAllFilters}>{t.filters.clearAll}</Button>}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer (Complete Experience) */}
      <Drawer
        open={isMobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title={t.filters.filterBtn}
        side="right"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={clearAllFilters}
              disabled={activeFilters.length === 0}
            >
              {t.filters.clearAll}
            </Button>
            <Button className="flex-1" onClick={() => setMobileFilterOpen(false)}>
              {t.buttons.explore} ({totalItems} {t.products.pieces})
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5 pb-6">
          {renderSareeTypeFilter()}
          {renderPriceFilter()}
        </div>
      </Drawer>
    </div>
  );
}
