"use client";

import { ContactDetails } from "@/components/layout/ContactDetails";
import { PageHeader } from "@/components/layout/PageHeader";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { formatAddress, getDirectionsUrl, siteConfig } from "@/data/site";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function ContactPageContent() {
  const { t, language } = useLanguage();
  const { contact } = siteConfig;
  const isHi = language === "hi";

  const methods = [
    {
      icon: <WhatsAppIcon size={22} />,
      title: "WhatsApp",
      description: isHi
        ? "स्टॉक चेक, लाइव वीडियो और तुरंत ऑर्डर के लिए सबसे आसान तरीका।"
        : "Fastest way for stock check, video walkthroughs, and direct wholesale dispatch.",
      action: <WhatsAppButton size="sm" label={isHi ? "WhatsApp पर बात करें" : "Chat on WhatsApp"} />,
    },
    {
      icon: <PhoneIcon size={22} />,
      title: isHi ? "फोन" : "Phone Call",
      description: contact.phoneDisplay,
      action: (
        <a href={contact.phoneHref} className="btn btn--secondary btn--sm">
          {isHi ? "अभी कॉल करें" : "Call Now"}
        </a>
      ),
    },
    {
      icon: <MailIcon size={22} />,
      title: isHi ? "ईमेल" : "Email",
      description: contact.email,
      action: (
        <a href={`mailto:${contact.email}`} className="btn btn--secondary btn--sm">
          {isHi ? "ईमेल भेजें" : "Send Email"}
        </a>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        description={t.contact.subtitle}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: isHi ? "संपर्क" : "Contact" },
        ]}
      />

      <section aria-label="Contact channels" className="section-y-sm">
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
              {isHi ? "हमारी दुकान पर आएं" : "Visit Our Surat Warehouse"}
            </h2>
            <p className="mt-4 text-muted">
              {isHi
                ? "दुकानदार और बुटीक ओनर्स सूरत में हमारी दुकान पर आकर भी साड़ियां देख सकते हैं। कृपया आने से पहले WhatsApp पर समय तय कर लें।"
                : "Boutique owners and saree retailers are welcome to visit our Surat shop to inspect weaves in person. Please message ahead on WhatsApp."}
            </p>
            <ContactDetails className="mt-8" />
            <div className="mt-8">
              <p className="type-eyebrow text-subtle">{isHi ? "सोशल मीडिया पर जुड़ें" : "Follow Us"}</p>
              <SocialLinks className="mt-3" />
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Static location panel */}
            <div className="card flex aspect-[4/3] flex-col items-center justify-center gap-5 p-6 text-center sm:aspect-[16/10]">
              <p className="type-eyebrow text-accent-strong">
                {contact.address.city}, {contact.address.region}
              </p>
              <p className="max-w-sm font-display text-2xl leading-snug text-ink sm:text-3xl">{formatAddress()}</p>
              <Button href={getDirectionsUrl()} external variant="secondary" size="sm">
                {isHi ? "गूगल मैप्स पर देखें" : "View on Google Maps"}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
