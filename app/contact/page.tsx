import type { Metadata } from "next";
import { ContactDetails } from "@/components/layout/ContactDetails";
import { PageHeader } from "@/components/layout/PageHeader";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { formatAddress, getDirectionsUrl, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Kunal Sarees wholesale team on WhatsApp, by phone or email, or visit us in Surat.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { contact } = siteConfig;

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: `+${contact.whatsappNumber}`,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.lines.join(", "),
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: "IN",
    },
    sameAs: siteConfig.social.map((link) => link.href),
  };

  const methods = [
    {
      icon: <WhatsAppIcon size={22} />,
      title: "WhatsApp",
      description: "The fastest way to reach us for stock checks, live videos and orders.",
      action: <WhatsAppButton size="sm" label="Start a chat" />,
    },
    {
      icon: <PhoneIcon size={22} />,
      title: "Call",
      description: contact.phoneDisplay,
      action: (
        <a href={contact.phoneHref} className="btn btn--secondary btn--sm">
          Call now
        </a>
      ),
    },
    {
      icon: <MailIcon size={22} />,
      title: "Email",
      description: contact.email,
      action: (
        <a href={`mailto:${contact.email}`} className="btn btn--secondary btn--sm">
          Send an email
        </a>
      ),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c") }}
      />

      <PageHeader
        eyebrow="Contact"
        title="Speak with our wholesale team"
        description="Reach us on WhatsApp, by phone or email, or visit us in Surat. We usually reply within business hours on the same day."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section aria-label="Ways to contact us" className="section-y-sm">
        <Container>
          <ul className="grid gap-4 md:grid-cols-3">
            {methods.map((method) => (
              <li key={method.title} className="card card__body flex flex-col gap-4">
                <span className="text-accent">{method.icon}</span>
                <div className="min-w-0">
                  <h2 className="type-h4 text-ink">{method.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed [overflow-wrap:anywhere] text-muted">{method.description}</p>
                </div>
                <div className="mt-auto pt-2">{method.action}</div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="visit-heading" className="section-y border-t border-line">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-5">
            <h2 id="visit-heading" className="type-h2 text-ink">
              Visit us
            </h2>
            <p className="mt-4 text-muted">
              Retailers are welcome to view collections in person. Please message ahead so we can have the right sets
              ready for you.
            </p>
            <ContactDetails className="mt-8" />
            <div className="mt-8">
              <p className="type-eyebrow text-subtle">Follow us</p>
              <SocialLinks className="mt-3" />
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Static location panel — swap for an embedded map once the address is confirmed. */}
            <div className="card flex aspect-[4/3] flex-col items-center justify-center gap-5 p-6 text-center sm:aspect-[16/10]">
              <p className="type-eyebrow text-accent-strong">
                {contact.address.city}, {contact.address.region}
              </p>
              <p className="max-w-sm font-display text-2xl leading-snug text-ink sm:text-3xl">{formatAddress()}</p>
              <Button href={getDirectionsUrl()} external variant="secondary" size="sm">
                Open in Google Maps
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
