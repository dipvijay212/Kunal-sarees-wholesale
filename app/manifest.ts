import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kunal Sarees — Wholesale & Admin Portal",
    short_name: "Kunal Sarees",
    description: "दुकानदारों, बुटीक और होलसेल खरीदारों के लिए प्रीमियम होलसेल साड़ियों का खास कलेक्शन एवं एडमिन पोर्टल।",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    orientation: "any",
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
    shortcuts: [
      {
        name: "Admin Dashboard",
        url: "/admin",
        description: "Direct access to Kunal Sarees Admin Portal",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Orders Management",
        url: "/admin/orders",
        description: "Manage wholesale customer orders",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
