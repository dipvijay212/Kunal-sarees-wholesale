"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { CloseIcon, FilterIcon, SparkleIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/FormField";
import {
  filterProducts,
  getCollectionOptions,
  getFabricOptions,
  getOccasionOptions,
  parseCatalogueFilters,
  sortOptions,
} from "@/lib/catalog";
import { cn } from "@/lib/cn";
import type { CatalogueFilters, FilterOption, Product } from "@/types";
import { ProductGrid } from "./ProductGrid";

type FilterKey = Exclude<keyof CatalogueFilters, "sort" | "query">;
type RemovableFilterKey = Exclude<keyof CatalogueFilters, "sort">;

interface FilterGroupProps {
  legend: string;
  name: FilterKey;
  options: FilterOption[];
  selected: string | null;
  onSelect: (name: FilterKey, value: string | null) => void;
}

function FilterGroup({ legend, name, options, selected, onSelect }: FilterGroupProps) {
  return (
    <fieldset className="border-b border-line pb-6">
      <legend className="type-eyebrow mb-4 text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === selected;
          return (
            <button
              key={option.value}
              type="button"
              className="chip"
              aria-pressed={isActive}
              onClick={() => onSelect(name, isActive ? null : option.value)}
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

interface CatalogueBrowserProps {
  products: Product[];
}

/**
 * Filterable product grid. Filter state lives in the URL so views are
 * shareable and survive the back button.
 */
export function CatalogueBrowser({ products }: CatalogueBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isFilterOpen, setFilterOpen] = useState(false);

  const filters = parseCatalogueFilters(searchParams);
  const results = filterProducts(products, filters);

  const collectionOptions = getCollectionOptions(products);
  const fabricOptions = getFabricOptions(products);
  const occasionOptions = getOccasionOptions(products);

  const updateParams = (updates: Partial<Record<Exclude<keyof CatalogueFilters, "query"> | "q", string | null>>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined || (key === "sort" && value === "featured")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const handleSelect = (name: FilterKey, value: string | null) => updateParams({ [name]: value });
  const clearFilters = () => updateParams({ q: null, collection: null, fabric: null, occasion: null });
  const removeFilter = (key: RemovableFilterKey) => updateParams(key === "query" ? { q: null } : { [key]: null });

  const activeFilters: { key: RemovableFilterKey; label: string }[] = [];
  if (filters.query) activeFilters.push({ key: "query", label: `“${filters.query}”` });
  if (filters.collection) {
    const label = collectionOptions.find((option) => option.value === filters.collection)?.label;
    activeFilters.push({ key: "collection", label: label ?? filters.collection });
  }
  if (filters.fabric) activeFilters.push({ key: "fabric", label: filters.fabric });
  if (filters.occasion) activeFilters.push({ key: "occasion", label: filters.occasion });

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <FilterGroup
        legend="Collection"
        name="collection"
        options={collectionOptions}
        selected={filters.collection}
        onSelect={handleSelect}
      />
      <FilterGroup legend="Fabric" name="fabric" options={fabricOptions} selected={filters.fabric} onSelect={handleSelect} />
      <FilterGroup
        legend="Occasion"
        name="occasion"
        options={occasionOptions}
        selected={filters.occasion}
        onSelect={handleSelect}
      />
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
      {/* Desktop filters */}
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="top-header sticky">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="type-eyebrow text-ink">Refine</h2>
            {activeFilters.length > 0 ? (
              <button type="button" onClick={clearFilters} className="text-xs text-muted underline underline-offset-4 hover:text-ink">
                Clear all
              </button>
            ) : null}
          </div>
          {filterPanel}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted" aria-live="polite">
            Showing <span className="font-semibold text-ink">{results.length}</span> of {products.length} designs
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
              Filter{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
            </Button>
            <label htmlFor="catalogue-sort" className="sr-only">
              Sort designs
            </label>
            <Select
              id="catalogue-sort"
              value={filters.sort}
              onChange={(event) => updateParams({ sort: event.target.value })}
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
                Clear all
              </button>
            </li>
          </ul>
        ) : null}

        <div className={cn("mt-8 transition-opacity duration-300", isPending && "opacity-60")}>
          {results.length > 0 ? (
            <ProductGrid products={results} eagerCount={4} className="lg:grid-cols-3" />
          ) : (
            <EmptyState
              icon={<SparkleIcon size={26} />}
              title="No designs match these filters"
              description="Try removing a filter to see more of the catalogue."
              action={<Button onClick={clearFilters}>Clear filters</Button>}
            />
          )}
        </div>
      </div>

      {/* Mobile filters */}
      <Drawer
        open={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter designs"
        side="right"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={clearFilters} disabled={activeFilters.length === 0}>
              Clear
            </Button>
            <Button className="flex-1" onClick={() => setFilterOpen(false)}>
              Show {results.length}
            </Button>
          </div>
        }
      >
        {filterPanel}
      </Drawer>
    </div>
  );
}
