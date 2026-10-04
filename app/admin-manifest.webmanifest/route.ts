export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export async function GET() {
  const adminManifest = {
    name: "Kunal Sarees — Admin Portal",
    short_name: "KS Admin",
    description: "कुणाल साड़ी थोक व्यापार एडमिन एवं ऑर्डर मैनेजमेंट ऐप",
    start_url: "/admin",
    scope: "/admin",
    id: "/admin-portal-pwa",
    display: "standalone",
    orientation: "any",
    background_color: "#1C1917",
    theme_color: "#6E1F2A",
    icons: [
      {
        src: "/admin/icon-admin-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/admin/icon-admin-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Orders Management",
        url: "/admin/orders",
        description: "Manage wholesale customer orders",
        icons: [{ src: "/admin/icon-admin-192.png", sizes: "192x192" }],
      },
      {
        name: "Products & Stock",
        url: "/admin/products",
        description: "View and edit saree catalog",
        icons: [{ src: "/admin/icon-admin-192.png", sizes: "192x192" }],
      },
      {
        name: "Customers",
        url: "/admin/customers",
        description: "View registered wholesale buyers",
        icons: [{ src: "/admin/icon-admin-192.png", sizes: "192x192" }],
      },
      {
        name: "Settings & Profile",
        url: "/admin/settings",
        description: "Business settings and contact info",
        icons: [{ src: "/admin/icon-admin-192.png", sizes: "192x192" }],
      },
    ],
  };

  return new Response(JSON.stringify(adminManifest, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
