"use client";

import type { ReactNode } from "react";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getDirectionsUrl } from "@/data/site";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/cn";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";

function DetailRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex min-w-0 items-start gap-3">
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="sr-only">{label}</p>
        {children}
      </div>
    </li>
  );
}

const linkClass = "[overflow-wrap:anywhere] text-ink transition-colors hover:text-accent-strong";

interface ContactDetailsProps {
  /** Include opening hours. */
  showHours?: boolean;
  className?: string;
}

/** Address, phone, WhatsApp, email and hours from the site config. */
export function ContactDetails({ showHours = true, className }: ContactDetailsProps) {
  const settings = useSettings();
  const contact = settings.contact;

  return (
    <ul className={cn("flex flex-col gap-5 text-sm leading-relaxed", className)}>
      <DetailRow icon={<MapPinIcon size={18} />} label="Business address">
        <address className="text-muted not-italic">
          {contact.address.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block">
            {contact.address.city}, {contact.address.region} {contact.address.postalCode}
          </span>
        </address>
        <a
          href={getDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex min-h-8 items-center text-xs font-semibold tracking-[0.14em] text-ink uppercase transition-colors hover:text-accent-strong"
        >
          Get directions
        </a>
      </DetailRow>

      <DetailRow icon={<PhoneIcon size={18} />} label="Phone">
        <a href={contact.phoneHref} className={linkClass}>
          {contact.phoneDisplay}
        </a>
      </DetailRow>

      <DetailRow icon={<WhatsAppIcon size={18} />} label="WhatsApp">
        <a href={buildWhatsAppUrl(defaultWhatsAppMessage)} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Chat on WhatsApp
        </a>
      </DetailRow>

      <DetailRow icon={<MailIcon size={18} />} label="Email">
        <a href={`mailto:${contact.email}`} className={linkClass}>
          {contact.email}
        </a>
      </DetailRow>

      {showHours ? (
        <DetailRow icon={<ClockIcon size={18} />} label="Business hours">
          <dl className="flex flex-col gap-1 text-muted">
            {contact.hours.map((entry) => (
              <div key={entry.days} className="flex flex-wrap gap-x-2">
                <dt>{entry.days}</dt>
                <dd className="text-ink">{entry.hours}</dd>
              </div>
            ))}
          </dl>
        </DetailRow>
      ) : null}
    </ul>
  );
}
