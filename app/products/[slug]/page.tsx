import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageContent } from "@/components/product/ProductPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessSettings } from "@/data/business";
import {
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
  getAvailability,
  getCollectionById,
} from "@/lib/catalog";
import { categoryRepository } from "@/lib/repositories";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  categoryDisplayName,
  categoryPath,
  isPlaceholderImage,
  jsonLdGraph,
  ORGANIZATION_ID,
  pageMetadata,
  productPath,
  productSeo,
  SITE_NAME,
  truncate,
  type BreadcrumbItem,
} from "@/lib/seo";
import type { ProductAvailability } from "@/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const prods = await fetchProducts({ limit: 20 });
  return prods.map((product) => ({ slug: product.slug }));
}

// Products added in admin after the build render (and get their SEO) on first request.
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Saree Not Found", robots: { index: false, follow: true } };
  return pageMetadata(productSeo(product));
}

const SCHEMA_AVAILABILITY: Record<ProductAvailability, string> = {
  "in-stock": "https://schema.org/InStock",
  "low-stock": "https://schema.org/LimitedAvailability",
  // Out-of-stock designs are made to order (see "ऑर्डर पर बनेगी" in lib/catalog.ts).
  "out-of-stock": "https://schema.org/MadeToOrder",
};

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    fetchProductBySlug(slug),
    categoryRepository.fetchAll(),
  ]);
  if (!product) notFound();

  // Resolved from the backend so the category link, breadcrumb and spec row render server-side.
  const category = categories.find((c) => c.id === product.categoryId);
  const collection = getCollectionById(product.collectionId);
  const related = await fetchRelatedProducts(product, 4);
  const availability = getAvailability(product);
  const seo = productSeo(product);
  const productUrl = absoluteUrl(productPath(product));
  const name = product.name_en || product.name;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "Sarees", path: "/products" },
    ...(category ? [{ name: categoryDisplayName(category), path: categoryPath(category) }] : []),
    { name, path: seo.path },
  ];

  // Only fields backed by real catalogue data. Colour, fabric and specifications are
  // omitted because lib/api-adapters.ts fills defaults when the backend has none.
  const productJsonLd = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name,
    sku: product.productCode,
    description: truncate(product.description_en || product.description, 500),
    image: product.images.filter((image) => !isPlaceholderImage(image.url)).map((image) => image.url),
    url: productUrl,
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(category ? { category: categoryDisplayName(category) } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: businessSettings.currency,
      price: product.price,
      availability: SCHEMA_AVAILABILITY[availability],
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORGANIZATION_ID },
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: product.moq,
        unitText: "piece",
      },
    },
  };

  return (
    <>
      <JsonLd data={jsonLdGraph(productJsonLd, breadcrumbJsonLd(breadcrumbs))} />
      <ProductPageContent
        product={product}
        category={category ?? null}
        collection={collection ?? null}
        related={related}
      />
    </>
  );
}
