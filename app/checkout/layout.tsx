import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

// Private screen: keep it out of search results. Renders children unchanged.
export const metadata: Metadata = noIndexMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
