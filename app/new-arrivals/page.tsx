import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { NewArrivalsPageContent } from "@/components/product/NewArrivalsPageContent";
import { fetchNewArrivals } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = pageMetadata({
  title: "New Arrivals",
  description:
    "See the latest wholesale saree designs added to the Kunal Sarees catalogue, supplied from Surat to boutiques and retailers across India.",
  path: "/new-arrivals",
});

export default async function NewArrivalsPage() {
  const newArrivals = await fetchNewArrivals();
  return <NewArrivalsPageContent newArrivals={newArrivals} />;
}
