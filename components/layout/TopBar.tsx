import { Container } from "@/components/ui/Container";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { siteConfig } from "@/data/site";
import { SocialLinks } from "./SocialLinks";

export function TopBar() {
  return (
    <aside
      aria-label="Announcement & Contact Bar"
      className="relative z-50 border-b border-maroon-dark/40 bg-maroon text-[0.6875rem] text-cream"
    >
      <Container className="flex h-9 items-center justify-between gap-4">
        {/* Left / Center: Key wholesale brand guarantees */}
        <div className="flex flex-1 items-center gap-2.5 overflow-hidden text-xs font-medium tracking-wide whitespace-nowrap sm:text-[0.6875rem]">
          <span className="font-semibold text-gold-light">Kunal Sarees</span>
          <span aria-hidden="true" className="text-gold-light/60">|</span>
          <span className="truncate">Premium Quality Sarees</span>
          <span aria-hidden="true" className="hidden text-gold-light/60 sm:inline">|</span>
          <span className="hidden sm:inline">Wholesale Only</span>
          <span aria-hidden="true" className="hidden text-gold-light/60 md:inline">|</span>
          <span className="hidden text-cream/90 md:inline">Trusted by Boutiques & Retailers across India</span>
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
            <SocialLinks size="sm" />
          </div>
        </div>
      </Container>
    </aside>
  );
}
