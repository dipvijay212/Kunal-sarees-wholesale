import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import type { Banner } from "@/types";

interface HomeHeroProps {
  banner?: Banner;
  stats?: { value: string; label: string }[];
}

/** Split luxury editorial hero for Kunal Sarees */
export function HomeHero({}: HomeHeroProps) {
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
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.15em] text-gold uppercase">
              <span className="inline-block h-px w-6 bg-gold" />
              <span>TRADITION MEETS BUSINESS</span>
            </div>

            {/* Hero Business Badge */}
            <div className="mt-4 inline-flex items-center gap-2.5 rounded-xs border border-gold/30 bg-cream-warm/80 px-3.5 py-1.5 shadow-xs backdrop-blur-xs">
              <span className="flex size-5 items-center justify-center rounded-full bg-maroon text-[0.625rem] font-bold text-white">
                KS
              </span>
              <span className="font-display text-sm font-semibold tracking-widest text-ink uppercase">
                {siteConfig.name}
              </span>
              <span aria-hidden="true" className="text-gold">·</span>
              <span className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                {siteConfig.positioning}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="type-display mt-6 text-ink font-serif font-normal">
              <span className="block text-lg sm:text-xl font-sans font-semibold tracking-[0.1em] text-maroon uppercase mb-1">
                Kunal Sarees
              </span>
              Timeless Sarees.{" "}
              <span className="block italic text-maroon-dark font-normal">Wholesale Excellence.</span>
            </h1>

            {/* Supporting Text */}
            <p className="type-lead mt-5 max-w-xl text-muted font-sans">
              Discover exquisite saree collections curated for retailers, boutiques, resellers and wholesale buyers across India.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3.5 w-full xs:w-auto xs:flex-row xs:items-center">
              <Button href="/collections" size="lg" trailingIcon={<ArrowRightIcon size={18} />}>
                Explore Collections
              </Button>
              <WhatsAppButton
                variant="secondary"
                size="lg"
                label="Order on WhatsApp"
                className="border-maroon/40 text-maroon hover:bg-maroon hover:text-white"
              />
            </div>

            {/* Wholesale Direct Contact & Enquiry Desk */}
            <div className="mt-10 w-full max-w-xl border-t border-line/80 pt-6 sm:mt-12 sm:pt-8">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold">
                Direct Wholesale Support &amp; Enquiries
              </p>

              <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
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
                      Call / WhatsApp
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
                      Wholesale Email
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
                alt="Exquisite Indian silk saree showcase with rich zari pallu"
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
                      Surat Direct Wholesale
                    </p>
                    <p className="font-display text-base sm:text-lg font-medium">
                      Pure Banarasi & Kanjivaram Weaves
                    </p>
                  </div>
                  <span className="shrink-0 rounded-xs border border-gold/40 bg-gold/20 px-2.5 py-1 text-[0.6875rem] font-medium text-gold-light uppercase tracking-[0.08em]">
                    MOQ 5 Pcs
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

