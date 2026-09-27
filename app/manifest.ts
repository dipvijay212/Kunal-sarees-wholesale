import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kunal Sarees — प्रीमियम होलसेल साड़ियां",
    short_name: "Kunal Sarees",
    description: "दुकानदारों, बुटीक और होलसेल खरीदारों के लिए प्रीमियम होलसेल साड़ियों का खास कलेक्शन।",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF5EE",
    theme_color: "#6E1F2A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
