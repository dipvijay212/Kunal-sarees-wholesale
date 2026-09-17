import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * `solid` for emphasis (e.g. Bestseller), `neutral` on top of photography,
 * `accent` for new or highlighted items, `outline` for quiet metadata.
 */
export type BadgeVariant = "solid" | "neutral" | "accent" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "outline", children, className }: BadgeProps) {
  return <span className={cn("badge", `badge--${variant}`, className)}>{children}</span>;
}
