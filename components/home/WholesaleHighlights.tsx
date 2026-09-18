import type { ComponentType } from "react";
import { Container } from "@/components/ui/Container";
import { ChatIcon, PackageIcon, ShieldCheckIcon, TagIcon, type IconProps } from "@/components/ui/Icons";
import type { Highlight } from "@/types";

const icons: ComponentType<IconProps>[] = [ShieldCheckIcon, TagIcon, PackageIcon, ChatIcon];

export function WholesaleHighlights({ highlights }: { highlights: Highlight[] }) {
  return (
    <section aria-label="Wholesale Buyer Benefits" className="border-b border-line bg-white/60">
      <Container>
        <ul className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-line">
          {highlights.map((highlight, index) => {
            const Icon = icons[index % icons.length];
            return (
              <li key={highlight.title} className="flex items-start gap-3.5 py-6 sm:py-8 lg:px-6 lg:first:pl-0 lg:last:pr-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold-soft text-maroon shadow-xs">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-sans text-sm font-bold tracking-tight text-ink">{highlight.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{highlight.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

