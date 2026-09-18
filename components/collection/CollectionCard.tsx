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
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  eager = false,
  className,
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={cn("group relative block overflow-hidden rounded-xs bg-charcoal-900 text-white", className)}
    >
      <div className={cn("media-frame bg-charcoal-900", aspect === "portrait" ? "aspect-[4/5]" : "aspect-[16/10]")}>
        <RemoteImage
          src={collection.image.url}
          alt={collection.image.alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="object-cover group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-charcoal-950/90 via-charcoal-950/25 to-transparent transition-opacity duration-500 group-hover:opacity-95"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 lg:p-7">
        <div className="flex items-center justify-between">
          <p className="type-eyebrow text-ice-300">
            {collection.productCount} {collection.productCount === 1 ? "design" : "designs"}
          </p>
        </div>
        <h3 className="font-display text-[1.75rem] leading-tight font-normal lg:text-3xl">{collection.name}</h3>
        <p className="text-xs font-medium text-silver-300 line-clamp-1">{collection.tagline}</p>
        <p className="text-xs leading-relaxed text-silver-200/90 line-clamp-2">{collection.description}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xs border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-xs text-[0.6875rem] font-semibold tracking-[0.18em] uppercase transition-colors group-hover:bg-accent group-hover:border-accent group-hover:text-white">
          View Collection
          <ArrowRightIcon size={14} className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
