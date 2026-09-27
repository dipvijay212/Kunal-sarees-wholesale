import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionDetailPageContent } from "@/components/collection/CollectionDetailPageContent";
import { siteConfig } from "@/data/site";
import { fetchCollections, fetchProducts } from "@/lib/catalog";

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

