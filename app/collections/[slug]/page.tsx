import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionDetailPageContent } from "@/components/collection/CollectionDetailPageContent";
import { fetchCollections, fetchProducts } from "@/lib/catalog";
import { pageMetadata, truncate } from "@/lib/seo";

export async function generateStaticParams() {
  const cols = await fetchCollections();
  return cols.map((collection) => ({ slug: collection.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cols = await fetchCollections();
  const collection = cols.find((c) => c.slug === slug);
  if (!collection) return {};

  const name = collection.name_en || collection.name;
  return pageMetadata({
    title: `${name} | Wholesale Sarees`,
    description: truncate(collection.description_en || collection.description || `${name} wholesale sarees from Kunal Sarees, Surat.`),
    path: `/collections/${collection.slug}`,
    images: collection.image?.url ? [{ url: collection.image.url, alt: `${name} by Kunal Sarees` }] : undefined,
  });
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const cols = await fetchCollections();
  const collection = cols.find((c) => c.slug === slug);
  if (!collection) notFound();

  const allProducts = await fetchProducts();
  const collectionProducts = allProducts.filter((p) => p.collectionId === collection.id);

  return (
    <CollectionDetailPageContent
      collection={collection}
      collectionProducts={collectionProducts}
    />
  );
}

