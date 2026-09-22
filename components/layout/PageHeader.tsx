import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: "default" | "light";
}

export function Breadcrumbs({ items, className, variant = "default" }: BreadcrumbsProps) {
  const isLight = variant === "light";
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs",
          isLight ? "text-cream/70" : "text-muted",
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    isLight ? "hover:text-cream text-cream/80" : "hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    isLast && (isLight ? "text-gold-light font-medium" : "text-ink"),
                  )}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRightIcon
                  size={12}
                  className={cn("shrink-0", isLight ? "text-gold-light/50" : "text-subtle")}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  className?: string;
}

/** Standard title block for inner pages. */
export function PageHeader({ title, eyebrow, description, breadcrumbs, children, className }: PageHeaderProps) {
  return (
    <header className={cn("border-b border-line", className)}>
      <Container className="pt-6 pb-12 lg:pt-8 lg:pb-16">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className={cn("flex max-w-3xl flex-col gap-3", breadcrumbs && "mt-8 lg:mt-10")}>
          {eyebrow ? <p className="type-eyebrow text-gold font-medium tracking-[0.15em] uppercase">{eyebrow}</p> : null}
          <h1 className="type-h1 text-ink font-serif font-normal">{title}</h1>
          {description ? <p className="type-lead text-muted font-sans">{description}</p> : null}
        </div>
        {children}
      </Container>
    </header>
  );
}
