import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { CatalogueBrowser } from "@/components/product/CatalogueBrowser";
import { LoadingState } from "@/components/ui/LoadingState";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import { getCollectionBySlug, getCollections, getProductsByCollection } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return getCollections().map((collection) => ({ slug: collection.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};

  return {
    title: `${collection.name} — Wholesale Sarees`,
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

  const collectionProducts = getProductsByCollection(collection.id);
  const prices = collectionProducts.map((product) => product.price);

  return (
    <>
      {/* COLLECTION HERO */}
      <header className="relative isolate overflow-hidden border-b border-line bg-accent-deep text-canvas">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <RemoteImage
            src={collection.image.url}
            alt={collection.image.alt}
            fill
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-r from-accent-deep via-accent-deep/90 to-accent-deep/40" />
        </div>
        <div className="container-page pt-6 pb-16 lg:pt-8 lg:pb-24">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: collection.name },
            ]}
          />
          <div className="mt-10 max-w-2xl lg:mt-14">
            <p className="type-eyebrow text-gold-light uppercase tracking-[0.15em] font-medium">{collection.tagline}</p>
            <h1 className="type-h1 mt-3 text-cream font-serif font-normal">{collection.name}</h1>
            <p className="type-lead mt-4 text-cream/90 font-sans">{collection.description}</p>
            {prices.length > 0 ? (
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-cream/90">
                <span className="rounded-xs border border-white/20 bg-white/10 px-3.5 py-1 backdrop-blur-xs font-medium text-cream text-xs uppercase tracking-wider">
                  {collectionProducts.length} {collectionProducts.length === 1 ? "Saree" : "Sarees"}
                </span>
                <span className="font-semibold text-gold-light">
                  {formatPrice(Math.min(...prices))} – {formatPrice(Math.max(...prices))} / piece
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* COLLECTION PRODUCTS WITH SEARCH, FILTER, SORT & PAGINATION */}
      <section aria-label={`${collection.name} catalogue`} className="section-y-sm">
        <div className="container-page">
          <Suspense fallback={<LoadingState variant="products" count={6} label="Loading collection" />}>
            <CatalogueBrowser products={collectionProducts} defaultCollectionId={collection.id} />
          </Suspense>

          {/* WHATSAPP CATALOGUE ENQUIRY CTA */}
          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center lg:mt-24">
            <div>
              <h3 className="font-display text-xl text-ink">Need custom sets or color variations?</h3>
              <p className="mt-1 max-w-lg text-sm text-muted">
                Our wholesale desk provides custom colorways, weaver bulk discounts, and live video previews on WhatsApp.
              </p>
            </div>
            <WhatsAppButton
              variant="secondary"
              label="Request Full Catalogue"
              message={`Hello ${siteConfig.name}, please share the complete ${collection.name} catalogue with wholesale rates.`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
