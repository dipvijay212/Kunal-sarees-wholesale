import { CollectionCard } from "@/components/collection/CollectionCard";
import { BrandStatement } from "@/components/home/BrandStatement";
import { HomeHero } from "@/components/home/HomeHero";
import { OrderingProcess } from "@/components/home/OrderingProcess";
import { WholesaleCta } from "@/components/home/WholesaleCta";
import { WholesaleHighlights } from "@/components/home/WholesaleHighlights";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { orderingSteps, wholesaleHighlights } from "@/data/home";
import { siteConfig } from "@/data/site";
import {
  getAllCollections,
  getAllProducts,
  getBestsellers,
  getFeaturedCollections,
  getNewArrivals,
} from "@/lib/catalog";

export default function HomePage() {
  const products = getAllProducts();
  const featuredCollections = getFeaturedCollections(4);
  const newArrivals = getNewArrivals(4);
  const bestsellers = getBestsellers(4);
  const lowestMinimum = Math.min(...products.map((product) => product.pricing.minimumOrderQuantity));

  const stats = [
    { value: String(getAllCollections().length), label: "Collections" },
    { value: `${products.length}+`, label: "Curated designs" },
    { value: String(lowestMinimum), label: lowestMinimum === 1 ? "Piece minimum" : "Pieces minimum" },
  ];

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.brand.logo.src}`,
    telephone: `+${siteConfig.contact.whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.lines.join(", "),
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.region,
      postalCode: siteConfig.contact.address.postalCode,
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

      <HomeHero stats={stats} />
      <WholesaleHighlights highlights={wholesaleHighlights} />

      <section aria-labelledby="collections-heading" className="section-y">
        <div className="container-page">
          <SectionHeading
            id="collections-heading"
            eyebrow="Collections"
            title="Curated for every counter"
            description="Six edits covering heirloom silks, lightweight party wear and handloom everyday sarees."
            action={{ label: "All collections", href: "/collections" }}
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
            {featuredCollections.map((collection) => (
              <li key={collection.slug}>
                <CollectionCard collection={collection} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="new-arrivals-heading" className="section-y border-t border-line">
        <div className="container-page">
          <SectionHeading
            id="new-arrivals-heading"
            eyebrow="Just in"
            title="New arrivals"
            description="The latest designs added to the catalogue this season."
            action={{ label: "View all new arrivals", href: "/new-arrivals" }}
          />
          <ProductGrid products={newArrivals} className="mt-12 lg:mt-16" />
        </div>
      </section>

      <BrandStatement />

      <section aria-labelledby="bestsellers-heading" className="section-y">
        <div className="container-page">
          <SectionHeading
            id="bestsellers-heading"
            eyebrow="Proven sellers"
            title="Most reordered by retailers"
            description="Designs our stockists come back for, season after season."
            action={{ label: "Full catalogue", href: "/products" }}
          />
          <ProductGrid products={bestsellers} className="mt-12 lg:mt-16" />
        </div>
      </section>

      <OrderingProcess steps={orderingSteps} />
      <WholesaleCta />
    </>
  );
}
