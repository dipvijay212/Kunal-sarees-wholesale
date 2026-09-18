import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { unsplashImage } from "@/data/images";

export function FeaturedBanner() {
  const image = unsplashImage("1774437897985-9a7f1b7867a8", "Festive Saree Collection");

  return (
    <section aria-label="Featured Collection Banner" className="section-y border-t border-line">
      <Container>
        <div className="group relative overflow-hidden rounded-xs bg-charcoal-950 text-white">
          <div className="grid min-h-[28rem] lg:grid-cols-12">
            <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:col-span-7 lg:p-16">
              <span className="type-eyebrow text-ice-300">Festive 2026 Collection</span>
              <h2 className="font-display text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl">
                Navratri & Wedding Festive Sets
              </h2>
              <p className="mt-4 max-w-xl text-base text-silver-200">
                Sequin highlights, bandhani silks, and mirror work curated for high season demand. Ready for fast bulk dispatch with flexible set ordering.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/collections/festive-collection" size="lg" trailingIcon={<ArrowRightIcon size={18} />}>
                  Explore Festive Collection
                </Button>
                <Link
                  href="/wholesale#terms"
                  className="text-xs font-semibold tracking-wider text-silver-300 uppercase transition-colors hover:text-white"
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
                className="absolute inset-0 bg-linear-to-t from-charcoal-950 via-charcoal-950/40 to-transparent lg:bg-linear-to-r lg:from-charcoal-950 lg:via-transparent lg:to-transparent"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
