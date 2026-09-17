import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderListView } from "@/components/order-list/OrderListView";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Order List",
  description: "Review your shortlisted designs and send your wholesale order to Kunal Sarees on WhatsApp.",
  robots: { index: false, follow: true },
};

export default function OrderListPage() {
  return (
    <>
      <PageHeader
        eyebrow="Wholesale"
        title="Your order list"
        description="Adjust quantities, then send the full list to our team on WhatsApp. We confirm availability and final pricing before anything is dispatched."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Order list" }]}
      />
      <section className="section-y-sm">
        <Container>
          <OrderListView />
        </Container>
      </section>
    </>
  );
}
