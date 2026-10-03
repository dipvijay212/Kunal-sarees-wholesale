"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useSettings } from "@/hooks/use-settings";
import type { BusinessSettings } from "@/types";

interface WholesaleCtaProps {
  settings?: BusinessSettings;
}

export function WholesaleCta({ settings: propSettings }: WholesaleCtaProps = {}) {
  const contextSettings = useSettings();
  const settings = propSettings || contextSettings;
  const { t } = useLanguage();
  const { cta } = t;
  const bannerImage =
    settings.storefrontImages?.wholesaleBannerImage?.trim() ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85";

  return (
    <section aria-labelledby="cta-heading" className="section-y border-t border-line bg-canvas">
      <Container>
        <div className="relative overflow-hidden rounded-xs bg-maroon-dark text-cream border border-gold/30 shadow-lift">
          <div className="grid lg:grid-cols-12 items-stretch min-h-[22rem]">
            {/* Left Column: Copy & Actions (Span 7) */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14 lg:col-span-7 z-10">
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold-light">
                {cta.eyebrow}
              </span>
              <h2
                id="cta-heading"
                className="font-serif text-3xl sm:text-4xl lg:text-[2.625rem] font-normal text-cream leading-tight mt-3"
              >
                {cta.title}
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-cream/90 max-w-xl">
                {cta.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  href="/products"
                  size="lg"
                  className="bg-gold hover:bg-gold-light text-maroon-dark font-semibold shadow-sm tracking-[0.04em]"
                >
                  {cta.btnExplore}
                </Button>
                <WhatsAppButton
                  size="lg"
                  label={cta.btnWhatsapp}
                  variant="ghost"
                  className="border border-gold/50 bg-white/10 text-cream hover:bg-gold hover:text-maroon-dark hover:border-gold font-semibold tracking-[0.04em] transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            {/* Right Column: Premium Saree Photograph (Span 5) */}
            <div className="relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-full lg:col-span-5 overflow-hidden">
              <Image
                src={bannerImage}
                alt="Exquisite Indian silk saree with intricate zari border"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-maroon-dark via-maroon-dark/30 to-transparent lg:bg-linear-to-r lg:from-maroon-dark lg:via-maroon-dark/20 lg:to-transparent"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
