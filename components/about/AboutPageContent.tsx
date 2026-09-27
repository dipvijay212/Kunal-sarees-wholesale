"use client";

import { BrandStatement } from "@/components/home/BrandStatement";
import { WholesaleCta } from "@/components/home/WholesaleCta";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Category, Product } from "@/types";

interface AboutPageContentProps {
  categories: Category[];
  products: Product[];
}

export function AboutPageContent({ categories, products }: AboutPageContentProps) {
  const { t, language } = useLanguage();

  const storyImage = categories[0]?.image || {
    url: "https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=1200&q=85",
    alt: "Kunal Sarees Surat Wholesale",
    width: 1200,
    height: 800,
  };

  const facts = [
    {
      value: String(categories.length || 10),
      label: language === "hi" ? "साड़ी के प्रकार" : "Saree Categories",
    },
    {
      value: `${products.length || 12}+`,
      label: language === "hi" ? "साड़ी डिजाइन" : "Active Designs",
    },
    {
      value: language === "hi" ? "सूरत, गुजरात" : "Surat, Gujarat",
      label: language === "hi" ? "हमारा केंद्र" : "Wholesale Hub",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        description={t.about.intro}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.about.eyebrow },
        ]}
      />

      <section aria-labelledby="story-heading" className="section-y">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 id="story-heading" className="type-h2 text-ink">
              {language === "hi" ? "हमारी कहानी" : "Our Heritage & Story"}
            </h2>
            <div className="prose-ks mt-8 max-w-2xl">
              {t.about.storyParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="media-frame aspect-[4/5] rounded-xs">
              <RemoteImage
                src={storyImage.url}
                alt={storyImage.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {facts.map((fact) => (
                <div key={fact.label} className="flex min-w-0 flex-col-reverse gap-1.5">
                  <dt className="text-[0.625rem] leading-snug font-semibold tracking-[0.12em] text-muted uppercase">
                    {fact.label}
                  </dt>
                  <dd className="truncate font-display text-2xl text-ink sm:text-3xl">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </Container>
      </section>

      <section aria-labelledby="values-heading" className="section-y border-t border-line">
        <Container>
          <SectionHeading
            id="values-heading"
            eyebrow={t.about.valuesTitle}
            title={language === "hi" ? "दुकानदारों और बुटीक के लिए हमारे 3 वादे" : "Our 3 Commitments to Retailers & Boutiques"}
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {t.about.values.map((value, index) => (
              <li key={value.title} className="card card__body">
                <span className="font-display text-3xl text-accent">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="type-h4 mt-4 text-ink">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <BrandStatement />
      <WholesaleCta />
    </>
  );
}
