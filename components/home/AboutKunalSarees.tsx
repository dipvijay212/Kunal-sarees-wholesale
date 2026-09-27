"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function AboutKunalSarees() {
  const { t, language } = useLanguage();

  return (
    <section aria-labelledby="about-intro-heading" className="section-y border-t border-line bg-canvas-deep">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-3">
              <Logo markClassName="size-11" showWordmark={true} showTagline={true} wordmarkClassName="text-xl font-serif font-bold tracking-wider" asLink={false} />
            </div>
            <p className="text-xs font-semibold tracking-widest text-accent-strong uppercase">
              {language === "en" ? "Surat Textile Hub • Direct Manufacturer Supply" : "सूरत टेक्सटाइल हब • डायरेक्ट मैन्युफैक्चरर सप्लाई"}
            </p>
            <h2 id="about-intro-heading" className="type-h2 mt-3 text-ink">
              {language === "en" ? "Crafted Weaves, Trusted Wholesale Partnership." : "साड़ियों की कला, भरोसेमंद होलसेल बिज़नेस।"}
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-7">
            <p className="type-lead text-ink">
              {t.about.intro}
            </p>
            <p className="text-sm leading-relaxed text-muted">
              {t.about.storyParagraphs[0]}
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-accent-strong transition-colors hover:text-accent"
              >
                {language === "en" ? "Read our full story" : "हमारी कहानी और जानकारी पढ़ें"}
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
