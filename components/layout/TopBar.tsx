"use client";

import { Container } from "@/components/ui/Container";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SocialLinks } from "./SocialLinks";

export function TopBar() {
  const { t } = useLanguage();

  return (
    <aside
      aria-label="Announcement & Contact Bar"
      className="relative z-50 border-b border-maroon-dark/40 bg-maroon text-[0.6875rem] text-cream"
    >
      <Container className="flex h-9 items-center justify-between gap-4">
        {/* Left / Center: Key wholesale brand guarantees */}
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-xs font-medium tracking-wide whitespace-nowrap sm:gap-2.5 sm:text-[0.6875rem]">
          <span className="font-semibold text-gold-light">{t.topBar.brandName}</span>
          <span aria-hidden="true" className="text-gold-light/60">|</span>
          <span className="truncate">{t.topBar.qualityTag}</span>
          <span aria-hidden="true" className="hidden text-gold-light/60 sm:inline">|</span>
          <span className="hidden sm:inline">{t.topBar.wholesaleOnly}</span>
          <span aria-hidden="true" className="hidden text-gold-light/60 md:inline">|</span>
          <span className="hidden text-cream/90 md:inline">{t.topBar.trustBadge}</span>
        </div>

        {/* Right: Direct Contact & Social */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a
            href={siteConfig.contact.phoneHref}
            className="inline-flex items-center gap-1.5 font-sans font-medium text-cream/90 transition-colors hover:text-gold-light"
          >
            <PhoneIcon size={13} className="text-gold-light" />
            <span>{siteConfig.contact.phoneDisplay}</span>
          </a>
          <span aria-hidden="true" className="text-gold-light/40">|</span>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="inline-flex items-center gap-1.5 font-sans font-medium text-cream/90 transition-colors hover:text-gold-light"
          >
            <MailIcon size={13} className="text-gold-light" />
            <span>{siteConfig.contact.email}</span>
          </a>
          <span aria-hidden="true" className="text-gold-light/40">|</span>
          <div className="flex items-center text-cream">
            <SocialLinks size="sm" variant="ghost" itemClassName="text-cream/90 hover:text-gold-light hover:bg-white/10" />
          </div>
        </div>
      </Container>
    </aside>
  );
}

