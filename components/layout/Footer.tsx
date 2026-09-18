"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import { useSettings } from "@/hooks/use-settings";
import { getDirectionsUrl } from "@/data/site";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Wholesale Terms", href: "/wholesale" },
  { label: "About Kunal Sarees", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const footerCollections = [
  { label: "Banarasi Sarees", href: "/collections/premium-banarasi" },
  { label: "Silk Sarees", href: "/collections/silk-collection" },
  { label: "Georgette Sarees", href: "/products?category=georgette-sarees" },
  { label: "Cotton Sarees", href: "/products?category=cotton-sarees" },
  { label: "Organza Sarees", href: "/products?category=organza-sarees" },
  { label: "Bridal Collection", href: "/collections/bridal-collection" },
];

export function Footer() {
  const settings = useSettings();
  const contact = settings.contact;
  const year = 2026;

  return (
    <footer className="border-t border-gold/30 bg-maroon-dark text-cream">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand Info (Span 4) */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
            <Logo
              tone="light"
              markClassName="size-12"
              wordmarkClassName="text-xl text-cream font-serif font-bold tracking-wider"
              showTagline
            />
            <p className="max-w-sm text-sm leading-relaxed text-cream/90 mt-1">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <WhatsAppButton
                size="sm"
                label="WhatsApp Enquiry"
                className="bg-gold hover:bg-gold-light text-maroon-dark font-bold border-transparent"
              />
              <SocialLinks className="[&_a]:border-gold/40 [&_a]:text-cream [&_a:hover]:border-gold-light [&_a:hover]:text-gold-light [&_a:hover]:bg-maroon" />
            </div>
          </div>

          {/* Column 2: Quick Links (Span 2) */}
          <nav aria-labelledby="footer-quick-links" className="lg:col-span-2">
            <h2 id="footer-quick-links" className="type-eyebrow text-gold-light font-bold tracking-widest uppercase text-xs">
              Quick Links
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {footerQuickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex py-0.5 text-sm text-cream/90 transition-colors hover:text-gold-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Collections (Span 3) */}
          <nav aria-labelledby="footer-collections" className="lg:col-span-3">
            <h2 id="footer-collections" className="type-eyebrow text-gold-light font-bold tracking-widest uppercase text-xs">
              Collections
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {footerCollections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex py-0.5 text-sm text-cream/90 transition-colors hover:text-gold-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Contact Details (Span 3) */}
          <div className="lg:col-span-3">
            <h2 className="type-eyebrow text-gold-light font-bold tracking-widest uppercase text-xs">
              Contact
            </h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-cream/90">
              <li className="flex items-start gap-2.5">
                <MapPinIcon size={18} className="mt-0.5 shrink-0 text-gold-light" />
                <address className="not-italic text-xs sm:text-sm text-cream/90">
                  <span className="block text-cream">{contact.address.lines.join(", ")}</span>
                  <span className="block text-cream/80">{contact.address.city}, {contact.address.region} {contact.address.postalCode}</span>
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-[0.6875rem] font-bold uppercase tracking-wider text-gold-light underline hover:text-white"
                  >
                    Get Directions &rarr;
                  </a>
                </address>
              </li>

              <li className="flex items-center gap-2.5">
                <PhoneIcon size={16} className="shrink-0 text-gold-light" />
                <a href={contact.phoneHref} className="text-cream/90 hover:text-gold-light transition-colors text-xs sm:text-sm">
                  {contact.phoneDisplay}
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <WhatsAppIcon size={16} className="shrink-0 text-gold-light" />
                <a
                  href={buildWhatsAppUrl(defaultWhatsAppMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/90 hover:text-gold-light transition-colors text-xs sm:text-sm font-semibold"
                >
                  WhatsApp: +{contact.whatsappNumber}
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <MailIcon size={16} className="shrink-0 text-gold-light" />
                <a href={`mailto:${contact.email}`} className="text-cream/90 hover:text-gold-light transition-colors text-xs sm:text-sm">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Copyright Bar */}
      <div className="border-t border-gold/15 bg-black/25">
        <Container className="flex flex-col gap-2 py-4 pb-20 text-xs text-cream/80 sm:flex-row sm:items-center sm:justify-between lg:pb-4">
          <p>&copy; {year} {siteConfig.name}. All Rights Reserved.</p>
          <p className="text-gold-light font-medium">{siteConfig.positioning} &bull; Surat B2B Wholesale</p>
        </Container>
      </div>
    </footer>
  );
}


