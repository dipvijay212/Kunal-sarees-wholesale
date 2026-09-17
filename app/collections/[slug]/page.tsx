import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SparkleIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import { getAllCollections, getCollectionBySlug, getProductsByCollection } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return getAllCollections().map((collection) => ({ slug: collection.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};

  return {
    title: `${collection.name} — Wholesale`,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.name} | ${siteConfig.name}`,
      description: collection.description,
    },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getProductsByCollection(collection.slug);
  const prices = products.map((product) => product.pricing.pricePerPiece);

  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src={collection.image.src}
            alt=""
            fill
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-r from-charcoal-950 via-charcoal-950/80 to-charcoal-950/20" />
        </div>
        <div className="container-page pt-6 pb-16 lg:pt-8 lg:pb-24">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: collection.name },
            ]}
          />
          <div className="mt-14 max-w-2xl lg:mt-20">
            <p className="type-eyebrow text-accent-strong">{collection.tagline}</p>
            <h1 className="type-h1 mt-5 text-ink">{collection.name}</h1>
            <p className="type-lead mt-6 text-muted">{collection.description}</p>
            {prices.length > 0 ? (
              <p className="mt-8 text-sm text-ink">
                {products.length} {products.length === 1 ? "design" : "designs"} · {formatPrice(Math.min(...prices))} –{" "}
                {formatPrice(Math.max(...prices))} per piece
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <section aria-label={`${collection.name} designs`} className="section-y-sm">
        <div className="container-page">
          {products.length > 0 ? (
            <ProductGrid products={products} eagerCount={4} />
          ) : (
            <EmptyState
              icon={<SparkleIcon size={26} />}
              title="New designs are on the way"
              description="This collection is being restocked. Ask our team on WhatsApp for the latest catalogue."
              action={
                <>
                  <WhatsAppButton label="Ask on WhatsApp" />
                  <Button href="/products" variant="secondary">
                    Browse catalogue
                  </Button>
                </>
              }
            />
          )}

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center lg:mt-24">
            <p className="max-w-lg text-muted">
              Looking for more colourways or a custom set in {collection.name.toLowerCase()}? Our team shares full
              catalogues on WhatsApp.
            </p>
            <WhatsAppButton
              variant="secondary"
              label="Request catalogue"
              message={`Hello ${siteConfig.name}, please share the full ${collection.name} catalogue with wholesale prices.`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
