"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ChatIcon, PackageIcon, ShieldCheckIcon, TagIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useSettings } from "@/hooks/use-settings";
import type { BusinessSettings } from "@/types";

const pillarIcons = [ShieldCheckIcon, TagIcon, PackageIcon, ChatIcon];

interface WhyKunalSareesProps {
  settings?: BusinessSettings;
}

export function WhyKunalSarees({ settings: propSettings }: WhyKunalSareesProps = {}) {
  const contextSettings = useSettings();
  const settings = propSettings || contextSettings;
  const { t } = useLanguage();
  const { whyUs } = t;
  const whyImage =
    settings.storefrontImages?.whyChooseUsImage?.trim() ||
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80";

  return (
    <section aria-labelledby="why-us-heading" className="section-y border-t border-line bg-canvas">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left Column: Editorial Content */}
          <div className="lg:col-span-7">
            <p className="type-eyebrow text-gold font-medium tracking-[0.15em] uppercase">{whyUs.eyebrow}</p>
            <h2 id="why-us-heading" className="type-h2 mt-3 text-ink font-serif font-normal">
              {whyUs.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted max-w-xl">
              {whyUs.description}
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {whyUs.pillars.map((pillar, index) => {
                const Icon = pillarIcons[index % pillarIcons.length];
                return (
                  <div
                    key={pillar.title}
                    className="flex flex-col gap-3 rounded-xs border border-line bg-surface p-5 shadow-xs transition-all duration-300 hover:border-maroon/30 hover:shadow-soft"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full border border-gold/30 bg-gold-soft text-maroon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-ink">{pillar.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{pillar.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Elegant Saree Presentation Image */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xs border border-line bg-cream-warm shadow-lift ring-4 ring-gold/10">
              <Image
                src={whyImage}
                alt="Finely woven Indian silk saree with intricate gold zari"
                fill
                sizes="(min-width: 1024px) 35vw, 90vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xs border border-white/20 bg-black/60 p-3 text-white backdrop-blur-xs text-center">
                <p className="font-display text-base font-medium">{whyUs.badgeTitle}</p>
                <p className="text-[0.6875rem] text-gold-light">{whyUs.badgeSubtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
