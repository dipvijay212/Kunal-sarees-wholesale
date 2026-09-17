"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { normalizeQuantity } from "@/lib/quantity";
import { MinusIcon, PlusIcon } from "./Icons";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Quantities snap to multiples of this value. */
  step?: number;
  size?: "sm" | "md";
  /** Accessible label. Shown visually when `showLabel` is true. */
  label?: string;
  showLabel?: boolean;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  size = "md",
  label = "Quantity",
  showLabel = false,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const inputId = useId();
  // Holds in-progress typing; `null` means the input shows the committed value.
  const [draft, setDraft] = useState<string | null>(null);
  const rules = { min, max, step };

  const commit = (next: number) => {
    const normalized = normalizeQuantity(next, rules);
    setDraft(null);
    if (normalized !== value) onChange(normalized);
  };

  const commitDraft = () => {
    if (draft === null) return;
    commit(draft.trim() === "" ? value : Number(draft));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitDraft();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      commit(value + step);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      commit(value - step);
    }
  };

  const isSmall = size === "sm";
  const buttonClass = cn(
    "flex shrink-0 items-center justify-center text-ink transition-colors",
    "hover:bg-surface-muted disabled:text-subtle disabled:opacity-50 disabled:hover:bg-transparent",
    isSmall ? "size-9" : "size-12",
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className={showLabel ? "field-label" : "sr-only"}>
        {label}
      </label>
      <div
        className={cn(
          "inline-flex w-fit items-stretch rounded-xs border border-line-strong bg-field",
          disabled && "opacity-50",
        )}
      >
        <button
          type="button"
          className={buttonClass}
          onClick={() => commit(value - step)}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${label.toLowerCase()} by ${step}`}
          aria-controls={inputId}
        >
          <MinusIcon size={isSmall ? 14 : 16} />
        </button>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={draft ?? String(value)}
          onChange={(event) => setDraft(event.target.value.replace(/\D/g, ""))}
          onBlur={commitDraft}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          className={cn(
            "type-price border-x border-line-strong bg-transparent text-center text-ink focus:outline-none focus-visible:bg-accent-soft",
            isSmall ? "w-12 text-sm" : "w-16 text-base",
          )}
        />
        <button
          type="button"
          className={buttonClass}
          onClick={() => commit(value + step)}
          disabled={disabled || value + step > max}
          aria-label={`Increase ${label.toLowerCase()} by ${step}`}
          aria-controls={inputId}
        >
          <PlusIcon size={isSmall ? 14 : 16} />
        </button>
      </div>
    </div>
  );
}
