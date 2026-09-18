import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function AboutKunalSarees() {
  return (
    <section aria-labelledby="about-intro-heading" className="section-y border-t border-line bg-canvas-deep">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-3">
              <Logo markClassName="size-11" showWordmark={true} showTagline={true} wordmarkClassName="text-xl font-serif font-bold tracking-wider" asLink={false} />
            </div>
            <p className="text-xs font-semibold tracking-widest text-accent-strong uppercase">
              Surat Textile Hub &bull; Direct Manufacturer Supply
            </p>
            <h2 id="about-intro-heading" className="type-h2 mt-3 text-ink">
              The Art of Sarees, The Business of Wholesale.
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-7">
            <p className="type-lead text-ink">
              Kunal Sarees bridges the heritage of master weavers across Varanasi, Kanchipuram, Surat, and Chanderi directly with retail showrooms, boutiques, and resellers across India.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Every saree in our catalogue is meticulously evaluated for fabric purity, weave density, border finishing, and retail sales velocity. With transparent wholesale rates, practical minimum order quantities, and dedicated WhatsApp support, we empower retail partners to build profitable, repeat-selling saree inventories.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-accent-strong transition-colors hover:text-accent"
              >
                Read our story &amp; heritage
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

