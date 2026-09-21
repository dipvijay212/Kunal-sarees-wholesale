import { cn } from "@/lib/cn";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  /** Number of leading cards to load eagerly (above the fold). */
  eagerCount?: number;
  className?: string;
}

export function ProductGrid({ products, eagerCount = 0, className }: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-6",
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} eager={index < eagerCount} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
