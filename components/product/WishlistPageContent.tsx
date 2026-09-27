"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { WishlistView } from "@/components/product/WishlistView";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function WishlistPageContent() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <PageHeader
        eyebrow={t.wishlist.title}
        title={isHi ? "आपकी पसंद" : "Your Saved Sarees"}
        description={
          isHi
            ? "इस डिवाइस पर सुरक्षित आपकी पसंदीदा साड़ियां। जब चाहें मात्रा चुनकर सीधे ऑर्डर लिस्ट में जोड़ें।"
            : "Sarees saved on this device. Review anytime and add required quantities to your wholesale order."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.wishlist.title },
        ]}
      />
      <section className="section-y-sm">
        <div className="container-page">
          <WishlistView />
        </div>
      </section>
    </>
  );
}
