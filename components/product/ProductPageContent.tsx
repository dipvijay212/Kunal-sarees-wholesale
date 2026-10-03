"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { CheckIcon, PackageIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatPrice } from "@/lib/format";
import type { Category, Collection, Product } from "@/types";

interface ProductPageContentProps {
  product: Product;
  category: Category | null;
  collection: Collection | null;
  related: Product[];
}

export function ProductPageContent({
  product,
  category,
  collection,
  related,
}: ProductPageContentProps) {
  const { t, getLocalized, language } = useLanguage();

  const displayName = getLocalized(product, "name") || product.name;
  const displayDescription = getLocalized(product, "description") || product.description;
  const displayFabric = getLocalized(product, "fabric") || product.fabric;
  const displayCategoryName = category ? (getLocalized(category, "name") || category.name) : "—";
  // Labels follow the site language; the values are the product's own (English) data.
  const isHindi = language === "hi";
  const highlights = [
    product.fabric ? `${isHindi ? "फैब्रिक" : "Fabric"}: ${product.fabric}` : null,
    isHindi ? `कम से कम ऑर्डर: ${product.moq} पीस` : `Minimum order: ${product.moq} pieces`,
    `${isHindi ? "डिज़ाइन कोड" : "Design code"}: ${product.productCode}`,
  ].filter((item): item is string => Boolean(item));
  const displayCollectionName = collection ? (getLocalized(collection, "name") || collection.name) : "";

  const specifications = [
    { label: t.productDetails.codeLabel.replace(/:$/, ""), value: product.productCode },
    { label: t.filters.category, value: displayCategoryName },
    { label: t.productDetails.fabricLabel.replace(/:$/, ""), value: displayFabric },
    { label: language === "en" ? "Work / Design" : "वर्क / डिजाइन", value: product.design },
    { label: t.filters.color, value: product.colors.map((color) => color.name).join(", ") },
    { label: t.productDetails.length, value: product.specifications.sareeLength },
    { label: t.productDetails.blouse, value: product.specifications.blousePiece },
    { label: t.productDetails.weight, value: product.specifications.weight },
    { label: t.productDetails.origin, value: product.specifications.origin },
    { label: t.productDetails.washCare, value: product.specifications.washCare },
  ];

  return (
    <div className="pb-24 lg:pb-0 min-w-0 max-w-full overflow-x-hidden">
      <Container className="pt-3 sm:pt-4 lg:pt-6">
        <Breadcrumbs
          items={[
            { label: t.nav.home, href: "/" },
            ...(category ? [{ label: displayCategoryName, href: `/products?category=${category.slug}` }] : []),
            { label: displayName },
          ]}
        />
      </Container>

      <Container
        as="section"
        className="grid gap-6 sm:gap-8 pt-2 pb-10 sm:pb-16 lg:grid-cols-12 lg:gap-14 lg:pt-8 lg:pb-24 xl:gap-20"
      >
        <div className="lg:col-span-7 min-w-0 max-w-full">
          <div className="lg:top-header lg:sticky">
            <ProductImageGallery images={product.images} videoUrl={product.videoUrl} videoUrls={product.videoUrls} productName={displayName} />
          </div>
        </div>

        <div className="flex flex-col lg:col-span-5 min-w-0 max-w-full">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {product.newArrival ? <Badge variant="accent">{t.products.badgeNew}</Badge> : null}
            {product.featured ? <Badge variant="solid">{t.products.badgeFeatured}</Badge> : null}
            <Badge variant="outline">{displayFabric}</Badge>
            <Badge variant="outline">{product.design}</Badge>
          </div>

          <h1 className="type-h1 mt-3 sm:mt-4 text-ink font-serif font-normal text-2xl sm:text-3xl lg:text-4xl">{displayName}</h1>
          <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-sm text-muted">
            {t.productDetails.codeLabel}{" "}
            <span className="font-semibold text-ink">{product.productCode}</span>
            {collection ? (
              <>
                {" · "}
                <Link
                  href={`/collections/${collection.slug}`}
                  className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-maroon hover:decoration-maroon"
                >
                  {displayCollectionName}
                </Link>
              </>
            ) : null}
          </p>

          <div className="mt-3.5 sm:mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y border-line py-3.5 sm:py-4">
            <p className="type-price text-2xl sm:text-3xl font-bold text-maroon">{formatPrice(product.price)}</p>
            <p className="text-xs sm:text-sm text-muted">
              {t.products.perPiece} · {language === "en" ? "Wholesale Only (GST Extra)" : "सिर्फ होलसेल (GST अलग से)"}
            </p>
          </div>

          <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-muted">{displayDescription}</p>

          <div className="mt-5 sm:mt-6">
            <ProductPurchasePanel product={product} />
          </div>

          <ul className="mt-8 grid gap-3.5 border-t border-line pt-6 text-xs sm:text-sm text-muted sm:grid-cols-2">
            <li className="flex items-start gap-2.5">
              <ShieldCheckIcon size={18} className="shrink-0 text-accent mt-0.5" />
              <span>{language === "en" ? "Rigorous quality check on each saree before dispatch" : "डिस्पैच से पहले हर साड़ी की क्वालिटी चेक की जाती है"}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <PackageIcon size={18} className="shrink-0 text-accent mt-0.5" />
              <span>{language === "en" ? "Safe & insured transport delivery across India" : "पूरे भारत में सुरक्षित डिलीवरी की व्यवस्था"}</span>
            </li>
          </ul>
        </div>
      </Container>

      <section aria-labelledby="details-heading" className="border-t border-line bg-canvas-deep">
        <Container className="grid gap-8 sm:gap-12 py-10 sm:py-16 lg:grid-cols-12 lg:gap-14 lg:py-24 xl:gap-20">
          <div className="lg:col-span-5 min-w-0">
            <h2 id="details-heading" className="type-h3 text-xl sm:text-2xl text-ink font-serif">
              {t.productDetails.highlightsTitle}
            </h2>
            <ul className="mt-4 sm:mt-6 flex flex-col gap-3">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {category ? (
                <Link href={`/products?category=${category.slug}`} className="chip">
                  {displayCategoryName}
                </Link>
              ) : null}
              <Link href={`/products?fabric=${encodeURIComponent(product.fabric)}`} className="chip">
                {displayFabric}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <h2 className="type-eyebrow text-xs text-muted">{t.productDetails.specificationsTitle}</h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {specifications.map((spec) => (
                <div key={spec.label} className="grid grid-cols-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2 sm:gap-4 py-3 text-xs sm:text-sm">
                  <dt className="text-muted font-medium">{spec.label}</dt>
                  <dd className="text-ink font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-subtle">
              {language === "en"
                ? "Slight color variations may occur due to photography and screen settings. Live video view available on WhatsApp before dispatch."
                : "स्क्रीन और डाई लॉट के कारण रंगों में थोड़ा अंतर हो सकता है। ऑर्डर से पहले WhatsApp पर लाइव वीडियो देख सकते हैं।"}
            </p>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="section-y">
          <Container>
            <SectionHeading
              id="related-heading"
              eyebrow={t.productDetails.relatedTitle}
              title={t.productDetails.relatedTitle}
              description={t.productDetails.relatedDesc}
              action={
                collection ? { label: `${displayCollectionName} - ${t.categories.viewAll}`, href: `/collections/${collection.slug}` } : undefined
              }
            />
            <ProductGrid products={related} className="mt-8 sm:mt-12" />
          </Container>
        </section>
      ) : null}

      <section className="border-t border-line py-10 sm:py-12 bg-canvas-deep">
        <Container className="flex flex-col items-center justify-center text-center">
          <h3 className="font-display text-lg sm:text-xl text-ink">
            {language === "en" ? "Explore More Wholesale Sarees" : "और भी खूबसूरत होलसेल साड़ियां देखें"}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            {t.products.allProductsDesc}
          </p>
          <div className="mt-5 sm:mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xs border border-line bg-canvas px-5 py-2.5 sm:px-6 sm:py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-accent hover:bg-accent hover:text-white"
            >
              {t.products.viewAllFull}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
