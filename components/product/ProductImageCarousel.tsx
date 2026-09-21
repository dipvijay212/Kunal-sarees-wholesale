"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FALLBACK_IMAGE_URL } from "@/data/images";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { cn } from "@/lib/cn";
import type { ProductImage } from "@/types";

/**
 * Timing constants for the premium product card hover slideshow.
 * Modifiable in one central place.
 */
export const HOVER_DELAY = 400; // ms before starting the slideshow
export const IMAGE_INTERVAL = 1400; // ms display duration per image
export const FADE_DURATION = 700; // ms crossfade transition duration

export interface ProductImageCarouselProps {
  images?: ProductImage[];
  alt: string;
  eager?: boolean;
  sizes?: string;
  className?: string;
  /**
   * When provided by parent (e.g. ProductCard), controls the hover state
   * from the entire card boundary rather than just the image frame.
   */
  isHovered?: boolean;
}

const DEFAULT_SIZES = "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

export function ProductImageCarousel({
  images = [],
  alt,
  eager = false,
  sizes = DEFAULT_SIZES,
  className,
  isHovered: controlledIsHovered,
}: ProductImageCarouselProps) {
  const [internalHovered, setInternalHovered] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(0);

  const hoverDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const preloadedRef = useRef<boolean>(false);

  // Controlled vs Uncontrolled hover state
  const isHovered = controlledIsHovered !== undefined ? controlledIsHovered : internalHovered;
  const totalImages = images.length;
  const hasMultipleImages = totalImages > 1;

  // Active displayed image index: defaults to 0 when not hovered
  const activeIndex = isHovered && hasMultipleImages ? hoverIndex : 0;

  // Clear all active timers safely
  const clearTimers = useCallback(() => {
    if (hoverDelayTimerRef.current) {
      clearTimeout(hoverDelayTimerRef.current);
      hoverDelayTimerRef.current = null;
    }
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
      slideshowIntervalRef.current = null;
    }
  }, []);

  // Preload additional images (index 1+) once hover starts
  const preloadAdditionalImages = useCallback(() => {
    if (preloadedRef.current || !hasMultipleImages || typeof window === "undefined") return;
    preloadedRef.current = true;

    for (let i = 1; i < images.length; i++) {
      const imgUrl = images[i]?.url;
      if (imgUrl) {
        const img = new window.Image();
        img.src = imgUrl;
      }
    }
  }, [hasMultipleImages, images]);

  // Handle hover start & stop transitions
  useEffect(() => {
    if (!hasMultipleImages || !isHovered) {
      clearTimers();
      return;
    }

    // Check device capability & reduced motion preferences
    if (typeof window !== "undefined") {
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!canHover) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;
    }

    // Preload next images immediately
    preloadAdditionalImages();

    // Clear existing timers before starting new ones
    clearTimers();

    // Hover delay: wait HOVER_DELAY before switching to image 2
    hoverDelayTimerRef.current = setTimeout(() => {
      setHoverIndex(1);

      // Continuous loop every IMAGE_INTERVAL
      slideshowIntervalRef.current = setInterval(() => {
        setHoverIndex((prev) => (prev + 1) % totalImages);
      }, IMAGE_INTERVAL);
    }, HOVER_DELAY);

    return () => {
      clearTimers();
      setHoverIndex(0);
    };
  }, [isHovered, hasMultipleImages, totalImages, clearTimers, preloadAdditionalImages]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Standalone mouse handlers if not controlled by parent
  const handleMouseEnter = () => {
    if (controlledIsHovered === undefined) {
      setInternalHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (controlledIsHovered === undefined) {
      setInternalHovered(false);
    }
  };

  // Case 1: No images provided -> Fallback placeholder
  if (totalImages === 0) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <RemoteImage
          src={FALLBACK_IMAGE_URL}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  // Case 2: Single image -> Static normal view
  if (totalImages === 1) {
    const singleImage = images[0];
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <RemoteImage
          src={singleImage.url}
          alt={singleImage.alt || alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          priority={eager}
          fetchPriority={eager ? "high" : undefined}
          className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
        />
      </div>
    );
  }

  // Case 3: Multiple images -> Premium crossfade slideshow
  return (
    <div
      className={cn("relative h-full w-full overflow-hidden select-none", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image layers for smooth crossfade */}
      {images.map((img, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={img.url || index}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity ease-in-out motion-reduce:transition-none",
              isActive ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
            )}
            style={{ transitionDuration: `${FADE_DURATION}ms` }}
          >
            <RemoteImage
              src={img.url}
              alt={img.alt || alt}
              fill
              sizes={sizes}
              loading={index === 0 && eager ? "eager" : "lazy"}
              priority={index === 0 && eager}
              fetchPriority={index === 0 && eager ? "high" : undefined}
              className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
            />
          </div>
        );
      })}

      {/* Subtle luxury progress indicator dots */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-2.5 z-10 flex items-center justify-center transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
        )}
      >
        <div className="flex items-center gap-1 rounded-full bg-ink/35 px-2 py-0.5 backdrop-blur-xs shadow-xs">
          {images.map((img, idx) => (
            <span
              key={img.url || idx}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                idx === activeIndex
                  ? "w-3 bg-gold shadow-xs"
                  : "w-1 bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
