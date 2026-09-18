import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function WholesaleCta() {
  return (
    <section aria-labelledby="cta-heading" className="section-y border-t border-line">
      <Container>
        <div className="card px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="type-eyebrow text-accent-strong">Direct Wholesale Desk</p>
              <h2 id="cta-heading" className="type-h2 mt-5 text-ink">
                Looking for bulk saree requirements?
              </h2>
              <p className="mt-5 text-muted">
                Connect directly with the Kunal Sarees team on WhatsApp to get real-time availability, custom volume rates, and digital catalogues.
              </p>
            </div>
            <div className="flex flex-col gap-3.5 xs:flex-row xs:flex-wrap lg:shrink-0">
              <WhatsAppButton size="lg" label="Talk to Kunal Sarees" />
              <Button href="/wholesale#enquiry" variant="secondary" size="lg">
                Become a stockist
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
