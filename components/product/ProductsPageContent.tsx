"use client";

import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogueBrowser } from "@/components/product/CatalogueBrowser";
import { LoadingState } from "@/components/ui/LoadingState";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Category, Product } from "@/types";

interface ProductsPageContentProps {
  products: Product[];
  categories?: Category[];
}

export function ProductsPageContent({ products, categories }: ProductsPageContentProps) {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <PageHeader
        eyebrow={isHi ? "कैटलॉग व नई साड़ियां" : "Catalogue & New Arrivals"}
        title={isHi ? "साड़ियां व नए डिजाइन" : "Browse Sarees & New Arrivals"}
        description={
          isHi
            ? "ताजा डिजाइन व नई अपलोड की गई साड़ियां सबसे पहले, साथ ही सम्पूर्ण बनारसी, सिल्क, जॉर्जेट और कॉटन थोक कलेक्शन।"
            : "Explore our latest new arrivals and complete wholesale collection of Banarasi, Silk, Georgette, and Cotton sarees."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.sarees },
        ]}
      />
      <section className="section-y-sm">
        <div className="container-page">
          {/* useSearchParams in CatalogueBrowser requires a Suspense boundary for static rendering */}
          <Suspense
            fallback={
              <LoadingState
                variant="products"
                count={8}
                label={t.loading.products}
              />
            }
          >
            <CatalogueBrowser products={products} categories={categories} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
