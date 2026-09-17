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
  onClick?: () => void;
  className?: string;
}

/**
 * Official KS logo with the KUNAL SAREES wordmark.
 * The logo artwork has a charcoal background, so it is clipped to its circular
 * badge to sit cleanly on any surface.
 */
export function Logo({
  markClassName = "size-11",
  wordmarkClassName = "text-lg",
  showWordmark = true,
  showTagline = false,
  eager = false,
  asLink = true,
  onClick,
  className,
}: LogoProps) {
  const { logo } = siteConfig.brand;

  const content = (
    <>
      <Image
        src={logo.src}
        alt={showWordmark ? "" : `${siteConfig.name} logo`}
        width={logo.width}
        height={logo.height}
        loading={eager ? "eager" : "lazy"}
        sizes="56px"
        className={cn("shrink-0 rounded-full", markClassName)}
      />
      {showWordmark ? (
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              "font-display leading-none font-medium tracking-[0.14em] whitespace-nowrap text-ink uppercase",
              wordmarkClassName,
            )}
          >
            {siteConfig.name}
          </span>
          {showTagline ? (
            <span className="mt-1.5 text-[0.5625rem] leading-none font-semibold tracking-[0.26em] whitespace-nowrap text-muted uppercase">
              {siteConfig.positioning}
            </span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  const classes = cn("inline-flex min-w-0 items-center gap-2.5", className);

  if (!asLink) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <Link href="/" onClick={onClick} aria-label={`${siteConfig.name} — home`} className={classes}>
      {content}
    </Link>
  );
}
