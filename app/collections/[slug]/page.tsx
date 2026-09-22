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
      <header className="relative isolate overflow-hidden border-b border-line bg-[#2E0A12] text-canvas">
        {/* Background Image & Atmospheric Luxury Gradient Overlay */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <RemoteImage
            src={collection.image.url}
            alt={collection.image.alt}
            fill
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-20 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#20040A] via-[#2E0A12]/95 to-[#2E0A12]/80 lg:to-[#2E0A12]/50" />
          <div className="absolute inset-0 bg-linear-to-t from-[#20040A] via-transparent to-black/30" />
        </div>

        <div className="container-page pt-6 pb-12 lg:pt-8 lg:pb-16">
          <Breadcrumbs
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: collection.name },
            ]}
          />

          <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            {/* Left Content Column */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-light backdrop-blur-xs">
                <span className="size-1.5 rounded-full bg-gold-light animate-pulse" />
                <span>{collection.tagline}</span>
              </div>

              <h1 className="mt-3.5 font-serif text-3xl font-normal tracking-tight text-cream sm:text-4xl lg:text-5xl">
                {collection.name}
              </h1>

              <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-cream/90 sm:text-lg">
                {collection.description}
              </p>

              {prices.length > 0 ? (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-xs border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-cream backdrop-blur-xs">
                    {collectionProducts.length} {collectionProducts.length === 1 ? "Design" : "Designs"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xs border border-gold/40 bg-gold/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-light">
                    Wholesale: {formatPrice(Math.min(...prices))} – {formatPrice(Math.max(...prices))} / piece
                  </span>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs text-cream/75">
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-gold-light">✓</span> Master Weaver Direct
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-gold-light">✓</span> Ready Stock for Dispatch
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-gold-light">✓</span> Live Video Preview on WhatsApp
                </span>
              </div>
            </div>

            {/* Right Featured Weave Showcase Card (Desktop) */}
            <div className="hidden lg:col-span-5 lg:block xl:col-span-4">
              <div className="group relative mx-auto aspect-[4/5] max-w-xs overflow-hidden rounded-xs border-2 border-gold/30 bg-maroon-dark shadow-2xl">
                <RemoteImage
                  src={collection.image.url}
                  alt={collection.image.alt}
                  fill
                  sizes="(min-width: 1024px) 320px, 100vw"
                  loading="eager"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute right-4 bottom-4 left-4 text-cream">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-widest text-gold-light">
                    Curated Wholesale Edit
                  </span>
                  <p className="mt-0.5 font-serif text-lg font-normal text-cream">
                    {collection.name}
                  </p>
                </div>
              </div>
            </div>
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
