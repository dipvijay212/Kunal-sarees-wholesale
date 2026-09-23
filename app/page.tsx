import { CollectionCard } from "@/components/collection/CollectionCard";
import { HomeHero } from "@/components/home/HomeHero";
import { OrderingProcess } from "@/components/home/OrderingProcess";
import { WholesaleCta } from "@/components/home/WholesaleCta";
import { WholesaleHighlights } from "@/components/home/WholesaleHighlights";
import { WhyKunalSarees } from "@/components/home/WhyKunalSarees";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { businessSettings } from "@/data/business";
import { orderingSteps, wholesaleHighlights } from "@/data/home";
import { siteConfig } from "@/data/site";
import {
  fetchFeaturedCollections,
  fetchNewArrivals,
  fetchProducts,
} from "@/lib/catalog";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kunal Sarees — Timeless Sarees. Wholesale Excellence.",
  description:
    "Discover premium Banarasi, Kanjivaram, organza and bridal saree collections curated for retailers, boutiques, resellers and wholesale buyers across India.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kunal Sarees — Timeless Sarees. Wholesale Excellence.",
    description:
      "Discover premium Banarasi, Kanjivaram, organza and bridal saree collections curated for retailers, boutiques, resellers and wholesale buyers across India.",
  },
};

export default async function HomePage() {
  const products = await fetchProducts();
  const featuredCollections = await fetchFeaturedCollections(6);
  const newArrivals = await fetchNewArrivals(6);

  const { address } = businessSettings.contact;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.brand.logo.src}`,
    telephone: `+${businessSettings.contact.whatsappNumber}`,
    email: businessSettings.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.lines.join(", "),
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: "IN",
    },
    sameAs: siteConfig.social.map((link) => link.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* 1. HERO SECTION */}
      <HomeHero />

      {/* 2. TRUST / BUSINESS HIGHLIGHTS */}
      <WholesaleHighlights highlights={wholesaleHighlights} />

      {/* 3. FEATURED COLLECTIONS (6 COLLECTIONS) */}
      <section aria-labelledby="collections-heading" className="section-y border-t border-line bg-canvas">
        <Container>
          <SectionHeading
            id="collections-heading"
            eyebrow="Curated Edits"
            title="Wholesale Saree Collections"
            description="Handpicked saree edits tailored for boutiques, retail showrooms and wholesale distributors."
            action={{ label: "All collections", href: "/collections" }}
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {featuredCollections.map((collection) => (
              <li key={collection.id}>
                <CollectionCard collection={collection} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 4. NEW ARRIVALS (6 Products) */}
      <section aria-labelledby="new-arrivals-heading" className="section-y border-t border-line bg-canvas">
        <Container>
          <SectionHeading
            id="new-arrivals-heading"
            eyebrow="Fresh Weaves"
            title="New Wholesale Arrivals"
            description="The latest saree designs added to our wholesale catalogue this season."
            action={{ label: "View all new arrivals", href: "/new-arrivals" }}
          />
          <ProductGrid products={newArrivals} className="mt-10 lg:mt-12" />
        </Container>
      </section>

      {/* 5. ALL PRODUCTS (Complete Wholesale Catalogue) */}
      <section aria-labelledby="all-products-heading" className="section-y border-t border-line bg-canvas">
        <Container>
          <SectionHeading
            id="all-products-heading"
            eyebrow="Complete Wholesale Collection"
            title="All Saree Designs"
            description="Explore our complete catalogue across Banarasi, Kanjivaram, organza, georgette, and festive collections."
            action={{ label: "View full catalogue", href: "/products" }}
          />
          <ProductGrid products={products} className="mt-10 lg:mt-12" />
        </Container>
      </section>

      {/* 6. WHOLESALE PROCESS */}
      <OrderingProcess steps={orderingSteps} />

      {/* 7. WHY KUNAL SAREES */}
      <WhyKunalSarees />

      {/* 8. WHOLESALE CTA */}
      <WholesaleCta />
    </>
  );
}

