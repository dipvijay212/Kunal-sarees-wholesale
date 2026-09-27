"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function NotFound() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <section className="section-y">
      <Container size="narrow" className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="type-eyebrow text-accent-strong">{isHi ? "त्रुटि 404" : "Error 404"}</p>
        <h1 className="type-h1 mt-6 text-ink">{t.errors.notFoundTitle}</h1>
        <p className="type-lead mt-6 max-w-lg text-muted">
          {t.errors.notFoundDesc}
        </p>
        <div className="mt-10 flex flex-col gap-3 xs:flex-row">
          <Button href="/products">{t.products.viewAllFull}</Button>
          <Button href="/" variant="secondary">
            {t.buttons.goHome}
          </Button>
        </div>
      </Container>
    </section>
  );
}

