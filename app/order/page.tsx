import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderListView } from "@/components/order-list/OrderListView";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Order List",
  description: "Review your shortlisted saree designs, adjust set quantities, and send your wholesale enquiry to Kunal Sarees on WhatsApp.",
  alternates: { canonical: "/order" },
  robots: { index: false, follow: true },
};

export default function OrderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Wholesale Order"
        title="Your Order List"
        description="Review your shortlisted saree designs, check per-piece rates and set quantities, then proceed to checkout to send your enquiry directly to our Surat team on WhatsApp."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Order List" }]}
      />
      <section className="section-y-sm">
        <Container>
          <OrderListView />
        </Container>
      </section>
    </>
  );
}
