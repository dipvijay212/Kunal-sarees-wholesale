import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { footerQuickLinks } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { getAllCollections } from "@/lib/catalog";
import type { NavItem } from "@/types";
import { ContactDetails } from "./ContactDetails";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

function FooterLinkList({ id, title, items }: { id: string; title: string; items: NavItem[] }) {
  return (
    <nav aria-labelledby={id} className="min-w-0">
      <h2 id={id} className="type-eyebrow text-accent-strong">
        {title}
      </h2>
      <ul className="mt-5 flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-9 items-center text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const collectionLinks: NavItem[] = getAllCollections().map((collection) => ({
    label: collection.name,
    href: `/collections/${collection.slug}`,
  }));
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-canvas-deep">
      <Container className="py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Logo markClassName="size-14" wordmarkClassName="text-xl" showTagline />
            <p className="max-w-sm text-sm leading-relaxed text-muted">{siteConfig.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <WhatsAppButton size="sm" label="WhatsApp us" />
              <SocialLinks />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-5">
            <FooterLinkList id="footer-quick-links" title="Quick links" items={footerQuickLinks} />
            <FooterLinkList id="footer-collections" title="Collections" items={collectionLinks} />
          </div>

          <div className="min-w-0 lg:col-span-3">
            <h2 className="type-eyebrow text-accent-strong">Contact</h2>
            <ContactDetails className="mt-5" />
          </div>
        </div>
      </Container>

      <div className="border-t border-line">
        {/* Extra bottom space on small screens keeps the floating WhatsApp button clear of this text */}
        <Container className="flex flex-col gap-2 pt-6 pb-24 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between lg:pb-6">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.positioning} · Wholesale rates exclude GST</p>
        </Container>
      </div>
    </footer>
  );
}
