"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import type { ProductImage } from "@/types";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

const SWIPE_THRESHOLD_PX = 40;

export function ProductImageGallery({ images, productName, className }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setZoomOpen] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  const total = images.length;
  const hasMultiple = total > 1;
  const activeImage = images[activeIndex];

  if (!activeImage) return null;

  const goTo = (index: number) => setActiveIndex((index + total) % total);
  const previous = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!hasMultiple) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const startX = pointerStartX.current;
    pointerStartX.current = null;
    if (startX === null || !hasMultiple) return;
    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) next();
    else previous();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${productName} images`}
      onKeyDown={handleKeyDown}
      className={cn("flex flex-col gap-4 lg:flex-row-reverse lg:items-start lg:gap-5", className)}
    >
      {/* Main stage */}
      <div className="relative flex-1">
        <div
          className="media-frame aspect-[3/4] touch-pan-y rounded-xs select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStartX.current = null;
          }}
        >
          {images.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              draggable={false}
              aria-hidden={index !== activeIndex}
              className={cn(
                "object-cover transition-opacity duration-500 ease-luxe",
                index === activeIndex ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>

        <IconButton
          label="View larger image"
          icon={<ExpandIcon size={18} />}
          onClick={() => setZoomOpen(true)}
          variant="overlay"
          aria-haspopup="dialog"
          className="absolute top-3 right-3"
        />

        {hasMultiple ? (
          <>
            <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
              <IconButton
                label="Previous image"
                icon={<ChevronLeftIcon size={20} />}
                onClick={previous}
                variant="overlay"
                className="pointer-events-auto"
              />
              <IconButton
                label="Next image"
                icon={<ChevronRightIcon size={20} />}
                onClick={next}
                variant="overlay"
                className="pointer-events-auto"
              />
            </div>
            <p
              aria-live="polite"
              className="absolute bottom-4 left-4 rounded-xs bg-charcoal-950/80 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.14em] text-ink tabular-nums"
            >
              {activeIndex + 1} / {total}
            </p>
          </>
        ) : null}
      </div>

      {/* Thumbnails */}
      {hasMultiple ? (
        <ul className="scrollbar-none flex gap-3 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible">
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={image.src} className="w-20 shrink-0 lg:w-full">
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show image ${index + 1} of ${total}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "media-frame block aspect-[3/4] w-full rounded-xs border transition-[border-color,opacity] duration-300",
                    isActive ? "border-silver-200 opacity-100" : "border-transparent opacity-55 hover:opacity-100",
                  )}
                >
                  <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <Modal
        open={isZoomOpen}
        onClose={() => setZoomOpen(false)}
        title={activeImage.alt}
        hideHeader
        size="full"
      >
        <div className="relative flex h-full items-center justify-center p-4 sm:p-10">
          <div className="relative aspect-[3/4] h-full max-h-full max-w-full">
            <Image src={activeImage.src} alt={activeImage.alt} fill sizes="100vw" className="object-contain" />
          </div>
          {hasMultiple ? (
            <div className="absolute inset-x-4 bottom-6 flex items-center justify-center gap-4 sm:inset-x-10">
              <IconButton label="Previous image" icon={<ChevronLeftIcon size={20} />} onClick={previous} variant="overlay" />
              <p className="min-w-16 text-center text-xs font-semibold tracking-[0.14em] text-muted tabular-nums">
                {activeIndex + 1} / {total}
              </p>
              <IconButton label="Next image" icon={<ChevronRightIcon size={20} />} onClick={next} variant="overlay" />
            </div>
          ) : null}
        </div>
      </Modal>
    </section>
  );
}
