import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProcessStep } from "@/types";

interface OrderingProcessProps {
  steps: ProcessStep[];
  /** Show the CTA below the steps. */
  showAction?: boolean;
}

export function OrderingProcess({ steps, showAction = true }: OrderingProcessProps) {
  return (
    <section aria-labelledby="ordering-heading" className="section-y border-y border-line bg-cream-warm/50">
      <Container>
        <SectionHeading
          id="ordering-heading"
          eyebrow="Direct Wholesale Process"
          title="Wholesale Made Simple"
          description="We operate purely for business buyers with transparent wholesale rates. No online payment gateways — your complete order request is sent directly to Kunal Sarees via WhatsApp."
          align="center"
        />

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col justify-between rounded-xs border border-line bg-surface p-6 sm:p-7 shadow-xs transition-all duration-300 hover:border-line-strong hover:shadow-soft"
            >
              <div>
                <span className="font-display text-4xl font-bold leading-none text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="type-h4 mt-4 text-ink font-serif">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{step.description}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-line/40 text-[0.6875rem] font-semibold tracking-[0.08em] text-maroon uppercase">
                Step {index + 1} of 4
              </div>
            </li>
          ))}
        </ol>

        {/* Wholesale Trust Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted">
          <ShieldCheckIcon size={16} className="text-maroon shrink-0" />
          <span>No payment taken on the website. Final billing and dispatch terms are confirmed personally by Kunal Sarees.</span>
        </div>

        {showAction ? (
          <div className="mt-8 flex justify-center">
            <Button href="/products" size="lg" trailingIcon={<ArrowRightIcon size={18} />}>
              Start Your Wholesale Order
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

