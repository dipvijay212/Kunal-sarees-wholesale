import type { Metadata } from "next";
import { OrderPageContent } from "@/components/order-list/OrderPageContent";

export const metadata: Metadata = {
  title: "Order List",
  description: "Review and manage your wholesale saree order list.",
  alternates: { canonical: "/order" },
  robots: { index: false, follow: true },
};

export default function OrderPage() {
  return <OrderPageContent />;
}

