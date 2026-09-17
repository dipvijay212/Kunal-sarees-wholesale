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
        "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-14",
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
