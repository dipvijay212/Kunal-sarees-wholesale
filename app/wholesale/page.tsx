import type { Metadata } from "next";
import { WholesaleEnquiryForm } from "@/components/contact/WholesaleEnquiryForm";
import { OrderingProcess } from "@/components/home/OrderingProcess";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { orderingSteps } from "@/data/home";
import { wholesaleAudiences, wholesaleFaqs, wholesaleTerms } from "@/data/wholesale";

export const metadata: Metadata = {
  title: "Wholesale",
  description:
    "Wholesale terms for boutiques and retailers: minimum orders, per-piece pricing, payment and dispatch. Become a Kunal Sarees stockist.",
  alternates: { canonical: "/wholesale" },
};

export default function WholesalePage() {
  return (
    <>
      <PageHeader
        eyebrow="Wholesale"
        title="Wholesale made simple for boutiques and retailers"
        description="Transparent per-piece rates, practical minimum orders and a team you can reach on WhatsApp. Here is how working with us works."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wholesale" }]}
      >
        <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
          <Button href="#enquiry">Become a stockist</Button>
          <Button href="/products" variant="secondary">
            Browse catalogue
          </Button>
        </div>
      </PageHeader>

      <section aria-labelledby="terms-heading" className="section-y">
        <Container>
          <SectionHeading id="terms-heading" eyebrow="Terms" title="What to expect when you order" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wholesaleTerms.map((term) => (
              <li key={term.title} className="card card__body">
                <h3 className="type-h4 text-ink">{term.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{term.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <OrderingProcess steps={orderingSteps} showAction={false} />

      <section aria-labelledby="audience-heading" className="section-y">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="audience-heading"
              eyebrow="Who we supply"
              title="Built for businesses that sell sarees"
              description="Whether you run a single boutique or sell online, our catalogue and minimums are designed to fit."
            />
            <ul className="mt-8 flex flex-col gap-3">
              {wholesaleAudiences.map((audience) => (
                <li key={audience} className="flex items-start gap-3 text-ink">
                  <CheckIcon size={18} className="mt-1 shrink-0 text-accent" />
                  {audience}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h2 className="type-eyebrow text-accent-strong">Frequently asked</h2>
            <div className="mt-6 border-t border-line">
              {wholesaleFaqs.map((faq) => (
                <details key={faq.question} className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-ink [&::-webkit-details-marker]:hidden">
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDownIcon
                      size={18}
                      className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="enquiry" aria-labelledby="enquiry-heading" className="section-y scroll-mt-header border-t border-line">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              id="enquiry-heading"
              eyebrow="Become a stockist"
              title="Tell us about your store"
              description="We reply on WhatsApp with current catalogues, availability and wholesale terms."
            />
            <div className="mt-8">
              <WhatsAppButton variant="secondary" label="Prefer to chat directly?" />
            </div>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <WholesaleEnquiryForm />
          </div>
        </Container>
      </section>
    </>
  );
}
