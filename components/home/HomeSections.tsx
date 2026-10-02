"use client";

import { CategoryCard } from "@/components/category/CategoryCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { CategoryWithCount, Product } from "@/types";

interface HomeSectionsProps {
  featuredCategories: CategoryWithCount[];
  newArrivals: Product[];
  allProducts: Product[];
}

export function HomeSections({
  featuredCategories,
  newArrivals,
  allProducts,
}: HomeSectionsProps) {
  const { t } = useLanguage();

  // Keep the two sections distinct: sarees shown in New Arrivals are left out of All Sarees,
  // unless that would leave All Sarees empty.
  const newArrivalIds = new Set(newArrivals.map((p) => p.id));
  const remainingProducts = allProducts.filter((p) => !newArrivalIds.has(p.id));
  const catalogueProducts = remainingProducts.length > 0 ? remainingProducts : allProducts;

  return (
    <>
      {/* 1. FEATURED CATEGORIES */}
      <section aria-labelledby="categories-heading" className="section-y border-t border-line bg-canvas">
        <Container>
          <SectionHeading
            id="categories-heading"
            eyebrow={t.categories.eyebrow}
            title={t.categories.title}
            description={t.categories.description}
            action={{ label: t.categories.viewAll, href: "/products" }}
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {featuredCategories.map((category) => (
              <li key={category.id}>
                <CategoryCard category={category} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 2. NEW ARRIVALS (hidden until at least one saree is marked as a new arrival) */}
      {newArrivals.length > 0 ? (
      <section aria-labelledby="new-arrivals-heading" className="section-y border-t border-line bg-canvas">
        <Container>
          <SectionHeading
            id="new-arrivals-heading"
            eyebrow={t.products.newArrivalsEyebrow}
            title={t.products.newArrivalsTitle}
            description={t.products.newArrivalsDesc}
            action={{ label: t.products.viewAllNew, href: "/products" }}
          />
          <div className="mt-10 lg:mt-12">
            <ProductGrid products={newArrivals} eagerCount={3} />
          </div>
        </Container>
      </section>
      ) : null}

      {/* 3. COMPLETE CATALOG */}
      <section aria-labelledby="all-products-heading" className="section-y border-t border-line bg-canvas">
        <Container>
          <SectionHeading
            id="all-products-heading"
            eyebrow={t.products.allProductsEyebrow}
            title={t.products.allProductsTitle}
            description={t.products.allProductsDesc}
            action={{ label: t.products.viewAllFull, href: "/products" }}
          />
          <div className="mt-10 lg:mt-12">
            <ProductGrid products={catalogueProducts.slice(0, 8)} />
          </div>
        </Container>
      </section>
    </>
  );
}
