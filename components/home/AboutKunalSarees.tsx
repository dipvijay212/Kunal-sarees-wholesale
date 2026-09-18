import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { aboutStory } from "@/data/about";

export function AboutKunalSarees() {
  return (
    <section aria-labelledby="about-intro-heading" className="section-y border-t border-line bg-canvas-deep">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-3">
              <Logo markClassName="size-10" showWordmark={true} showTagline={true} wordmarkClassName="text-lg font-semibold tracking-wider" asLink={false} />
            </div>
            <h2 id="about-intro-heading" className="type-h2 text-ink">
              Direct from Surat weavers to boutique shelves
            </h2>
            <p className="mt-4 text-sm font-semibold tracking-widest text-accent-strong uppercase">
              Established Wholesale Excellence
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-7">
            <p className="type-lead text-muted">{aboutStory[0]}</p>
            <p className="text-sm leading-relaxed text-muted">{aboutStory[1]}</p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-ink transition-colors hover:text-accent-strong"
              >
                Learn more about our heritage
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
