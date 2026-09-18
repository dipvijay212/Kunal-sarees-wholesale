import type { ProductImage } from "@/types";

/*
 * Development imagery.
 *
 * Photos are served from the Unsplash CDN, which is stable and accepts the
 * sizing parameters below. Every photo id used in this project was checked to
 * return a real image. When real product photography is available, swap the
 * `url` values (or point `unsplashImage` at your own CDN) — nothing else in the
 * app needs to change.
 *
 * Remote hosts must also be allowed in next.config.ts (`images.remotePatterns`).
 */

const UNSPLASH_BASE = "https://images.unsplash.com/photo-";

/** Portrait frame used by product and collection imagery (3:4). */
export const PORTRAIT = { width: 900, height: 1200 } as const;

/** Landscape frame used by category cards and banners (4:3). */
export const LANDSCAPE = { width: 1200, height: 900 } as const;

/** Shown when a remote image fails to load; see components/ui/RemoteImage.tsx. */
export const FALLBACK_IMAGE_URL = "/images/fallback/product.svg";

export function unsplashImage(
  photoId: string,
  alt: string,
  { width, height }: { width: number; height: number } = PORTRAIT,
): ProductImage {
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    crop: "entropy",
    w: String(width),
    h: String(height),
    q: "80",
  });

  return { url: `${UNSPLASH_BASE}${photoId}?${params.toString()}`, alt, width, height };
}
