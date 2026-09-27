"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SparkleIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Product } from "@/types";

interface NewArrivalsPageContentProps {
  newArrivals: Product[];
}

export function NewArrivalsPageContent({ newArrivals }: NewArrivalsPageContentProps) {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <PageHeader
        eyebrow={t.products.newArrivalsEyebrow}
        title={t.products.newArrivalsTitle}
        description={t.products.newArrivalsDesc}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.products.newArrivalsTitle },
        ]}
      />

      <section aria-label={t.products.newArrivalsTitle} className="section-y-sm">
        <Container>
          {newArrivals.length > 0 ? (
            <ProductGrid products={newArrivals} eagerCount={4} />
          ) : (
            <EmptyState
              icon={<SparkleIcon size={26} />}
              title={isHi ? "नए डिजाइन जल्द आ रहे हैं" : "New Designs Coming Soon"}
              description={
                isHi
                  ? "हमारा नया स्टॉक तैयार हो रहा है। सबसे पहले जानकारी के लिए WhatsApp पर पूछें।"
                  : "Fresh weaves are arriving at our Surat hub. Chat with us on WhatsApp to get early access."
              }
              action={<WhatsAppButton label={t.buttons.whatsappChat} />}
            />
          )}

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center">
            <p className="max-w-lg text-muted">
              {isHi
                ? "पूरा कलेक्शन देखना चाहते हैं? हमारी सभी साड़ियों का कैटलॉग देखें।"
                : "Looking to explore our complete catalog? Browse all wholesale sarees."}
            </p>
            <Button href="/products?sort=newest" variant="secondary">
              {t.products.viewAllFull}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
