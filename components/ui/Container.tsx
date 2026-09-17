import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ContainerSize = "default" | "narrow" | "wide";

const sizeClasses: Record<ContainerSize, string> = {
  default: "container-page",
  narrow: "container-narrow",
  wide: "container-wide",
};

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "header" | "footer" | "nav" | "article" | "aside";
  /** `default` 1320px, `narrow` 880px for reading, `wide` 1600px for full-bleed grids. */
  size?: ContainerSize;
}

/** Centres content with the responsive page gutter. */
export function Container({ as: Component = "div", size = "default", className, ...props }: ContainerProps) {
  return <Component className={cn(sizeClasses[size], className)} {...props} />;
}
