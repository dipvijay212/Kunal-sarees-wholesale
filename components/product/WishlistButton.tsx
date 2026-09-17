"use client";

import { IconButton } from "@/components/ui/IconButton";
import { HeartIcon } from "@/components/ui/Icons";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/cn";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  /** `overlay` sits on product imagery; `inline` is a text button. */
  variant?: "overlay" | "inline";
  className?: string;
}

export function WishlistButton({ productId, productName, variant = "overlay", className }: WishlistButtonProps) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(productId);
  const heart = (
    <HeartIcon size={18} fill={saved ? "currentColor" : "none"} className={saved ? "text-ice-300" : undefined} />
  );

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        aria-pressed={saved}
        className={cn("btn btn--ghost btn--sm gap-2 px-3", className)}
      >
        {heart}
        {saved ? "Saved" : "Save design"}
      </button>
    );
  }

  return (
    <IconButton
      label={`Save ${productName}`}
      icon={heart}
      onClick={() => toggle(productId)}
      aria-pressed={saved}
      variant="overlay"
      size="sm"
      className={className}
    />
  );
}
