import Image from "next/image";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { Banner } from "@/types";

interface HomeHeroProps {
  banner?: Banner;
  stats: { value: string; label: string }[];
}

/** Full-bleed hero that sits beneath the header. */
export function HomeHero({ stats }: HomeHeroProps) {
  return (
    <section className="under-header relative isolate overflow-hidden border-b border-line bg-canvas">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src="/images/editorial/hero-drape.svg"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-right opacity-40 lg:opacity-65"
        />
        {/* Gradient overlays to ensure high visual quality and text legibility */}
        <div className="absolute inset-0 bg-linear-to-r from-canvas via-canvas/90 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-canvas via-transparent to-transparent opacity-80" />
      </div>

      <Container className="flex min-h-[calc(100svh-var(--ks-header-height))] flex-col justify-center py-16 lg:min-h-[44rem] lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 backdrop-blur-xs">
            <Logo markClassName="size-7" showWordmark={true} showTagline={true} wordmarkClassName="text-sm font-semibold tracking-widest text-ink" asLink={false} />
          </div>

          <h1 className="type-display mt-3 text-ink">
            Timeless Sarees. <span className="text-accent-strong italic">Wholesale Excellence.</span>
          </h1>

          <p className="type-lead mt-6 max-w-2xl text-muted">
            Discover premium saree collections curated for retailers, boutiques, resellers and wholesale buyers.
          </p>

          <div className="mt-10 flex flex-col gap-3.5 xs:flex-row xs:flex-wrap xs:items-center">
            <Button href="/collections" size="lg" trailingIcon={<ArrowRightIcon size={18} />}>
              Explore Collections
            </Button>
            <WhatsAppButton variant="secondary" size="lg" label="Order on WhatsApp" />
          </div>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-4 border-t border-line pt-8 sm:gap-6 lg:mt-20">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-col-reverse gap-1.5">
              <dt className="text-[0.625rem] font-semibold tracking-[0.14em] text-muted uppercase sm:text-[0.6875rem]">
                {stat.label}
              </dt>
              <dd className="font-display text-3xl text-ink sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
