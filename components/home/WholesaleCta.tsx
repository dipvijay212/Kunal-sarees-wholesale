import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function WholesaleCta() {
  return (
    <section aria-labelledby="cta-heading" className="section-y-sm">
      <Container>
        <div className="card px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="type-eyebrow text-accent-strong">For retailers and boutiques</p>
              <h2 id="cta-heading" className="type-h2 mt-5 text-ink">
                Stock the season’s finest sarees
              </h2>
              <p className="mt-5 text-muted">
                Share your store details and we will send current catalogues, availability and wholesale terms on
                WhatsApp.
              </p>
            </div>
            <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap lg:shrink-0">
              <WhatsAppButton size="lg" label="Chat on WhatsApp" />
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
