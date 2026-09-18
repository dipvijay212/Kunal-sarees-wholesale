import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import type { Banner } from "@/types";

interface HomeHeroProps {
  banner?: Banner;
  stats: { value: string; label: string }[];
}

/** Split luxury editorial hero for Kunal Sarees */
export function HomeHero({ stats }: HomeHeroProps) {
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

            {/* Wholesale Stats */}
            <dl className="mt-10 grid w-full max-w-lg grid-cols-3 gap-3 border-t border-line/80 pt-6 sm:gap-6 lg:mt-14">
              {stats.map((stat) => (
                <div key={stat.label} className="flex min-w-0 flex-col-reverse gap-1">
                  <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted uppercase">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-2xl sm:text-3xl font-semibold text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
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

