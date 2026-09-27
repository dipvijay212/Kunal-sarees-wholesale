import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/home/HomeSections";
import { OrderingProcess } from "@/components/home/OrderingProcess";
import { WholesaleCta } from "@/components/home/WholesaleCta";
import { WholesaleHighlights } from "@/components/home/WholesaleHighlights";
import { WhyKunalSarees } from "@/components/home/WhyKunalSarees";
import { AboutKunalSarees } from "@/components/home/AboutKunalSarees";
import { businessSettings } from "@/data/business";
import { siteConfig } from "@/data/site";
import {
  fetchFeaturedCategories,
  fetchNewArrivals,
  fetchProducts,
} from "@/lib/catalog";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kunal Sarees — Surat Direct Wholesale Sarees",
  description:
    "Curated Banarasi, Silk, Organza and Bridal sarees for boutiques and retailers nationwide. Direct Surat wholesale prices.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kunal Sarees — Surat Direct Wholesale Sarees",
    description:
      "Curated Banarasi, Silk, Organza and Bridal sarees for boutiques and retailers nationwide. Direct Surat wholesale prices.",
  },
};

export default async function HomePage() {
  const products = await fetchProducts();
  const featuredCategories = await fetchFeaturedCategories(6);
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
      <WholesaleHighlights />

      {/* 3. DYNAMIC SECTIONS: CATEGORIES, NEW ARRIVALS, ALL PRODUCTS */}
      <HomeSections
        featuredCategories={featuredCategories}
        newArrivals={newArrivals}
        allProducts={products}
      />

      {/* 4. WHY KUNAL SAREES */}
      <WhyKunalSarees />

      {/* 5. ORDERING PROCESS */}
      <OrderingProcess />

      {/* 6. WHOLESALE CTA */}
      <WholesaleCta />

      {/* 7. ABOUT KUNAL SAREES */}
      <AboutKunalSarees />
    </>
  );
}
