"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { cn } from "@/lib/cn";
import type { ProductImage } from "@/types";

interface ProductImageGalleryProps {
  images: ProductImage[];
  videoUrl?: string;
  productName: string;
  className?: string;
}

const SWIPE_THRESHOLD_PX = 40;

function getEmbedVideoUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  return null;
}

export function ProductImageGallery({ images, videoUrl, productName, className }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [isZoomOpen, setZoomOpen] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  const total = images.length;
  const hasMultiple = total > 1 || Boolean(videoUrl);
  const activeImage = images[activeIndex] || images[0];

  if (!activeImage && !videoUrl) return null;

  const goTo = (index: number) => {
    setIsVideoSelected(false);
    setActiveIndex((index + total) % total);
  };
  const previous = () => {
    if (isVideoSelected) {
      setIsVideoSelected(false);
      setActiveIndex(total - 1);
    } else {
      goTo(activeIndex - 1);
    }
  };
  const next = () => {
    if (isVideoSelected) {
      setIsVideoSelected(false);
      setActiveIndex(0);
    } else {
      goTo(activeIndex + 1);
    }
  };

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
    if (event.pointerType === "mouse" || isVideoSelected) return;
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (isVideoSelected) return;
    const startX = pointerStartX.current;
    pointerStartX.current = null;
    if (startX === null || !hasMultiple) return;
    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) next();
    else previous();
  };

  const embedUrl = videoUrl ? getEmbedVideoUrl(videoUrl) : null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${productName} की फोटो व वीडियो`}
      onKeyDown={handleKeyDown}
      className={cn("flex flex-col gap-4 lg:flex-row-reverse lg:items-start lg:gap-5", className)}
    >
      {/* Main stage */}
      <div className="relative flex-1">
        <div
          className="media-frame aspect-[3/4] touch-pan-y rounded-xs select-none bg-canvas-deep"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStartX.current = null;
          }}
        >
          {isVideoSelected && videoUrl ? (
            <div className="size-full flex items-center justify-center bg-black rounded-xs overflow-hidden">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${productName} Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="size-full border-0"
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="size-full object-contain"
                />
              )}
            </div>
          ) : (
            images.map((image, index) => (
              <RemoteImage
                key={image.url}
                src={image.url}
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
            ))
          )}
        </div>

        {!isVideoSelected && activeImage ? (
          <IconButton
            label="बड़ी फोटो देखें"
            icon={<ExpandIcon size={18} />}
            onClick={() => setZoomOpen(true)}
            variant="overlay"
            aria-haspopup="dialog"
            className="absolute top-3 right-3"
          />
        ) : null}

        {videoUrl && !isVideoSelected ? (
          <button
            type="button"
            onClick={() => setIsVideoSelected(true)}
            className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-accent-deep transition-transform hover:scale-105"
          >
            <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Video
          </button>
        ) : null}

        {hasMultiple && !isVideoSelected ? (
          <>
            <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
              <IconButton
                label="पिछली फोटो"
                icon={<ChevronLeftIcon size={20} />}
                onClick={previous}
                variant="overlay"
                className="pointer-events-auto"
              />
              <IconButton
                label="अगली फोटो"
                icon={<ChevronRightIcon size={20} />}
                onClick={next}
                variant="overlay"
                className="pointer-events-auto"
              />
            </div>
            <p
              aria-live="polite"
              className="absolute bottom-4 left-4 rounded-xs bg-accent-deep/90 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.14em] text-canvas tabular-nums shadow-xs"
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
            const isActive = !isVideoSelected && index === activeIndex;
            return (
              <li key={image.url} className="w-20 shrink-0 lg:w-full">
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`फोटो ${index + 1} of ${total} देखें`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "media-frame block aspect-[3/4] w-full rounded-xs border transition-[border-color,opacity] duration-300",
                    isActive ? "border-accent ring-1 ring-accent opacity-100" : "border-line opacity-60 hover:opacity-100",
                  )}
                >
                  <RemoteImage src={image.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              </li>
            );
          })}

          {/* Video Thumbnail Button */}
          {videoUrl ? (
            <li className="w-20 shrink-0 lg:w-full">
              <button
                type="button"
                onClick={() => setIsVideoSelected(true)}
                aria-label="प्रोडक्ट वीडियो देखें"
                aria-current={isVideoSelected ? "true" : undefined}
                className={cn(
                  "media-frame relative flex flex-col items-center justify-center aspect-[3/4] w-full rounded-xs border bg-canvas-deep transition-[border-color,opacity] duration-300",
                  isVideoSelected ? "border-accent ring-1 ring-accent opacity-100 bg-accent/10" : "border-line opacity-75 hover:opacity-100",
                )}
              >
                <div className="size-7 rounded-full bg-accent text-white flex items-center justify-center shadow-xs">
                  <svg className="size-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold mt-1 text-ink">Video</span>
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}

      {activeImage ? (
        <Modal
          open={isZoomOpen}
          onClose={() => setZoomOpen(false)}
          title={activeImage.alt}
          hideHeader
          size="full"
        >
          <div className="relative flex h-full items-center justify-center p-4 sm:p-10">
            <div className="relative aspect-[3/4] h-full max-h-full max-w-full">
              <RemoteImage src={activeImage.url} alt={activeImage.alt} fill sizes="100vw" className="object-contain" />
            </div>
            {hasMultiple ? (
              <div className="absolute inset-x-4 bottom-6 flex items-center justify-center gap-4 sm:inset-x-10">
                <IconButton label="पिछली फोटो" icon={<ChevronLeftIcon size={20} />} onClick={previous} variant="overlay" />
                <p className="min-w-16 text-center text-xs font-semibold tracking-[0.14em] text-muted tabular-nums">
                  {activeIndex + 1} / {total}
                </p>
                <IconButton label="अगली फोटो" icon={<ChevronRightIcon size={20} />} onClick={next} variant="overlay" />
              </div>
            ) : null}
          </div>
        </Modal>
      ) : null}
    </section>
  );
}
