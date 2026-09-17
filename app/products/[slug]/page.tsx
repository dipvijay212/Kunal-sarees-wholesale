import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { StockStatusLabel } from "@/components/product/StockStatusLabel";
import { Badge } from "@/components/ui/Badge";
import { CheckIcon, PackageIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { getAllProducts, getCollectionBySlug, getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} — ${product.fabric} Saree Wholesale`;
  return {
    title,
    description: `${product.description} Wholesale from ${formatPrice(product.pricing.pricePerPiece)} per piece.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const collection = getCollectionBySlug(product.collectionSlug);
  const related = getRelatedProducts(product, 4);

  const specifications = [
    { label: "Design code", value: product.sku },
    { label: "Fabric", value: product.fabric },
    { label: "Work", value: product.work },
    { label: "Colour", value: product.color.name },
    { label: "Saree length", value: product.specifications.sareeLength },
    { label: "Blouse piece", value: product.specifications.blousePiece },
    { label: "Weight", value: product.specifications.weight },
    { label: "Origin", value: product.specifications.origin },
    { label: "Care", value: product.specifications.washCare },
  ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    color: product.color.name,
    material: product.fabric,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.pricing.pricePerPiece,
      availability:
        product.stockStatus === "made-to-order" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      url: `${siteConfig.url}/products/${product.slug}`,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: product.pricing.minimumOrderQuantity,
        unitText: "piece",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="container-page pt-6 lg:pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            ...(collection
              ? [{ label: collection.name, href: `/collections/${collection.slug}` }]
              : [{ label: "Catalogue", href: "/products" }]),
            { label: product.name },
          ]}
        />
      </div>

      <section className="container-page grid gap-10 pt-6 pb-16 lg:grid-cols-12 lg:gap-14 lg:pt-8 lg:pb-24 xl:gap-20">
        <div className="lg:col-span-7">
          <div className="lg:top-header lg:sticky">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>
        </div>

        <div className="flex flex-col lg:col-span-5">
          <div className="flex flex-wrap gap-2">
            {product.isNew ? <Badge variant="accent">New arrival</Badge> : null}
            {product.isBestseller ? <Badge variant="solid">Bestseller</Badge> : null}
            <Badge variant="outline">{product.fabric}</Badge>
          </div>

          <h1 className="type-h1 mt-5 text-ink">{product.name}</h1>
          <p className="mt-3 text-sm text-muted">
            Design code <span className="font-semibold text-ink">{product.sku}</span>
            {collection ? (
              <>
                {" · "}
                <Link
                  href={`/collections/${collection.slug}`}
                  className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                >
                  {collection.name}
                </Link>
              </>
            ) : null}
          </p>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y border-line py-6">
            <p className="type-price text-3xl text-ink">{formatPrice(product.pricing.pricePerPiece)}</p>
            <p className="text-sm text-muted">per piece · wholesale, excl. GST</p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <StockStatusLabel status={product.stockStatus} />
            <p className="flex items-center gap-2.5 text-sm text-muted">
              <span
                aria-hidden="true"
                className="size-4 rounded-full border border-line-strong"
                style={{ backgroundColor: product.color.hex }}
              />
              Colour: <span className="text-ink">{product.color.name}</span>
            </p>
          </div>

          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8">
            <ProductPurchasePanel product={product} />
          </div>

          <ul className="mt-10 grid gap-4 border-t border-line pt-8 text-sm text-muted sm:grid-cols-2">
            <li className="flex items-start gap-3">
              <ShieldCheckIcon size={20} className="shrink-0 text-accent" />
              Every piece quality checked before dispatch
            </li>
            <li className="flex items-start gap-3">
              <PackageIcon size={20} className="shrink-0 text-accent" />
              Packed securely for transit across India
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="details-heading" className="border-t border-line bg-canvas-deep">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-14 lg:py-24 xl:gap-20">
          <div className="lg:col-span-5">
            <h2 id="details-heading" className="type-h3 text-ink">
              Design details
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-muted">
                  <CheckIcon size={18} className="mt-1 shrink-0 text-accent" />
                  {highlight}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              {product.occasions.map((occasion) => (
                <Link key={occasion} href={`/products?occasion=${encodeURIComponent(occasion)}`} className="chip">
                  {occasion}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="type-eyebrow text-muted">Specifications</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {specifications.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-4 text-sm">
                  <dt className="text-muted">{spec.label}</dt>
                  <dd className="text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-subtle">
              Colours may vary slightly between screens and dye lots. Ask for a live video on WhatsApp before ordering.
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="section-y">
          <div className="container-page">
            <SectionHeading
              id="related-heading"
              eyebrow="Complete the assortment"
              title="You may also stock"
              action={collection ? { label: `More from ${collection.name}`, href: `/collections/${collection.slug}` } : undefined}
            />
            <ProductGrid products={related} className="mt-12" />
          </div>
        </section>
      ) : null}
    </>
  );
}
