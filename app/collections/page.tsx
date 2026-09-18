import type { Metadata } from "next";
import { CollectionCard } from "@/components/collection/CollectionCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCollections } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore Kunal Sarees wholesale collections: Banarasi silk, Kanjivaram, organza, georgette, handloom and bridal couture.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  const collections = getCollections();

  return (
    <>
      <PageHeader
        eyebrow="Collections"
        title="Six edits, one standard"
        description="Each collection is built around a fabric or occasion, so you can plan your assortment the way your customers shop."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]}
      />
      <section className="section-y-sm">
        <ul className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {collections.map((collection, index) => (
            <li key={collection.id}>
              <CollectionCard
                collection={collection}
                eager={index < 3}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
