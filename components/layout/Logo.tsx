"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";

interface LogoProps {
  /** Tailwind size classes for the KS mark, e.g. `size-12 lg:size-14`. */
  markClassName?: string;
  /** Tailwind classes for the KUNAL SAREES wordmark (font size, tracking). */
  wordmarkClassName?: string;
  /** Tailwind classes for the tagline underneath. */
  taglineClassName?: string;
  showWordmark?: boolean;
  /** Show "Premium Wholesale Sarees" beneath the wordmark. */
  showTagline?: boolean;
  /** Load eagerly — use for the header logo that is visible on first paint. */
  eager?: boolean;
  /** Render as a home link (default) or as static branding. */
  asLink?: boolean;
  /** Tone variant for light header or dark maroon footer */
  tone?: "default" | "light";
  onClick?: () => void;
  className?: string;
}

/**
 * Official KS logo with the KUNAL SAREES wordmark.
 * Supports tone="light" for dark maroon surfaces (high contrast cream & gold text).
 */
export function Logo({
  markClassName = "size-12",
  wordmarkClassName = "text-xl",
  taglineClassName,
  showWordmark = true,
  showTagline = false,
  eager = false,
  asLink = true,
  tone = "default",
  onClick,
  className,
}: LogoProps) {
  const { logo } = siteConfig.brand;
  const { language } = useLanguage();
  const isLight = tone === "light";

  const tagline = language === "en" ? "PREMIUM WHOLESALE SAREES" : "प्रीमियम होलसेल साड़ियां";

  const content = (
    <>
      <div
        className={cn(
          "relative shrink-0 rounded-full transition-all duration-300 group-hover:scale-105 group-focus-visible:scale-105",
          isLight
            ? "ring-2 ring-gold-light/60 bg-cream p-0.5 shadow-md group-hover:ring-gold-light"
            : "ring-2 ring-gold/40 bg-canvas p-0.5 shadow-sm group-hover:ring-maroon group-hover:shadow-md group-focus-visible:ring-maroon"
        )}
      >
        <Image
          src={logo.src}
          alt={showWordmark ? "" : `${siteConfig.name} logo`}
          width={logo.width}
          height={logo.height}
          loading={eager ? "eager" : "lazy"}
          sizes="72px"
          className={cn("rounded-full block object-cover", markClassName)}
        />
      </div>
      {showWordmark ? (
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              // Never truncated: the brand name must always be readable in full.
              "font-serif leading-none font-bold tracking-[0.12em] sm:tracking-[0.15em] whitespace-nowrap uppercase transition-colors duration-200",
              isLight
                ? "text-cream group-hover:text-gold-light group-focus-visible:text-gold-light"
                : "text-ink group-hover:text-maroon group-focus-visible:text-maroon",
              wordmarkClassName,
            )}
          >
            {siteConfig.name}
          </span>
          {showTagline ? (
            <span
              className={cn(
                "mt-0.5 sm:mt-1 text-[0.625rem] sm:text-[0.6875rem] leading-none font-semibold tracking-[0.16em] sm:tracking-[0.24em] whitespace-nowrap uppercase transition-colors duration-200",
                isLight
                  ? "text-gold-light"
                  : "text-muted group-hover:text-gold group-focus-visible:text-gold",
                taglineClassName,
              )}
            >
              {tagline}
            </span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  const classes = cn(
    "group inline-flex min-w-0 items-center gap-2 xs:gap-2.5 sm:gap-3.5 transition-all duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:ring-offset-4 focus-visible:ring-offset-canvas cursor-pointer select-none",
    className
  );

  if (!asLink) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <Link href="/" onClick={onClick} aria-label={`${siteConfig.name} — home`} className={classes}>
      {content}
    </Link>
  );
}


