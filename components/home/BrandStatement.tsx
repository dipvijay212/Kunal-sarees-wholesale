"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function BrandStatement() {
  const { logo } = siteConfig.brand;
  const { language } = useLanguage();

  return (
    <section aria-label={language === "hi" ? "हमारा नज़रिया" : "Our Vision"} className="section-y border-y border-line bg-canvas-deep">
      <Container size="narrow" className="flex flex-col items-center text-center">
        <Image
          src={logo.src}
          alt=""
          width={logo.width}
          height={logo.height}
          sizes="96px"
          className="size-20 rounded-full lg:size-24"
        />
        <blockquote className="mt-10">
          <p className="font-serif text-[1.75rem] leading-[1.25] font-normal text-ink sm:text-4xl lg:text-[2.5rem]">
            {language === "hi" ? (
              <>
                “हम हर साड़ी को वैसे ही चुनते हैं जैसे एक बुटीक ओनर चुनता है — हाथों से, बुनाई देखकर, और{" "}
                <em className="text-accent-strong not-italic font-semibold">अपने ग्राहकों की पसंद</em> को ध्यान में रखकर।”
              </>
            ) : (
              <>
                “We select every saree the way a boutique owner does — by touch, inspecting the weave, and keeping{" "}
                <em className="text-accent-strong not-italic font-semibold">our retail customers&apos; taste</em> in mind.”
              </>
            )}
          </p>
          <footer className="type-eyebrow mt-8 text-muted uppercase tracking-widest">
            {siteConfig.name} {language === "hi" ? "होलसेल डेस्क" : "Wholesale Desk"}
          </footer>
        </blockquote>
      </Container>
    </section>
  );
}

