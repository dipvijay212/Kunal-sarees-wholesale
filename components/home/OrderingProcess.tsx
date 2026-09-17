import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProcessStep } from "@/types";

interface OrderingProcessProps {
  steps: ProcessStep[];
  /** Show the "Start browsing" link below the steps. */
  showAction?: boolean;
}

export function OrderingProcess({ steps, showAction = true }: OrderingProcessProps) {
  return (
    <section aria-labelledby="ordering-heading" className="section-y border-y border-line bg-canvas-deep">
      <Container>
        <SectionHeading
          id="ordering-heading"
          eyebrow="How wholesale ordering works"
          title="From shortlist to shelf in four steps"
          description="No accounts, carts or online payments. Build your order list here and finalise everything directly with our team."
          align="center"
        />

        <ol className="mt-14 grid gap-px overflow-hidden rounded-xs border border-line bg-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-4 bg-canvas-deep p-7 lg:p-9">
              <span className="font-display text-4xl leading-none text-accent">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="type-h4 text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.description}</p>
            </li>
          ))}
        </ol>

        {showAction ? (
          <div className="mt-12 flex justify-center">
            <Button href="/products" variant="secondary">
              Start browsing
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
