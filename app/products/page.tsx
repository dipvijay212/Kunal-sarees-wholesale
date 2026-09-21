import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogueBrowser } from "@/components/product/CatalogueBrowser";
import { LoadingState } from "@/components/ui/LoadingState";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Wholesale Catalogue",
  description:
    "Browse the full Kunal Sarees wholesale catalogue with per-piece pricing and minimum order quantities for every design.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const products = getProducts();

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Browse Our Sarees"
        description="Explore handcrafted Banarasi, Kanjivaram silk, georgette, and festive sarees curated for boutiques and retailers."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sarees" }]}
      />
      <section className="section-y-sm">
        <div className="container-page">
          {/* useSearchParams in CatalogueBrowser requires a Suspense boundary for static rendering */}
          <Suspense fallback={<LoadingState variant="products" count={8} label="Loading catalogue" />}>
            <CatalogueBrowser products={products} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
