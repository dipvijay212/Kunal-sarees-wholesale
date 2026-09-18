import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { cn } from "@/lib/cn";
import type { CollectionWithCount } from "@/types";

export interface CollectionCardProps {
  collection: CollectionWithCount;
  aspect?: "portrait" | "landscape";
  sizes?: string;
  eager?: boolean;
  className?: string;
}

export function CollectionCard({
  collection,
  aspect = "portrait",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  eager = false,
  className,
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xs border border-line bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift",
        className,
      )}
    >
      {/* Image Frame */}
      <div className={cn("media-frame bg-cream-warm", aspect === "portrait" ? "aspect-[4/5]" : "aspect-[16/10]")}>
        <RemoteImage
          src={collection.image.url}
          alt={collection.image.alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 bg-surface">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[0.6875rem] font-semibold tracking-[0.08em] text-gold uppercase">
              {collection.productCount ? `${collection.productCount}+ Products` : "Wholesale Edit"}
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-[1.375rem] font-normal text-ink mt-1.5 transition-colors group-hover:text-maroon">
            {collection.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">
            {collection.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.08em] text-maroon">
          <span>View Collection</span>
          <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1 text-maroon" />
        </div>
      </div>
    </Link>
  );
}

