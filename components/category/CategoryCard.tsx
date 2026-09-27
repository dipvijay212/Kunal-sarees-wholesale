"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import type { CategoryWithCount } from "@/types";

export interface CategoryCardProps {
  category: CategoryWithCount;
  aspect?: "portrait" | "landscape";
  sizes?: string;
  eager?: boolean;
  className?: string;
}

export function CategoryCard({
  category,
  aspect = "portrait",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  eager = false,
  className,
}: CategoryCardProps) {
  const { t, getLocalized, language } = useLanguage();
  const href = `/products?category=${category.slug}`;

  const displayName = getLocalized(category, "name") || category.name;
  const displayDescription = getLocalized(category, "description") || category.description;

  const countBadge = category.productCount > 0
    ? (language === "en" ? `${category.productCount} Designs Available` : `${category.productCount} डिजाइन उपलब्ध हैं`)
    : (language === "en" ? "Wholesale Sarees" : "होलसेल साड़ियां");

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xs border border-line bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift",
        className,
      )}
    >
      {/* Image Frame */}
      <div className={cn("media-frame bg-cream-warm", aspect === "portrait" ? "aspect-[4/5]" : "aspect-[16/10]")}>
        <RemoteImage
          src={category.image.url}
          alt={category.image.alt || displayName}
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
            <span className="text-[0.6875rem] font-semibold tracking-[0.04em] text-gold uppercase">
              {countBadge}
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-[1.375rem] font-normal text-ink mt-1.5 transition-colors group-hover:text-maroon">
            {displayName}
          </h3>
          {displayDescription ? (
            <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">
              {displayDescription}
            </p>
          ) : null}
        </div>

        <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.04em] text-maroon">
          <span>{t.categories.exploreBtn}</span>
          <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1 text-maroon" />
        </div>
      </div>
    </Link>
  );
}
