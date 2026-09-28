import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { cn } from "@/lib/cn";
import { pluralize } from "@/lib/format";
import type { CategoryWithCount } from "@/types";

interface CategoryCardProps {
  category: CategoryWithCount;
  sizes?: string;
  eager?: boolean;
  className?: string;
}

/** Compact landscape tile linking to a filtered catalogue view. */
export function CategoryCard({
  category,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  eager = false,
  className,
}: CategoryCardProps) {
  const isDummyUrl =
    !category.image?.url ||
    category.image.url.includes("photo-1619043518800") ||
    category.image.url.includes("photo-1610030469983");
  const displayImageUrl = isDummyUrl
    ? "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85"
    : category.image.url;

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className={cn("group relative block overflow-hidden rounded-xs border border-line", className)}
    >
      <div className="media-frame aspect-[16/10]">
        <RemoteImage
          src={displayImageUrl}
          alt={category.image?.alt || category.name}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="object-cover opacity-70 group-hover:scale-[1.04] group-hover:opacity-90"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/50 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 lg:p-5">
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-tight text-ink sm:text-xl">{category.name}</h3>
          <p className="type-caption mt-1 text-muted">{pluralize(category.productCount, "design")}</p>
        </div>
        <ArrowRightIcon
          size={18}
          className="shrink-0 text-accent-strong transition-transform duration-500 ease-luxe group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
