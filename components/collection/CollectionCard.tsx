import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
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
        <Image
          src={collection.image.src}
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
        <p className="type-eyebrow text-ice-300">
          {collection.productCount} {collection.productCount === 1 ? "design" : "designs"}
        </p>
        <h3 className="font-display text-[1.75rem] leading-tight font-normal lg:text-3xl">{collection.name}</h3>
        <p className="text-sm text-silver-200">{collection.tagline}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase">
          Explore
          <ArrowRightIcon size={16} className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
