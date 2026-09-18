import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kunal Sarees — Premium Wholesale Sarees",
    short_name: "Kunal Sarees",
    description: "Premium wholesale saree collections curated for retailers, boutiques, resellers and wholesale buyers.",
    start_url: "/",
    display: "standalone",
    background_color: "#111416",
    theme_color: "#111416",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
