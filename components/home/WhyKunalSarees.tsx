import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShieldCheckIcon, TagIcon, PackageIcon, ChatIcon } from "@/components/ui/Icons";

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Uncompromising Quality",
    description:
      "Every single saree undergoes a rigorous 3-stage quality check for weave consistency, thread purity, zari shimmer, and flawless pallu borders before packing.",
  },
  {
    icon: TagIcon,
    title: "Dedicated Wholesale Focus",
    description:
      "We operate exclusively for B2B buyers. Enjoy low minimum order quantities (MOQs starting from single bridal pieces) and set minimums designed to maximize boutique profit margins.",
  },
  {
    icon: PackageIcon,
    title: "Extensive Heritage Variety",
    description:
      "Access over 200+ curated designs across pure Banarasi Katan silk, Kanjivaram korvai weaves, Organza tissue, Bandhani, and contemporary bridal trousseau edits.",
  },
  {
    icon: ChatIcon,
    title: "Reliable Direct Ordering",
    description:
      "No complex portals or hidden fees. Experience personal service on WhatsApp with guaranteed dispatch timelines, real-time stock verification, and direct door delivery across India.",
  },
];

export function WhyKunalSarees() {
  return (
    <section aria-labelledby="why-us-heading" className="section-y border-t border-line bg-canvas-deep">
      <Container>
        <SectionHeading
          id="why-us-heading"
          eyebrow="The Kunal Sarees Advantage"
          title="Built specifically for saree retailers and boutique owners"
          description="We blend generations of textile craftsmanship with modern wholesale efficiency."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative flex flex-col rounded-xs border border-line bg-canvas p-7 transition-all duration-300 hover:border-accent/40 hover:shadow-lg"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-accent/20 bg-accent/5 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-xl text-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
