import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { StockStatusLabel } from "@/components/product/StockStatusLabel";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { CheckIcon, PackageIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { businessSettings } from "@/data/business";
import { siteConfig } from "@/data/site";
import {
  fetchProductBySlug,
  fetchProducts,
  getAvailability,
  getCategoryById,
  getCollectionById,
  getRelatedProducts,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  const prods = await fetchProducts();
  return prods.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} — ${product.fabric} Wholesale`,
    description: `${product.shortDescription} Wholesale from ${formatPrice(product.price)} per piece, MOQ ${product.moq}. Design code ${product.productCode}.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0].url, alt: product.images[0].alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryById(product.categoryId);
  const collection = getCollectionById(product.collectionId);
  const related = getRelatedProducts(product, 4);
  const availability = getAvailability(product);

  const specifications = [
    { label: "Design code", value: product.productCode },
    { label: "Category", value: category?.name ?? "—" },
    { label: "Fabric", value: product.fabric },
    { label: "Design / work", value: product.design },
    { label: "Colours", value: product.colors.map((color) => color.name).join(", ") },
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
    sku: product.productCode,
    description: product.description,
    material: product.fabric,
    color: product.colors.map((color) => color.name).join(", "),
    image: product.images.map((image) => image.url),
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      priceCurrency: businessSettings.currency,
      price: product.price,
      availability:
        availability === "out-of-stock" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      url: `${siteConfig.url}/products/${product.slug}`,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: product.moq,
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

      <Container className="pt-6 lg:pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            ...(category ? [{ label: category.name, href: `/products?category=${category.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </Container>

      <Container
        as="section"
        className="grid gap-10 pt-6 pb-16 lg:grid-cols-12 lg:gap-14 lg:pt-8 lg:pb-24 xl:gap-20"
      >
        <div className="lg:col-span-7">
          <div className="lg:top-header lg:sticky">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>
        </div>

        <div className="flex flex-col lg:col-span-5">
          <div className="flex flex-wrap gap-2">
            {product.newArrival ? <Badge variant="accent">NEW</Badge> : null}
            {product.featured ? <Badge variant="solid">Featured</Badge> : null}
            <Badge variant="outline">{product.fabric}</Badge>
            <Badge variant="outline">{product.design}</Badge>
          </div>

          <h1 className="type-h1 mt-4 text-ink font-serif font-normal">{product.name}</h1>
          <p className="mt-2.5 text-sm text-muted">
            Design code <span className="font-semibold text-ink">{product.productCode}</span>
            {collection ? (
              <>
                {" · "}
                <Link
                  href={`/collections/${collection.slug}`}
                  className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-maroon hover:decoration-maroon"
                >
                  {collection.name}
                </Link>
              </>
            ) : null}
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y border-line py-5">
            <p className="type-price text-3xl font-semibold text-maroon">{formatPrice(product.price)}</p>
            <p className="text-sm text-muted">per piece · wholesale, excl. GST</p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <StockStatusLabel product={product} />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
              <span>Colours:</span>
              <ul className="flex flex-wrap items-center gap-2">
                {product.variants.map((variant) => (
                  <li key={variant.id} className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="size-4 rounded-full border border-line-strong"
                      style={{ backgroundColor: variant.color.hex }}
                    />
                    <span className="text-ink">{variant.color.name}</span>
                    <span className="text-xs text-subtle">({variant.stock})</span>
                  </li>
                ))}
              </ul>
            </div>
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
      </Container>

      <section aria-labelledby="details-heading" className="border-t border-line bg-canvas-deep">
        <Container className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-14 lg:py-24 xl:gap-20">
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
              {category ? (
                <Link href={`/products?category=${category.slug}`} className="chip">
                  {category.name}
                </Link>
              ) : null}
              <Link href={`/products?fabric=${encodeURIComponent(product.fabric)}`} className="chip">
                {product.fabric}
              </Link>
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
        </Container>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="section-y">
          <Container>
            <SectionHeading
              id="related-heading"
              eyebrow="Complete the assortment"
              title="You may also stock"
              action={
                collection ? { label: `More from ${collection.name}`, href: `/collections/${collection.slug}` } : undefined
              }
            />
            <ProductGrid products={related} className="mt-12" />
          </Container>
        </section>
      ) : null}

      <section className="border-t border-line py-12 bg-canvas-deep">
        <Container className="flex flex-col items-center justify-center text-center">
          <h3 className="font-display text-xl text-ink">Explore more wholesale designs</h3>
          <p className="mt-2 text-sm text-muted">Browse our full catalogue across Banarasi, Kanjivaram, and festive collections.</p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xs border border-line bg-canvas px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-accent hover:bg-accent hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
