"use client";

import type { ImageLoaderProps } from "next/image";

/*
 * Global next/image loader (see `images.loaderFile` in next.config.ts).
 *
 * Images are resized by the CDN they already live on instead of Vercel's
 * /_next/image optimizer, so they don't count against Vercel's
 * Image Optimization quota.
 */

const CLOUDINARY_UPLOAD = "/image/upload/";

export default function imageLoader({ src, width }: ImageLoaderProps): string {
  if (!/^https?:\/\//i.test(src)) return src;

  const url = new URL(src);

  // Cloudinary: insert a transformation right after /image/upload/. Chaining keeps any
  // transformation already present in the stored URL.
  if (url.hostname.endsWith("cloudinary.com") && url.pathname.includes(CLOUDINARY_UPLOAD)) {
    const transform = `f_auto,q_auto,c_limit,w_${width}`;
    url.pathname = url.pathname.replace(CLOUDINARY_UPLOAD, `${CLOUDINARY_UPLOAD}${transform}/`);
    return url.toString();
  }

  // Unsplash (development imagery): resize via its query params, keeping the aspect ratio
  // of a fixed w/h crop.
  if (url.hostname === "images.unsplash.com") {
    const baseWidth = Number(url.searchParams.get("w"));
    const baseHeight = Number(url.searchParams.get("h"));
    if (baseWidth && baseHeight) {
      url.searchParams.set("h", String(Math.round((baseHeight * width) / baseWidth)));
    }
    url.searchParams.set("w", String(width));
    url.searchParams.set("auto", "format");
    return url.toString();
  }

  // Any other host is served as-is.
  return src;
}
