"use client";

import { CategoryCard } from "@/components/category/CategoryCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { CategoryWithCount } from "@/types";

interface CollectionsPageContentProps {
  categories: CategoryWithCount[];
}

export function CollectionsPageContent({ categories }: CollectionsPageContentProps) {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <PageHeader
        eyebrow={t.categories.eyebrow}
        title={isHi ? "साड़ी कलेक्शन व श्रेणियां" : "Saree Collections & Categories"}
        description={
          isHi
            ? "सिल्क, कॉटन, बनारसी, जॉर्जेट, ऑरगेंज़ा और ब्राइडल साड़ियों की सम्पूर्ण थोक श्रेणियां।"
            : "Explore our wholesale saree catalogue by fabric, weaving style, and occasion."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.categories },
        ]}
      />
      <section className="section-y-sm">
        <ul className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {categories.map((category, index) => (
            <li key={category.id}>
              <CategoryCard
                category={category}
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
