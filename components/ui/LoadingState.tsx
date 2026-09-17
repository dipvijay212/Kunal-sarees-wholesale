import { cn } from "@/lib/cn";

interface LoadingStateProps {
  /** `spinner` for short waits, `products` for a skeleton product grid, `lines` for list rows. */
  variant?: "spinner" | "products" | "lines";
  label?: string;
  count?: number;
  className?: string;
}

export function LoadingState({ variant = "spinner", label = "Loading", count = 4, className }: LoadingStateProps) {
  if (variant === "products") {
    return (
      <div role="status" aria-live="polite" className={className}>
        <span className="sr-only">{label}</span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className="flex flex-col gap-4" aria-hidden="true">
              <div className="skeleton aspect-[3/4] w-full" />
              <div className="skeleton h-3 w-1/3" />
              <div className="skeleton h-5 w-4/5" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "lines") {
    return (
      <div role="status" aria-live="polite" className={cn("flex flex-col gap-4", className)}>
        <span className="sr-only">{label}</span>
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="flex gap-4" aria-hidden="true">
            <div className="skeleton aspect-[3/4] w-20 shrink-0" />
            <div className="flex flex-1 flex-col gap-3 py-1">
              <div className="skeleton h-4 w-3/5" />
              <div className="skeleton h-3 w-2/5" />
              <div className="skeleton h-9 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-4 py-16 text-muted", className)}
    >
      <div className="spinner" aria-hidden="true" />
      <p className="type-eyebrow">{label}</p>
    </div>
  );
}
