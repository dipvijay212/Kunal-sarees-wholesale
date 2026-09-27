import type { Metadata } from "next";
import { WholesalePageContent } from "@/components/wholesale/WholesalePageContent";

export const metadata: Metadata = {
  title: "होलसेल साड़ियां | Wholesale Sarees | Kunal Sarees",
  description:
    "Direct Surat saree wholesale partner for boutiques and retail stores. Transparent rates and flexible MOQs.",
  alternates: { canonical: "/wholesale" },
};

export default function WholesalePage() {
  return <WholesalePageContent />;
}

