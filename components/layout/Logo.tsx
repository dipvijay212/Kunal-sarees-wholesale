import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";

interface LogoProps {
  /** Tailwind size classes for the KS mark, e.g. `size-10 lg:size-11`. */
  markClassName?: string;
  /** Tailwind classes for the KUNAL SAREES wordmark (font size, tracking). */
  wordmarkClassName?: string;
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
  markClassName = "size-11",
  wordmarkClassName = "text-lg",
  showWordmark = true,
  showTagline = false,
  eager = false,
  asLink = true,
  tone = "default",
  onClick,
  className,
}: LogoProps) {
  const { logo } = siteConfig.brand;
  const isLight = tone === "light";

  const content = (
    <>
      <div className={cn("relative shrink-0 rounded-full", isLight ? "ring-2 ring-gold-light/60 bg-cream p-0.5 shadow-md" : "")}>
        <Image
          src={logo.src}
          alt={showWordmark ? "" : `${siteConfig.name} logo`}
          width={logo.width}
          height={logo.height}
          loading={eager ? "eager" : "lazy"}
          sizes="56px"
          className={cn("rounded-full block", markClassName)}
        />
      </div>
      {showWordmark ? (
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              "font-display leading-none font-semibold tracking-[0.14em] whitespace-nowrap uppercase",
              isLight ? "text-cream" : "text-ink",
              wordmarkClassName,
            )}
          >
            {siteConfig.name}
          </span>
          {showTagline ? (
            <span
              className={cn(
                "mt-1.5 text-[0.625rem] leading-none font-semibold tracking-[0.22em] whitespace-nowrap uppercase",
                isLight ? "text-gold-light" : "text-muted",
              )}
            >
              {siteConfig.positioning}
            </span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  const classes = cn("inline-flex min-w-0 items-center gap-3", className);

  if (!asLink) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <Link href="/" onClick={onClick} aria-label={`${siteConfig.name} — home`} className={classes}>
      {content}
    </Link>
  );
}

