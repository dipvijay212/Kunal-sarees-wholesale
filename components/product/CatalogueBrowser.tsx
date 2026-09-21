"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  FilterIcon,
  SearchIcon,
  SparkleIcon,
} from "@/components/ui/Icons";
import {
  filterProducts,
  getAvailabilityOptions,
  getCategoryById,
  getCategoryOptions,
  getCollectionById,
  getColorOptions,
  getFabricOptions,
  parseCatalogueFilters,
  sortOptions,
} from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { CatalogueFilters, Product } from "@/types";
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
  label: string;
  min: number | null;
  max: number | null;
}

const PRICE_PRESETS: PricePreset[] = [
  { label: "Under ₹2,500", min: null, max: 2500 },
  { label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "Above ₹10,000", min: 10000, max: null },
];

function formatSareeTypeLabel(name: string): string {
  return name.replace(/\s+Sarees$/i, "").trim();
}

interface CatalogueBrowserProps {
  products: Product[];
  /** Optional override title or pre-filtered collection context (used on /collections/[slug]) */
  defaultCollectionId?: string;
}

export function CatalogueBrowser({ products, defaultCollectionId }: CatalogueBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isMoreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);

  const filters = parseCatalogueFilters(searchParams);

  // If component is configured with a defaultCollectionId (e.g. inside /collections/[slug])
  const activeCollectionId = defaultCollectionId ?? filters.collectionId;
  const effectiveFilters: CatalogueFilters = {
    ...filters,
    collectionId: activeCollectionId,
  };

  const results = filterProducts(products, effectiveFilters);

  // Derived options from product pool
  const categoryOptions = getCategoryOptions(products);
  const fabricOptions = getFabricOptions(products);
  const colorOptions = getColorOptions(products);
  const availabilityOptions = getAvailabilityOptions(products);

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
        (key === "sort" && value === "featured") ||
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

  const handleSearchChange = (query: string) => {
    updateParams({ q: query || null, page: 1 });
  };

  const clearAllFilters = () => {
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

  const clearMoreFilters = () => {
    updateParams({
      fabric: null,
      color: null,
      availability: null,
      page: 1,
    });
  };

  const removeFilter = (key: RemovableFilterKey) => {
    if (key === "price") {
      updateParams({ minPrice: null, maxPrice: null, page: 1 });
    } else {
      updateParams({ [urlParamFor[key]]: null, page: 1 });
    }
  };

  // Build list of active filter tags
  const activeFilters: { key: RemovableFilterKey; label: string }[] = [];
  if (effectiveFilters.query) activeFilters.push({ key: "query", label: `Search: “${effectiveFilters.query}”` });
  if (effectiveFilters.categoryId) {
    const rawCategory = getCategoryById(effectiveFilters.categoryId)?.name ?? effectiveFilters.categoryId;
    activeFilters.push({
      key: "categoryId",
      label: `Saree Type: ${formatSareeTypeLabel(rawCategory)}`,
    });
  }
  if (!defaultCollectionId && effectiveFilters.collectionId) {
    activeFilters.push({
      key: "collectionId",
      label: `Collection: ${getCollectionById(effectiveFilters.collectionId)?.name ?? effectiveFilters.collectionId}`,
    });
  }
  if (effectiveFilters.minPrice !== null || effectiveFilters.maxPrice !== null) {
    const activePreset = PRICE_PRESETS.find(
      (p) => p.min === effectiveFilters.minPrice && p.max === effectiveFilters.maxPrice,
    );
    if (activePreset) {
      activeFilters.push({ key: "price", label: `Price: ${activePreset.label}` });
    } else {
      const min = effectiveFilters.minPrice !== null ? formatPrice(effectiveFilters.minPrice) : "₹0";
      const max = effectiveFilters.maxPrice !== null ? formatPrice(effectiveFilters.maxPrice) : "Any";
      activeFilters.push({ key: "price", label: `Price: ${min} – ${max}` });
    }
  }
  if (effectiveFilters.fabric) activeFilters.push({ key: "fabric", label: `Fabric: ${effectiveFilters.fabric}` });
  if (effectiveFilters.color) activeFilters.push({ key: "color", label: `Color: ${effectiveFilters.color}` });
  if (effectiveFilters.availability) {
    const avLabel =
      availabilityOptions.find((a) => a.value === effectiveFilters.availability)?.label ?? effectiveFilters.availability;
    activeFilters.push({ key: "availability", label: `Availability: ${avLabel}` });
  }

  // Count filters inside "More Filters" (fabric, color, availability)
  const moreFiltersCount =
    (effectiveFilters.fabric ? 1 : 0) +
    (effectiveFilters.color ? 1 : 0) +
    (effectiveFilters.availability ? 1 : 0);

  // Visible colors in swatch selector (first 10, or all if expanded)
  const visibleColorOptions = showAllColors ? colorOptions : colorOptions.slice(0, 10);

  /* -------------------------------------------------------------------------- */
  /* Sidebar Filter Sections: Saree Type & Price                                */
  /* -------------------------------------------------------------------------- */

  const renderSareeTypeFilter = () => (
    <div className="border-b border-line pb-5">
      <h3 className="type-eyebrow text-gold-accent font-semibold tracking-[0.12em] uppercase text-[0.6875rem] mb-3">
        Saree Type
      </h3>
      <ul className="flex flex-col space-y-1" role="radiogroup" aria-label="Filter by Saree Type">
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
            <span>All Sarees</span>
          </button>
        </li>
        {categoryOptions.map((option) => {
          const category = getCategoryById(option.value);
          const isSelected = effectiveFilters.categoryId === option.value;
          const displayLabel = formatSareeTypeLabel(option.label);
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
    return (
      <div className="py-5">
        <h3 className="type-eyebrow text-gold-accent font-semibold tracking-[0.12em] uppercase text-[0.6875rem] mb-3">
          Price
        </h3>
        <ul className="flex flex-col space-y-1" role="radiogroup" aria-label="Filter by Price">
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
              <span>All Prices</span>
            </button>
          </li>
          {PRICE_PRESETS.map((preset) => {
            const isSelected =
              effectiveFilters.minPrice === preset.min && effectiveFilters.maxPrice === preset.max;
            return (
              <li key={preset.label}>
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
                  <span>{preset.label}</span>
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

  const renderMoreFiltersContent = () => (
    <div className="flex flex-col gap-6">
      {/* Fabric Section */}
      <fieldset>
        <legend className="type-eyebrow text-ink font-semibold tracking-wide uppercase text-xs mb-3">
          Fabric
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fabricOptions.map((opt) => {
            const isSelected = effectiveFilters.fabric === opt.value;
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xs border text-xs sm:text-sm cursor-pointer select-none transition-all",
                  isSelected
                    ? "border-maroon bg-accent-soft text-maroon font-semibold shadow-xs"
                    : "border-line bg-canvas hover:border-line-strong text-ink",
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => updateParams({ fabric: isSelected ? null : opt.value, page: 1 })}
                  className="accent-maroon size-4 rounded-xs"
                />
                <span className="truncate">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Color Section with Visual Swatches Grid */}
      <fieldset className="border-t border-line pt-6">
        <div className="flex items-center justify-between mb-3">
          <legend className="type-eyebrow text-ink font-semibold tracking-wide uppercase text-xs">
            Color
          </legend>
          {effectiveFilters.color && (
            <span className="text-xs font-semibold text-maroon">{effectiveFilters.color}</span>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
          {visibleColorOptions.map((color) => {
            const isSelected = effectiveFilters.color?.toLowerCase() === color.value.toLowerCase();
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => updateParams({ color: isSelected ? null : color.value, page: 1 })}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-xs border transition-all text-center group",
                  isSelected
                    ? "border-maroon bg-accent-soft shadow-xs"
                    : "border-line bg-canvas hover:border-line-strong",
                )}
                title={color.label}
              >
                <span
                  className={cn(
                    "size-6 rounded-full border border-black/15 shadow-2xs flex items-center justify-center transition-transform group-hover:scale-110",
                    isSelected && "ring-2 ring-maroon ring-offset-1",
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <CheckIcon
                      size={12}
                      className={cn(
                        color.hex.toLowerCase() === "#ede6d6" ||
                          color.hex.toLowerCase() === "#ffffff" ||
                          color.hex.toLowerCase() === "#b9cad6"
                          ? "text-black"
                          : "text-white",
                      )}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[0.6875rem] truncate w-full",
                    isSelected ? "font-semibold text-maroon" : "text-muted group-hover:text-ink",
                  )}
                >
                  {color.label}
                </span>
              </button>
            );
          })}
        </div>

        {colorOptions.length > 10 && (
          <button
            type="button"
            onClick={() => setShowAllColors((prev) => !prev)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
          >
            {showAllColors ? "Show Less Colors" : `View More Colors (${colorOptions.length - 10} more)`}
            <ChevronDownIcon size={14} className={cn("transition-transform", showAllColors && "rotate-180")} />
          </button>
        )}
      </fieldset>

      {/* Stock / Availability Section */}
      <fieldset className="border-t border-line pt-6">
        <legend className="type-eyebrow text-ink font-semibold tracking-wide uppercase text-xs mb-3">
          Availability
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {availabilityOptions
            .filter((opt) => opt.value !== "out-of-stock")
            .map((opt) => {
              const isSelected = effectiveFilters.availability === opt.value;
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xs border text-xs sm:text-sm cursor-pointer select-none transition-all",
                    isSelected
                      ? "border-maroon bg-accent-soft text-maroon font-semibold shadow-xs"
                      : "border-line bg-canvas hover:border-line-strong text-ink",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => updateParams({ availability: isSelected ? null : opt.value, page: 1 })}
                    className="accent-maroon size-4 rounded-xs"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
        </div>
      </fieldset>
    </div>
  );

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
          value={effectiveFilters.query ?? ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search sarees by name, code (e.g. KS-BNS-1001), fabric, or type..."
          className="h-12 w-full rounded-xs border-line bg-canvas pl-11 pr-10 text-sm shadow-2xs placeholder:text-muted focus:border-maroon"
        />
        {effectiveFilters.query ? (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="absolute right-3.5 p-1 text-muted hover:text-ink transition-colors"
            aria-label="Clear search"
          >
            <CloseIcon size={16} />
          </button>
        ) : null}
      </div>

      {/* Main Layout: Left Sidebar + Product Catalogue */}
      <div className="grid gap-8 lg:grid-cols-[15.5rem_1fr] lg:gap-10">
        {/* Desktop Left Filter Sidebar */}
        <aside aria-label="Catalogue Filters" className="hidden lg:block">
          <div className="sticky top-24 rounded-xs border border-line bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-ink">Browse Sarees</h2>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-muted hover:text-maroon underline underline-offset-4 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Saree Type Filter (Clean single section) */}
            {renderSareeTypeFilter()}

            {/* Price Filter */}
            {renderPriceFilter()}

            {/* More Filters Trigger */}
            <div className="pt-4 border-t border-line flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setMoreFiltersOpen(true)}
                leadingIcon={<FilterIcon size={15} />}
                className="font-medium tracking-wide justify-center"
              >
                More Filters {moreFiltersCount > 0 ? `(${moreFiltersCount})` : ""}
              </Button>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-muted hover:text-maroon underline underline-offset-4 py-1 text-center"
                >
                  Clear all filters
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
                    Showing{" "}
                    <span className="font-semibold text-ink">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                      {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                    </span>{" "}
                    of <span className="font-semibold text-ink">{totalItems}</span> Sarees
                  </>
                ) : (
                  "0 Sarees found"
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
                Filter{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
              </Button>

              {/* Sort Dropdown */}
              <div className="flex flex-1 items-center gap-2 sm:flex-none">
                <label htmlFor="catalogue-sort" className="sr-only sm:not-sr-only text-xs font-medium text-muted whitespace-nowrap">
                  Sort By:
                </label>
                <Select
                  id="catalogue-sort"
                  value={effectiveFilters.sort}
                  onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                  className="min-h-9 w-full py-1.5 text-xs sm:w-44 sm:text-sm"
                >
                  {sortOptions.map((option) => (
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
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
              <span className="text-xs font-medium text-muted mr-1">Active:</span>
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => removeFilter(filter.key)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-gold/40 bg-accent-soft text-maroon text-xs font-medium hover:border-maroon transition-colors"
                  aria-label={`Remove filter: ${filter.label}`}
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
                Clear all
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
                    aria-label="Catalogue pagination"
                    className="mt-12 flex flex-col items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between"
                  >
                    <p className="text-xs text-muted">
                      Page <span className="font-semibold text-ink">{currentPage}</span> of{" "}
                      <span className="font-semibold text-ink">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => updateParams({ page: currentPage - 1 })}
                        leadingIcon={<ChevronLeftIcon size={16} />}
                      >
                        Previous
                      </Button>
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => updateParams({ page: pageNum })}
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
                        onClick={() => updateParams({ page: currentPage + 1 })}
                        trailingIcon={<ChevronRightIcon size={16} />}
                      >
                        Next
                      </Button>
                    </div>
                  </nav>
                )}
              </>
            ) : (
              <EmptyState
                icon={<SparkleIcon size={26} />}
                title="No sarees match these criteria"
                description="Try selecting a different saree type, clearing some filters, or searching for a broader term."
                action={<Button onClick={clearAllFilters}>Clear all filters</Button>}
              />
            )}
          </div>
        </div>
      </div>

      {/* "More Filters" Modal (Desktop & Tablet) */}
      <Modal
        open={isMoreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        title="More Filters"
        description="Filter by fabric weaves, colors, and availability"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={clearMoreFilters}
              disabled={moreFiltersCount === 0}
            >
              Clear More Filters
            </Button>
            <Button size="sm" onClick={() => setMoreFiltersOpen(false)}>
              Apply Filters ({totalItems} {totalItems === 1 ? "Saree" : "Sarees"})
            </Button>
          </div>
        }
      >
        {renderMoreFiltersContent()}
      </Modal>

      {/* Mobile Filter Drawer (Complete Experience) */}
      <Drawer
        open={isMobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Sarees"
        side="right"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={clearAllFilters}
              disabled={activeFilters.length === 0}
            >
              Clear All
            </Button>
            <Button className="flex-1" onClick={() => setMobileFilterOpen(false)}>
              Show {totalItems} {totalItems === 1 ? "Saree" : "Sarees"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5 pb-6">
          {renderSareeTypeFilter()}
          {renderPriceFilter()}
          <div className="border-t border-line pt-5">
            <h3 className="type-eyebrow text-gold-accent font-semibold tracking-[0.12em] uppercase text-[0.6875rem] mb-4">
              More Filters
            </h3>
            {renderMoreFiltersContent()}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
