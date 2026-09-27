"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { ProcessStep } from "@/types";

interface OrderingProcessProps {
  steps?: ProcessStep[];
  /** Show the CTA below the steps. */
  showAction?: boolean;
}

export function OrderingProcess({ steps, showAction = true }: OrderingProcessProps) {
  const { t, language } = useLanguage();
  const { process } = t;
  const activeSteps = steps && steps.length > 0 ? steps : process.steps;

  return (
    <section aria-labelledby="ordering-heading" className="section-y border-y border-line bg-cream-warm/50">
      <Container>
        <SectionHeading
          id="ordering-heading"
          eyebrow={process.eyebrow}
          title={process.title}
          description={process.description}
          align="center"
        />

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {activeSteps.map((step, index) => (
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
                {language === "en" ? `Step ${index + 1} of 4` : `स्टेप ${index + 1} (कुल 4)`}
              </div>
            </li>
          ))}
        </ol>

        {/* Wholesale Trust Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted">
          <ShieldCheckIcon size={16} className="text-maroon shrink-0" />
          <span>{process.trustNote}</span>
        </div>

        {showAction ? (
          <div className="mt-8 flex justify-center">
            <Button href="/products" size="lg" trailingIcon={<ArrowRightIcon size={18} />}>
              {process.startOrderBtn}
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
