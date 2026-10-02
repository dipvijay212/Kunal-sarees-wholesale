import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact Kunal Sarees, a wholesale saree supplier in Surat, on WhatsApp or phone for stock availability, catalogue videos, pricing and bulk orders.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}

