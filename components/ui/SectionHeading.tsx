import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "./Icons";

export interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "md";
  action?: { label: string; href: string };
  id?: string;
  className?: string;
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  align = "left",
  as: Heading = "h2",
  size = "lg",
  action,
  id,
  className,
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        isCentered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <div className={cn("flex min-w-0 max-w-2xl flex-col gap-4", isCentered && "items-center")}>
        {eyebrow ? (
          <p className="type-eyebrow flex items-center gap-3 text-accent-strong">
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-accent" />
            {eyebrow}
          </p>
        ) : null}
        <Heading id={id} className={cn(size === "lg" ? "type-h2" : "type-h3", "text-ink")}>
          {title}
        </Heading>
        {description ? <p className="type-body max-w-xl text-muted">{description}</p> : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className={cn("btn btn--link shrink-0 self-start", isCentered ? "self-center" : "md:self-end")}
        >
          {action.label}
          <ArrowRightIcon size={16} />
        </Link>
      ) : null}
    </div>
  );
}
