import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/home/HomeSections";
import { OrderingProcess } from "@/components/home/OrderingProcess";
import { WholesaleCta } from "@/components/home/WholesaleCta";
import { WholesaleHighlights } from "@/components/home/WholesaleHighlights";
import { WhyKunalSarees } from "@/components/home/WhyKunalSarees";
import { AboutKunalSarees } from "@/components/home/AboutKunalSarees";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchBusinessSettings } from "@/lib/business-settings";
import {
  fetchCategories,
  fetchFeaturedCategories,
  fetchFeaturedProducts,
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

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  // Same cached requests as the page body.
  const [categories, products] = await Promise.all([fetchCategories(), fetchFeaturedProducts(8)]);
  return pageMetadata({
    title: DEFAULT_TITLE,
    absoluteTitle: true,
    description: homeDescription(categories, products),
    path: "/",
  });
}

export default async function HomePage() {
  const [featuredProducts, featuredCategories, newArrivals, business] = await Promise.all([
    fetchFeaturedProducts(8),
    fetchFeaturedCategories(6),
    fetchNewArrivals(6),
    fetchBusinessSettings(),
  ]);

  return (
    <>
      <JsonLd data={jsonLdGraph(organizationJsonLd(business), websiteJsonLd())} />

      {/* 1. HERO SECTION */}
      <HomeHero />

      {/* 2. TRUST / BUSINESS HIGHLIGHTS */}
      <WholesaleHighlights />

      {/* 3. DYNAMIC SECTIONS: CATEGORIES, NEW ARRIVALS, ALL PRODUCTS */}
      <HomeSections
        featuredCategories={featuredCategories}
        newArrivals={newArrivals}
        allProducts={featuredProducts}
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
