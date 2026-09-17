import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { WishlistView } from "@/components/product/WishlistView";

export const metadata: Metadata = {
  title: "Saved Designs",
  description: "Designs you have saved while browsing the Kunal Sarees wholesale catalogue.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shortlist"
        title="Saved designs"
        description="A private shortlist kept on this device. Add quantities from any design page when you are ready to enquire."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Saved designs" }]}
      />
      <section className="section-y-sm">
        <div className="container-page">
          <WishlistView />
        </div>
      </section>
    </>
  );
}
