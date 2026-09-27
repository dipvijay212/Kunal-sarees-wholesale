"use client";

import { WholesaleEnquiryForm } from "@/components/contact/WholesaleEnquiryForm";
import { OrderingProcess } from "@/components/home/OrderingProcess";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function WholesalePageContent() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <PageHeader
        eyebrow={t.wholesale.eyebrow}
        title={t.wholesale.title}
        description={t.wholesale.subtitle}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: isHi ? "होलसेल" : "Wholesale" },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
          <Button href="#enquiry">{isHi ? "हमसे जुड़ें" : "Connect with Us"}</Button>
          <Button href="/products" variant="secondary">
            {t.products.viewAllFull}
          </Button>
        </div>
      </PageHeader>

      <section aria-labelledby="terms-heading" className="section-y">
        <Container>
          <SectionHeading
            id="terms-heading"
            eyebrow={isHi ? "नियम व शर्तें" : "Terms & Guidelines"}
            title={isHi ? "ऑर्डर करते समय क्या ध्यान रखें" : "Important Wholesale Information"}
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.wholesale.terms.map((term) => (
              <li key={term.title} className="card card__body">
                <h3 className="type-h4 text-ink">{term.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{term.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <OrderingProcess showAction={false} />

      <section aria-labelledby="audience-heading" className="section-y">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="audience-heading"
              eyebrow={isHi ? "हमारे ग्राहक" : "Our Partners"}
              title={t.wholesale.audienceTitle}
              description={
                isHi
                  ? "चाहे आपकी छोटी दुकान हो, बड़ा बुटीक या ऑनलाइन स्टोर — हमारा कलेक्शन और न्यूनतम ऑर्डर आपके बिज़नेस के लिए पूरी तरह अनुकूल हैं।"
                  : "Whether you run a local boutique, a multi-brand saree showroom, or an online business — our flexible MOQs and direct Surat pricing fit your model perfectly."
              }
            />
            <ul className="mt-8 flex flex-col gap-3">
              {t.wholesale.audiences.map((audience) => (
                <li key={audience} className="flex items-start gap-3 text-ink">
                  <CheckIcon size={18} className="mt-1 shrink-0 text-accent" />
                  {audience}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h2 className="type-eyebrow text-accent-strong">{t.wholesale.faqTitle}</h2>
            <div className="mt-6 border-t border-line">
              {t.wholesale.faqs.map((faq) => (
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
              eyebrow={isHi ? "हमसे जुड़ें" : "Direct Enquiry"}
              title={isHi ? "अपनी दुकान के बारे में बताएं" : "Tell Us About Your Requirements"}
              description={
                isHi
                  ? "हम तुरंत WhatsApp पर आपको नया कैटलॉग, रेट और ऑर्डर प्रक्रिया भेजेंगे।"
                  : "We'll send you our latest catalog, bulk rates, and dispatch timelines directly on WhatsApp."
              }
            />
            <div className="mt-8">
              <WhatsAppButton
                variant="secondary"
                label={isHi ? "सीधे WhatsApp पर बात करें" : "Chat on WhatsApp"}
              />
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
