import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/home/HomeSections";
import { OrderingProcess } from "@/components/home/OrderingProcess";
import { WholesaleCta } from "@/components/home/WholesaleCta";
import { WholesaleHighlights } from "@/components/home/WholesaleHighlights";
import { WhyKunalSarees } from "@/components/home/WhyKunalSarees";
import { AboutKunalSarees } from "@/components/home/AboutKunalSarees";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  fetchCategories,
  fetchFeaturedCategories,
  fetchNewArrivals,
  fetchProducts,
} from "@/lib/catalog";
import {
  DEFAULT_TITLE,
  homeDescription,
  jsonLdGraph,
  organizationJsonLd,
  pageMetadata,
  websiteJsonLd,
} from "@/lib/seo";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  // Same cached requests as the page body.
  const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);
  return pageMetadata({
    title: DEFAULT_TITLE,
    absoluteTitle: true,
    description: homeDescription(categories, products),
    path: "/",
  });
}

export default async function HomePage() {
  const [products, featuredCategories, newArrivals] = await Promise.all([
    fetchProducts(),
    fetchFeaturedCategories(6),
    fetchNewArrivals(6),
  ]);

  return (
    <>
      <JsonLd data={jsonLdGraph(organizationJsonLd(), websiteJsonLd())} />

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
