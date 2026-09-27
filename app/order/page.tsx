import type { Metadata } from "next";
import { OrderPageContent } from "@/components/order-list/OrderPageContent";

export const metadata: Metadata = {
  title: "आपकी ऑर्डर लिस्ट | Order List | Kunal Sarees",
  description: "Review and manage your wholesale saree order list.",
  alternates: { canonical: "/order" },
  robots: { index: false, follow: true },
};

export default function OrderPage() {
  return <OrderPageContent />;
}

