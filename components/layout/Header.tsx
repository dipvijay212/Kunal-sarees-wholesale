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
 * Sticky site header. Transparent at the top of the page (so full-bleed heroes
 * show through) and solid once the page scrolls.
 *
 * Desktop (≥1024px): logo, primary navigation, search, order list, WhatsApp.
 * Mobile: logo, order list and a menu button that opens the navigation drawer.
 */
export function Header() {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname, mainNavigation);
  const isScrolled = useScrolled();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { openOrderList, openSearch } = useUI();
  const { summary } = useOrderList();

  const orderCount = summary.designCount;
  const orderLabel = orderCount > 0 ? `Order list, ${pluralize(orderCount, "design")}` : "Order list";

  return (
    <>
      <header
        data-scrolled={isScrolled ? "" : undefined}
        className={cn(
          "sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ease-luxe",
          isScrolled ? "border-line bg-canvas" : "border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-header items-center justify-between gap-3 lg:gap-6">
          <Logo
            eager
            markClassName="size-9 xl:size-10"
            wordmarkClassName="text-[0.9375rem] xs:text-base xl:text-lg"
            className="shrink-0"
          />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-8">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={item.href === activeHref ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="-mr-2 flex shrink-0 items-center gap-0.5 lg:mr-0 lg:gap-1">
            <IconButton
              label="Search"
              icon={<SearchIcon size={20} />}
              onClick={openSearch}
              aria-haspopup="dialog"
              className="hidden lg:inline-flex"
            />
            <IconButton
              label={orderLabel}
              icon={<BagIcon size={21} />}
              badge={orderCount}
              onClick={openOrderList}
              aria-haspopup="dialog"
            />
            <WhatsAppButton variant="icon" label="Chat on WhatsApp" className="ml-1 hidden lg:inline-flex xl:hidden" />
            <WhatsAppButton variant="secondary" size="sm" label="WhatsApp" className="ml-3 hidden xl:inline-flex" />
            <IconButton
              label="Open menu"
              icon={<MenuIcon size={22} />}
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isMenuOpen}
              aria-controls={MOBILE_NAV_ID}
              className="lg:hidden"
            />
          </div>
        </Container>
      </header>

      <MobileNav id={MOBILE_NAV_ID} open={isMenuOpen} onClose={() => setMenuOpen(false)} activeHref={activeHref} />
    </>
  );
}
