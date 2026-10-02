"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUI } from "@/components/providers/UIProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { IconButton } from "@/components/ui/IconButton";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getMainNavigation } from "@/data/navigation";
import { useOrderList } from "@/hooks/use-order-list";
import { useWishlist } from "@/hooks/use-wishlist";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/cn";
import { getActiveHref } from "@/lib/navigation";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { AccountDropdown } from "./AccountDropdown";

const MOBILE_NAV_ID = "mobile-navigation";

/**
 * Sticky site header with warm ivory/cream background.
 *
 * Desktop (≥1024px): logo, primary navigation, search, wholesale order list, WhatsApp.
 * Mobile: logo, wholesale order list and a menu button.
 */
export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const navItems = getMainNavigation(t);
  const activeHref = getActiveHref(pathname, navItems);
  const isScrolled = useScrolled();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { openOrderList, openSearch } = useUI();
  const { summary } = useOrderList();

  const orderCount = summary.designCount;
  const { count: savedCount } = useWishlist();
  const orderLabel = orderCount > 0 
    ? `${t.nav.orderList} (${orderCount} ${t.products.pieces})` 
    : t.nav.orderList;

  return (
    <>
      <header
        data-scrolled={isScrolled ? "" : undefined}
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300 ease-luxe",
          isScrolled
            ? "border-line bg-canvas/95 shadow-xs backdrop-blur-md"
            : "border-line/60 bg-canvas",
        )}
      >
        <Container className="flex h-header items-center justify-between gap-2 sm:gap-3 lg:gap-6">
          <Logo
            eager
            showTagline
            markClassName="size-9 xs:size-10 sm:size-12 lg:size-14 shadow-sm shrink-0"
            wordmarkClassName="text-[1.05rem] xs:text-lg sm:text-2xl lg:text-[1.625rem] font-bold tracking-[0.06em] xs:tracking-[0.1em] lg:tracking-[0.14em]"
            taglineClassName="text-[0.5625rem] xs:text-[0.625rem] sm:text-[0.6875rem] lg:text-[0.725rem] tracking-[0.12em] xs:tracking-[0.18em] lg:tracking-[0.24em] font-semibold text-muted/90"
            className="min-w-0 py-1"
          />

          <nav aria-label={t.nav.menu} className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {navItems.map((item) => {
                const isActive = item.href === activeHref;
                return (
                  <li key={`${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      className={cn(
                        "nav-link text-[0.875rem] font-medium tracking-[0.04em] transition-colors",
                        isActive ? "text-maroon font-semibold" : "text-muted hover:text-maroon",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="-mr-1 flex shrink-0 items-center gap-1 sm:-mr-2 sm:gap-1.5 lg:mr-0">
            <IconButton
              label={t.search.title}
              icon={<SearchIcon size={19} />}
              onClick={openSearch}
              aria-haspopup="dialog"
              className="hidden lg:inline-flex text-ink hover:text-maroon hover:bg-accent-soft"
            />

            <IconButton
              href="/wishlist"
              label={savedCount > 0 ? `${t.wishlist.title} (${savedCount})` : t.wishlist.title}
              icon={<HeartIcon size={20} />}
              badge={savedCount}
              className="text-ink hover:text-maroon hover:bg-accent-soft"
            />

            <IconButton
              label={orderLabel}
              icon={<BagIcon size={20} />}
              badge={orderCount}
              onClick={openOrderList}
              aria-haspopup="dialog"
              className="text-ink hover:text-maroon hover:bg-accent-soft"
            />

            <AccountDropdown />

            <WhatsAppButton
              variant="icon"
              label={t.hero.btnWhatsapp}
              className="ml-1 hidden lg:inline-flex xl:hidden"
            />

            <WhatsAppButton
              variant="secondary"
              size="sm"
              label={t.nav.whatsapp}
              className="ml-2 hidden xl:inline-flex border-maroon/30 text-maroon hover:bg-maroon hover:text-white"
            />
            <IconButton
              label={t.nav.menu}
              icon={<MenuIcon size={22} />}
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isMenuOpen}
              aria-controls={MOBILE_NAV_ID}
              className="lg:hidden text-ink hover:text-maroon"
            />
          </div>
        </Container>
      </header>

      <MobileNav id={MOBILE_NAV_ID} open={isMenuOpen} onClose={() => setMenuOpen(false)} activeHref={activeHref} />
    </>
  );
}
