import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SparkleIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getAllProducts, getNewArrivals } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest wholesale saree designs added to the Kunal Sarees catalogue this season.",
  alternates: { canonical: "/new-arrivals" },
};

export default function NewArrivalsPage() {
  const newArrivals = getNewArrivals(getAllProducts().length);

  return (
    <>
      <PageHeader
        eyebrow="Just in"
        title="New arrivals"
        description="Fresh designs added to the catalogue this season. Ask on WhatsApp for early access to upcoming sets."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "New arrivals" }]}
      />

      <section aria-label="New designs" className="section-y-sm">
        <Container>
          {newArrivals.length > 0 ? (
            <ProductGrid products={newArrivals} eagerCount={4} />
          ) : (
            <EmptyState
              icon={<SparkleIcon size={26} />}
              title="New designs are on the way"
              description="Our next sets are being finalised. Ask on WhatsApp to hear first."
              action={<WhatsAppButton label="Ask on WhatsApp" />}
            />
          )}

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center">
            <p className="max-w-lg text-muted">Looking for something specific? Browse every design in the catalogue.</p>
            <Button href="/products?sort=newest" variant="secondary">
              Full catalogue
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
