import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageContent } from "@/components/product/ProductPageContent";
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

  const name = product.name_hi || product.name;
  const desc = product.shortDescription_hi || product.shortDescription || product.description;

  return {
    title: `${name} — ${product.fabric} Wholesale`,
    description: `${desc} Wholesale from ${formatPrice(product.price)} per piece, MOQ ${product.moq}. Design code ${product.productCode}.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${name} | ${siteConfig.name}`,
      description: desc,
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_hi || product.name,
    sku: product.productCode,
    description: product.description_hi || product.description,
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
      <ProductPageContent
        product={product}
        category={category ?? null}
        collection={collection ?? null}
        related={related}
      />
    </>
  );
}

