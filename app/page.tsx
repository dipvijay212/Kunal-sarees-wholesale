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

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const [products, featuredCategories, newArrivals, business] = await Promise.all([
    fetchProducts(),
    fetchFeaturedCategories(6),
    fetchNewArrivals(4),
    fetchBusinessSettings(),
  ]);

  // The home page previews one row of new arrivals and 8 sarees, so only those are sent
  // to the browser. New arrivals are left out of "All Sarees" unless nothing else exists.
  const newArrivalIds = new Set(newArrivals.map((product) => product.id));
  const otherProducts = products.filter((product) => !newArrivalIds.has(product.id));
  const previewProducts = (otherProducts.length > 0 ? otherProducts : products).slice(0, 8);

  return (
    <>
      <JsonLd data={jsonLdGraph(organizationJsonLd(business), websiteJsonLd())} />

      {/* 1. HERO SECTION */}
      <HomeHero settings={business.settings} />

      {/* 2. TRUST / BUSINESS HIGHLIGHTS */}
      <WholesaleHighlights />

      {/* 3. DYNAMIC SECTIONS: CATEGORIES, NEW ARRIVALS, ALL PRODUCTS */}
      <HomeSections
        featuredCategories={featuredCategories}
        newArrivals={newArrivals}
        allProducts={previewProducts}
      />

      {/* 4. WHY KUNAL SAREES */}
      <WhyKunalSarees settings={business.settings} />

      {/* 5. ORDERING PROCESS */}
      <OrderingProcess />

      {/* 6. WHOLESALE CTA */}
      <WholesaleCta settings={business.settings} />

      {/* 7. ABOUT KUNAL SAREES */}
      <AboutKunalSarees />
    </>
  );
}
