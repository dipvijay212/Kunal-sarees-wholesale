import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  titleAs?: "h2" | "h3";
  className?: string;
}

export function EmptyState({ title, description, icon, action, titleAs: Title = "h2", className }: EmptyStateProps) {
  return (
    <div className={cn("mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center", className)}>
      {icon ? (
        <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-line-strong text-accent-strong">
          {icon}
        </div>
      ) : null}
      <Title className="type-h3 text-ink">{title}</Title>
      {description ? <p className="type-body mt-3 text-muted">{description}</p> : null}
      {action ? <div className="mt-8 flex w-full flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
