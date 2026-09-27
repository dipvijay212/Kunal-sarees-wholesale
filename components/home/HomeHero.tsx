"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { siteConfig } from "@/data/site";
import type { Banner } from "@/types";

interface HomeHeroProps {
  banner?: Banner;
  stats?: { value: string; label: string }[];
}

/** Split luxury editorial hero for Kunal Sarees */
export function HomeHero({}: HomeHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-canvas">
      {/* Subtle traditional Indian textile pattern background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Image
          src="/images/editorial/hero-drape.svg"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-right opacity-35"
        />
        <div className="absolute inset-0 bg-linear-to-r from-canvas via-canvas/90 to-transparent" />
      </div>

      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Brand Statement & CTA */}
          <div className="flex flex-col items-start lg:col-span-7">
            {/* Elegant Unified Brand & Origin Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream-warm/90 px-3.5 py-1.5 shadow-xs backdrop-blur-xs">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-maroon text-[0.625rem] font-bold text-white shadow-xs">
                KS
              </span>
              <span className="font-serif text-xs font-bold tracking-wider text-ink uppercase">
                {siteConfig.name}
              </span>
              <span aria-hidden="true" className="text-gold">·</span>
              <span className="text-xs font-medium text-maroon-dark">
                {t.hero.eyebrow}
              </span>
            </div>

            {/* Main Heading - Clean, regal, with ample breathing room for Hindi matras */}
            <h1 className="mt-5 font-serif text-3xl font-medium tracking-normal text-ink sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.625rem] leading-[1.24] sm:leading-[1.22]">
              <span className="block text-ink">
                {t.hero.titleMain}
              </span>
              <span className="mt-1 block text-maroon-dark font-serif font-semibold">
                {t.hero.titleSub}
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-4 sm:mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-muted font-sans">
              {t.hero.supporting}
            </p>

            {/* CTAs */}
            <div className="mt-6 sm:mt-8 flex flex-col gap-3.5 w-full xs:w-auto xs:flex-row xs:items-center">
              <Button href="/products" size="lg" trailingIcon={<ArrowRightIcon size={18} />}>
                {t.hero.btnExplore}
              </Button>
              <WhatsAppButton
                variant="secondary"
                size="lg"
                label={t.hero.btnWhatsapp}
                className="border-maroon/30 text-maroon hover:bg-maroon hover:text-white"
              />
            </div>

            {/* Wholesale Direct Contact & Enquiry Desk */}
            <div className="mt-8 sm:mt-10 w-full max-w-xl border-t border-line/80 pt-5 sm:pt-6">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold">
                {t.hero.directSupport}
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {/* Phone & WhatsApp */}
                <a
                  href={siteConfig.contact.phoneHref}
                  className="group flex items-center gap-3.5 rounded-xs border border-line bg-surface p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-maroon/50 hover:shadow-soft"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xs bg-accent-soft text-maroon transition-colors group-hover:bg-maroon group-hover:text-white">
                    <PhoneIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-wider text-muted">
                      {t.hero.callWhatsapp}
                    </span>
                    <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-maroon truncate">
                      {siteConfig.contact.phoneDisplay}
                    </span>
                  </div>
                </a>

                {/* Wholesale Email */}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group flex items-center gap-3.5 rounded-xs border border-line bg-surface p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-soft"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xs bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                    <MailIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-wider text-muted">
                      {t.hero.wholesaleEmail}
                    </span>
                    <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-maroon truncate">
                      {siteConfig.contact.email}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: High-Quality Indian Saree Photography Showcase */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-xs border border-line-strong bg-cream-warm shadow-lift ring-4 ring-gold/15">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
                alt={t.hero.photoTagTitle}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              {/* Luxury gradient frame & badge */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />

              {/* Floating Bottom Editorial Tag */}
              <div className="absolute inset-x-4 bottom-4 rounded-xs border border-white/20 bg-black/55 p-3.5 backdrop-blur-md text-white">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-gold-light">
                      {t.hero.photoTagSub}
                    </p>
                    <p className="font-display text-base sm:text-lg font-medium">
                      {t.hero.photoTagTitle}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-xs border border-gold/40 bg-gold/20 px-2.5 py-1 text-[0.6875rem] font-medium text-gold-light uppercase tracking-[0.08em]">
                    {t.hero.moqBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle decorative gold corner frame */}
            <div className="absolute -top-3 -right-3 -z-10 size-24 border-t-2 border-r-2 border-gold/40 rounded-tr-sm hidden sm:block" />
            <div className="absolute -bottom-3 -left-3 -z-10 size-24 border-b-2 border-l-2 border-gold/40 rounded-bl-sm hidden sm:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}
