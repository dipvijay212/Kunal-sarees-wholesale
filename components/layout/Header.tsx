"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUI } from "@/components/providers/UIProvider";
import { Container } from "@/components/ui/Container";
import { IconButton } from "@/components/ui/IconButton";
import { BagIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { mainNavigation } from "@/data/navigation";
import { useOrderList } from "@/hooks/use-order-list";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/cn";
import { pluralize } from "@/lib/format";
import { getActiveHref } from "@/lib/navigation";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

const MOBILE_NAV_ID = "mobile-navigation";

/**
 * Sticky site header with warm ivory/cream background.
 *
 * Desktop (≥1024px): logo, primary navigation, search, wholesale order list, WhatsApp.
 * Mobile: logo, wholesale order list and a menu button that opens the luxury navigation drawer.
 */
export function Header() {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname, mainNavigation);
  const isScrolled = useScrolled();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { openOrderList, openSearch } = useUI();
  const { summary } = useOrderList();

  const orderCount = summary.designCount;
  const orderLabel = orderCount > 0 ? `Wholesale Order List, ${pluralize(orderCount, "design")}` : "Wholesale Order List";

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
        <Container className="flex h-header items-center justify-between gap-3 lg:gap-6">
          <Logo
            eager
            showTagline
            markClassName="size-9 sm:size-10 shadow-xs ring-1 ring-gold/20"
            wordmarkClassName="text-base sm:text-lg text-ink font-semibold"
            className="shrink-0"
          />

          <nav aria-label="Main Navigation" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {mainNavigation.map((item) => {
                const isActive = item.href === activeHref;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "nav-link text-[0.8125rem] font-medium tracking-[0.08em] uppercase transition-colors",
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

          <div className="-mr-2 flex shrink-0 items-center gap-1 sm:gap-1.5 lg:mr-0">
            <IconButton
              label="Search Catalogue"
              icon={<SearchIcon size={19} />}
              onClick={openSearch}
              aria-haspopup="dialog"
              className="hidden lg:inline-flex text-ink hover:text-maroon hover:bg-accent-soft"
            />
            <IconButton
              label={orderLabel}
              icon={<BagIcon size={20} />}
              badge={orderCount}
              onClick={openOrderList}
              aria-haspopup="dialog"
              className="text-ink hover:text-maroon hover:bg-accent-soft"
            />
            <WhatsAppButton
              variant="icon"
              label="Order on WhatsApp"
              className="ml-1 hidden lg:inline-flex xl:hidden"
            />
            <WhatsAppButton
              variant="secondary"
              size="sm"
              label="WhatsApp"
              className="ml-2 hidden xl:inline-flex border-maroon/30 text-maroon hover:bg-maroon hover:text-white"
            />
            <IconButton
              label="Open menu"
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

