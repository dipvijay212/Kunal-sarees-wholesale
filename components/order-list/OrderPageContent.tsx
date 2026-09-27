"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { OrderListView } from "@/components/order-list/OrderListView";
import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function OrderPageContent() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <PageHeader
        eyebrow={isHi ? "होलसेल ऑर्डर" : "Wholesale Order"}
        title={t.orderList.title}
        description={
          isHi
            ? "अपनी चुनी हुई साड़ियों की लिस्ट देखें, थोक रेट और मात्रा जांचें और ऑर्डर आगे बढ़ाएं।"
            : "Review selected saree designs, set wholesale quantities, and proceed directly to WhatsApp order dispatch."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.orderList.title },
        ]}
      />
      <section className="section-y-sm">
        <Container>
          <OrderListView />
        </Container>
      </section>
    </>
  );
}
