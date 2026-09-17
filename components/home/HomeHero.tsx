import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";

interface HomeHeroProps {
  stats: { value: string; label: string }[];
}

/** Full-bleed hero that sits beneath the transparent header. */
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
          className="object-cover object-right opacity-35 lg:opacity-60"
        />
        {/* Keeps the headline legible over the artwork */}
        <div className="absolute inset-0 bg-linear-to-r from-canvas via-canvas/80 to-transparent" />
      </div>

      <Container className="flex min-h-[calc(100svh-var(--ks-header-height))] flex-col justify-center py-16 lg:min-h-[42rem] lg:py-24">
        <div className="max-w-3xl">
          <p className="type-eyebrow flex items-center gap-3 text-accent-strong">
            <span aria-hidden="true" className="h-px w-10 shrink-0 bg-accent" />
            {siteConfig.positioning}
          </p>

          <h1 className="type-display mt-6 text-ink">
            Heirloom weaves, <span className="text-silver-300 italic">curated for boutiques</span>
          </h1>

          <p className="type-lead mt-6 max-w-xl text-muted">
            {siteConfig.name} supplies retailers across India with Banarasi, Kanjivaram, organza and bridal sarees —
            selected for weave, finish and how well they sell.
          </p>

          <div className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <Button href="/collections" size="lg" trailingIcon={<ArrowRightIcon size={18} />}>
              Explore collections
            </Button>
            <WhatsAppButton variant="secondary" size="lg" label="Wholesale enquiry" />
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
