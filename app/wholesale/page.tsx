import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { WholesalePageContent } from "@/components/wholesale/WholesalePageContent";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Wholesale Sarees for Retailers & Boutiques",
  description:
    "Buy sarees wholesale from Surat with Kunal Sarees. Per-piece wholesale pricing and minimum order quantities for boutiques, retail stores and resellers.",
  path: "/wholesale",
});

export default function WholesalePage() {
  return <WholesalePageContent />;
}

