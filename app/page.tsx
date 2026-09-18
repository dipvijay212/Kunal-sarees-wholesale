import { CollectionCard } from "@/components/collection/CollectionCard";
import { AboutKunalSarees } from "@/components/home/AboutKunalSarees";
import { FeaturedBanner } from "@/components/home/FeaturedBanner";
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
  getCategories,
  getFeaturedCollections,
  getNewArrivals,
  getProducts,
} from "@/lib/catalog";
import { formatNumber } from "@/lib/format";

export default function HomePage() {
  const products = getProducts();
  const featuredCollections = getFeaturedCollections(4);
  const newArrivals = getNewArrivals(6);
  const lowestMoq = Math.min(...products.map((product) => product.moq));

  const stats = [
    { value: formatNumber(getCategories().length), label: "Categories" },
    { value: `${formatNumber(products.length)}+`, label: "Designs in stock" },
    { value: formatNumber(lowestMoq), label: lowestMoq === 1 ? "Piece minimum" : "Pieces minimum" },
  ];

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
      <HomeHero stats={stats} />

      {/* 2. TRUST / BUSINESS HIGHLIGHTS */}
      <WholesaleHighlights highlights={wholesaleHighlights} />

      {/* 3. FEATURED COLLECTIONS */}
      <section aria-labelledby="collections-heading" className="section-y">
        <Container>
          <SectionHeading
            id="collections-heading"
            eyebrow="Curated Edits"
            title="Featured Collections"
            description="Explore our handpicked collection edits tailored for boutique stockists and retailers."
            action={{ label: "All collections", href: "/collections" }}
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
            {featuredCollections.map((collection) => (
              <li key={collection.id}>
                <CollectionCard collection={collection} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 4. NEW ARRIVALS (6 Products) */}
      <section aria-labelledby="new-arrivals-heading" className="section-y border-t border-line">
        <Container>
          <SectionHeading
            id="new-arrivals-heading"
            eyebrow="Fresh Weaves"
            title="New Arrivals"
            description="The latest saree designs added to our wholesale catalogue this season."
            action={{ label: "View all new arrivals", href: "/new-arrivals" }}
          />
          <ProductGrid products={newArrivals} className="mt-12 lg:mt-16" />
        </Container>
      </section>

      {/* 5. WHY KUNAL SAREES */}
      <WhyKunalSarees />

      {/* 6. WHOLESALE PROCESS */}
      <OrderingProcess steps={orderingSteps} />

      {/* 7. FEATURED BANNER */}
      <FeaturedBanner />

      {/* 8. ABOUT KUNAL SAREES */}
      <AboutKunalSarees />

      {/* 9. WHATSAPP CTA */}
      <WholesaleCta />
    </>
  );
}
