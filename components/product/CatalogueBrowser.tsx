"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/FormField";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, FilterIcon, SearchIcon, SparkleIcon } from "@/components/ui/Icons";
import {
  filterProducts,
  getAvailabilityOptions,
  getCategoryById,
  getCategoryOptions,
  getCollectionById,
  getCollectionOptions,
  getColorOptions,
  getFabricOptions,
  parseCatalogueFilters,
  sortOptions,
  type ColorFilterOption,
} from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { CatalogueFilters, FilterOption, Product } from "@/types";
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

interface FilterChipGroupProps<T extends string = string> {
  legend: string;
  options: FilterOption<T>[];
  selected: T | null;
  onSelect: (value: T | null) => void;
}

function FilterChipGroup<T extends string = string>({ legend, options, selected, onSelect }: FilterChipGroupProps<T>) {
  return (
    <fieldset className="border-b border-line pb-6">
      <legend className="type-eyebrow mb-3 text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === selected;
          return (
            <button
              key={option.value}
              type="button"
              className="chip"
              data-active={isActive ? "true" : undefined}
              aria-pressed={isActive}
              onClick={() => onSelect(isActive ? null : option.value)}
            >
              {option.label}
              <span className={cn("text-xs", isActive ? "text-silver-300" : "text-subtle")}>{option.count}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

interface ColorFilterGroupProps {
  legend: string;
  options: ColorFilterOption[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

function ColorFilterGroup({ legend, options, selected, onSelect }: ColorFilterGroupProps) {
  return (
    <fieldset className="border-b border-line pb-6">
      <legend className="type-eyebrow mb-3 text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === selected;
          return (
            <button
              key={option.value}
              type="button"
              className="chip"
              data-active={isActive ? "true" : undefined}
              aria-pressed={isActive}
              onClick={() => onSelect(isActive ? null : option.value)}
            >
              <span
                aria-hidden="true"
                className="size-3 rounded-full border border-black/20"
                style={{ backgroundColor: option.hex }}
              />
              {option.label}
              <span className={cn("text-xs", isActive ? "text-silver-300" : "text-subtle")}>{option.count}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

interface CatalogueBrowserProps {
  products: Product[];
  /** Optional override title or pre-filtered collection context */
  defaultCollectionId?: string;
}

export function CatalogueBrowser({ products, defaultCollectionId }: CatalogueBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isFilterOpen, setFilterOpen] = useState(false);

  const filters = parseCatalogueFilters(searchParams);

  // If component is configured with a defaultCollectionId (e.g., inside /collections/[slug])
  const activeCollectionId = defaultCollectionId ?? filters.collectionId;
  const effectiveFilters: CatalogueFilters = {
    ...filters,
    collectionId: activeCollectionId,
  };

  const results = filterProducts(products, effectiveFilters);

  // Options derived from product pool
  const categoryOptions = getCategoryOptions(products);
  const collectionOptions = getCollectionOptions(products);
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
      if (value === null || value === undefined || value === "" || (key === "sort" && value === "featured") || (key === "page" && value === 1)) {
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

  const clearFilters = () => {
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
    if (key === "price") {
      updateParams({ minPrice: null, maxPrice: null, page: 1 });
    } else {
      updateParams({ [urlParamFor[key]]: null, page: 1 });
    }
  };

  // Build list of active filter badges
  const activeFilters: { key: RemovableFilterKey; label: string }[] = [];
  if (effectiveFilters.query) activeFilters.push({ key: "query", label: `Search: “${effectiveFilters.query}”` });
  if (effectiveFilters.categoryId) {
    activeFilters.push({
      key: "categoryId",
      label: getCategoryById(effectiveFilters.categoryId)?.name ?? effectiveFilters.categoryId,
    });
  }
  if (!defaultCollectionId && effectiveFilters.collectionId) {
    activeFilters.push({
      key: "collectionId",
      label: getCollectionById(effectiveFilters.collectionId)?.name ?? effectiveFilters.collectionId,
    });
  }
  if (effectiveFilters.fabric) activeFilters.push({ key: "fabric", label: effectiveFilters.fabric });
  if (effectiveFilters.color) activeFilters.push({ key: "color", label: effectiveFilters.color });
  if (effectiveFilters.availability) {
    const avLabel = availabilityOptions.find((a) => a.value === effectiveFilters.availability)?.label ?? effectiveFilters.availability;
    activeFilters.push({ key: "availability", label: avLabel });
  }
  if (effectiveFilters.minPrice !== null || effectiveFilters.maxPrice !== null) {
    const min = effectiveFilters.minPrice !== null ? formatPrice(effectiveFilters.minPrice) : "₹0";
    const max = effectiveFilters.maxPrice !== null ? formatPrice(effectiveFilters.maxPrice) : "Any";
    activeFilters.push({ key: "price", label: `${min} – ${max}` });
  }

  const filterPanel = (
    <div className="flex flex-col gap-6">
      {/* Category filter */}
      <FilterChipGroup
        legend="Category"
        options={categoryOptions}
        selected={effectiveFilters.categoryId}
        onSelect={(val) => updateParams({ category: val ? (getCategoryById(val)?.slug ?? val) : null, page: 1 })}
      />

      {/* Collection filter (hidden if locked on collection detail page) */}
      {!defaultCollectionId ? (
        <FilterChipGroup
          legend="Collection"
          options={collectionOptions}
          selected={effectiveFilters.collectionId}
          onSelect={(val) => updateParams({ collection: val ? (getCollectionById(val)?.slug ?? val) : null, page: 1 })}
        />
      ) : null}

      {/* Fabric filter */}
      <FilterChipGroup
        legend="Fabric"
        options={fabricOptions}
        selected={effectiveFilters.fabric}
        onSelect={(val) => updateParams({ fabric: val, page: 1 })}
      />

      {/* Color filter */}
      <ColorFilterGroup
        legend="Color"
        options={colorOptions}
        selected={effectiveFilters.color}
        onSelect={(val) => updateParams({ color: val, page: 1 })}
      />

      {/* Availability filter */}
      <FilterChipGroup
        legend="Stock Status"
        options={availabilityOptions}
        selected={effectiveFilters.availability}
        onSelect={(val) => updateParams({ availability: val, page: 1 })}
      />

      {/* Price Range Presets */}
      <fieldset className="border-b border-line pb-6">
        <legend className="type-eyebrow mb-3 text-muted">Price per piece</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Under ₹2,500", min: null, max: 2500 },
            { label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
            { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
            { label: "Above ₹10,000", min: 10000, max: null },
          ].map((preset) => {
            const isActive = effectiveFilters.minPrice === preset.min && effectiveFilters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                className="chip text-xs"
                data-active={isActive ? "true" : undefined}
                onClick={() =>
                  updateParams({
                    minPrice: isActive ? null : preset.min,
                    maxPrice: isActive ? null : preset.max,
                    page: 1,
                  })
                }
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Top Search Bar */}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-muted">
          <SearchIcon size={20} />
        </div>
        <Input
          type="text"
          value={effectiveFilters.query ?? ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search sarees by name, product code (e.g. KS-BNS-1001), fabric, or category..."
          className="h-12 w-full rounded-xs border-line bg-canvas pl-12 pr-10 text-sm shadow-xs placeholder:text-muted focus:border-accent"
        />
        {effectiveFilters.query ? (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="absolute right-3.5 p-1 text-muted hover:text-ink"
            aria-label="Clear search"
          >
            <CloseIcon size={16} />
          </button>
        ) : null}
      </div>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        {/* Desktop Sidebar Filters */}
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="top-header sticky">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="type-eyebrow text-ink">Refine Catalogue</h2>
              {activeFilters.length > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-muted underline underline-offset-4 hover:text-ink"
                >
                  Clear all
                </button>
              ) : null}
            </div>
            {filterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Toolbar: Counter, Mobile Filter Trigger & Sort dropdown */}
          <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted" aria-live="polite">
              Showing{" "}
              <span className="font-semibold text-ink">
                {totalItems > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
                {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
              </span>{" "}
              of <span className="font-semibold text-ink">{totalItems}</span> designs
            </p>
            <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="shrink-0 lg:hidden"
                onClick={() => setFilterOpen(true)}
                leadingIcon={<FilterIcon size={16} />}
                aria-haspopup="dialog"
              >
                Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
              </Button>
              <label htmlFor="catalogue-sort" className="sr-only">
                Sort designs
              </label>
              <Select
                id="catalogue-sort"
                value={effectiveFilters.sort}
                onChange={(event) => updateParams({ sort: event.target.value, page: 1 })}
                className="min-h-10 min-w-0 flex-1 py-2 sm:w-auto sm:flex-none sm:text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFilters.length > 0 ? (
            <ul className="mt-5 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {activeFilters.map((filter) => (
                <li key={filter.key}>
                  <button
                    type="button"
                    className="chip"
                    data-active="true"
                    onClick={() => removeFilter(filter.key)}
                    aria-label={`Remove filter: ${filter.label}`}
                  >
                    {filter.label}
                    <CloseIcon size={14} />
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-2 text-xs text-muted underline underline-offset-4 hover:text-ink"
                >
                  Clear all filters
                </button>
              </li>
            </ul>
          ) : null}

          {/* Product Grid / Empty State */}
          <div className={cn("mt-8 transition-opacity duration-300", isPending && "opacity-60")}>
            {paginatedResults.length > 0 ? (
              <>
                <ProductGrid products={paginatedResults} eagerCount={4} className="lg:grid-cols-3" />

                {/* Pagination Controls */}
                {totalPages > 1 ? (
                  <nav aria-label="Catalogue pagination" className="mt-12 flex flex-col items-center gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between">
                    <p className="text-xs text-muted">
                      Page <span className="font-medium text-ink">{currentPage}</span> of{" "}
                      <span className="font-medium text-ink">{totalPages}</span>
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
                              "size-9 rounded-xs text-xs font-semibold transition-colors",
                              pageNum === currentPage
                                ? "bg-accent text-white"
                                : "text-muted hover:bg-surface-elevated hover:text-ink",
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
                ) : null}
              </>
            ) : (
              <EmptyState
                icon={<SparkleIcon size={26} />}
                title="No saree designs match these criteria"
                description="Try clearing some filters or searching for a broader term like 'silk', 'zari', or 'banarasi'."
                action={<Button onClick={clearFilters}>Clear all filters</Button>}
              />
            )}
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        <Drawer
          open={isFilterOpen}
          onClose={() => setFilterOpen(false)}
          title="Filter Catalogue"
          side="right"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={clearFilters}
                disabled={activeFilters.length === 0}
              >
                Clear all
              </Button>
              <Button className="flex-1" onClick={() => setFilterOpen(false)}>
                Show {totalItems} {totalItems === 1 ? "design" : "designs"}
              </Button>
            </div>
          }
        >
          {filterPanel}
        </Drawer>
      </div>
    </div>
  );
}
