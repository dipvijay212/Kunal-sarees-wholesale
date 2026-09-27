import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "हमसे बात करें | Contact Us | Kunal Sarees",
  description: "Connect with Kunal Sarees via WhatsApp, Phone or Visit our Surat Wholesale Hub.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageContent />;
}

