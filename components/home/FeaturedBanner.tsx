import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { unsplashImage } from "@/data/images";

export function FeaturedBanner() {
  const image = unsplashImage("1610030469983-98e550d6193c", "Festive Banarasi & Wedding Saree Collection");

  return (
    <section aria-label="Featured Collection Banner" className="section-y border-t border-line">
      <Container>
        <div className="group relative overflow-hidden rounded-xs bg-accent-deep text-canvas border border-accent-light/20 shadow-xl">
          <div className="grid min-h-[28rem] lg:grid-cols-12">
            <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:col-span-7 lg:p-16">
              <span className="type-eyebrow text-accent-light tracking-widest uppercase">Festive &amp; Wedding 2026 Edit</span>
              <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl mt-3 text-canvas">
                Navratri &amp; Wedding Festive Sets
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-canvas/85">
                Zari embellishments, heritage bandhani silks, and pure tissue organza curated for peak retail season demand. Ready for fast bulk dispatch with flexible set ordering.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/collections/bridal-collection" size="lg" trailingIcon={<ArrowRightIcon size={18} />}>
                  Explore Bridal &amp; Festive
                </Button>
                <Link
                  href="/wholesale"
                  className="text-xs font-semibold tracking-wider text-accent-light uppercase transition-colors hover:text-white"
                >
                  View Wholesale Terms &rarr;
                </Link>
              </div>
            </div>

            <div className="relative min-h-[20rem] lg:col-span-5 lg:min-h-full">
              <RemoteImage
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-accent-deep via-accent-deep/40 to-transparent lg:bg-linear-to-r lg:from-accent-deep lg:via-transparent lg:to-transparent"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

