import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

export function BrandStatement() {
  const { logo } = siteConfig.brand;

  return (
    <section aria-label="Our approach" className="section-y border-y border-line bg-canvas-deep">
      <Container size="narrow" className="flex flex-col items-center text-center">
        <Image
          src={logo.src}
          alt=""
          width={logo.width}
          height={logo.height}
          sizes="96px"
          className="size-20 rounded-full lg:size-24"
        />
        <blockquote className="mt-10">
          <p className="font-serif text-[1.75rem] leading-[1.25] font-normal text-ink sm:text-4xl lg:text-[2.5rem]">
            “We choose every saree the way a boutique owner would — by hand, by weave, and with{" "}
            <em className="text-accent-strong not-italic font-semibold">their customer</em> in mind.”
          </p>
          <footer className="type-eyebrow mt-8 text-muted uppercase tracking-widest">The {siteConfig.name} Wholesale Desk</footer>
        </blockquote>
      </Container>
    </section>
  );
}
