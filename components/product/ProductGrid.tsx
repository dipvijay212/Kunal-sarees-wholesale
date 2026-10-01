import { cn } from "@/lib/cn";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  /** Number of leading cards to load eagerly (above the fold). */
  eagerCount?: number;
  /**
   * Show exactly one row at every screen size: 4 cards on large desktops, 3 on laptops,
   * 2 on tablets and phones (single-column phones stack the 2).
   */
  singleRow?: boolean;
  className?: string;
}

/** Cards beyond the current column count are hidden, matching the grid breakpoints below. */
const SINGLE_ROW_VISIBILITY = ["flex", "flex", "hidden lg:flex", "hidden 2xl:flex"];

export function ProductGrid({ products, eagerCount = 0, singleRow = false, className }: ProductGridProps) {
  const visibleProducts = singleRow ? products.slice(0, SINGLE_ROW_VISIBILITY.length) : products;

  return (
    <ul
      className={cn(
        "grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-6",
        className,
      )}
    >
      {visibleProducts.map((product, index) => (
        <li key={product.id} className={singleRow ? SINGLE_ROW_VISIBILITY[index] : "flex"}>
          <ProductCard product={product} eager={index < eagerCount} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
