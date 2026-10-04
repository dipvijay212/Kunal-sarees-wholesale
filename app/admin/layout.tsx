import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

// Private screen: keep it out of search results. Links to dedicated Admin PWA manifest.
export const metadata: Metadata = {
  ...noIndexMetadata,
  title: "Kunal Sarees — Admin Portal",
  manifest: "/admin-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "KS Admin",
    statusBarStyle: "black-translucent",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

