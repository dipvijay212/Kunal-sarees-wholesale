import type { ComponentType } from "react";
import { Container } from "@/components/ui/Container";
import { ChatIcon, PackageIcon, ShieldCheckIcon, TagIcon, type IconProps } from "@/components/ui/Icons";
import type { Highlight } from "@/types";

const icons: ComponentType<IconProps>[] = [TagIcon, PackageIcon, ShieldCheckIcon, ChatIcon];

export function WholesaleHighlights({ highlights }: { highlights: Highlight[] }) {
  return (
    <section aria-label="Why retailers work with us" className="border-b border-line">
      <Container>
        <ul className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {highlights.map((highlight, index) => {
            const Icon = icons[index % icons.length];
            return (
              <li key={highlight.title} className="flex gap-4 py-7 sm:py-10 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <Icon size={24} className="mt-0.5 shrink-0 text-accent" />
                <div className="min-w-0">
                  <h2 className="font-sans text-sm font-semibold tracking-normal text-ink">{highlight.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{highlight.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
