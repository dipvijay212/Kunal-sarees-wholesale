"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGE_URL } from "@/data/images";

type RemoteImageProps = Omit<ImageProps, "src" | "onError"> & { src: string };

/**
 * next/image with graceful fallback: if the remote file fails to load (offline,
 * CDN error, expired URL), a local placeholder is shown instead of a blank box.
 * The failure is tracked per `src`, so changing the image clears it.
 */
export function RemoteImage({ src, alt, ...props }: RemoteImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasFailed = failedSrc === src;

  return (
    <Image
      src={hasFailed ? FALLBACK_IMAGE_URL : src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      {...props}
    />
  );
}
