"use client";

import Link from "next/link";
import { useUI } from "@/components/providers/UIProvider";
import { Drawer } from "@/components/ui/Drawer";
import { BagIcon, ChevronRightIcon, HeartIcon, SearchIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { mainNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { useOrderList } from "@/hooks/use-order-list";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

interface MobileNavProps {
  id: string;
  open: boolean;
  onClose: () => void;
  activeHref: string | null;
}

const secondaryItemClass =
  "flex min-h-12 w-full items-center justify-between gap-3 text-left text-sm font-medium text-muted transition-colors hover:text-maroon";

export function MobileNav({ id, open, onClose, activeHref }: MobileNavProps) {
  const { openSearch, openOrderList } = useUI();
  const { summary } = useOrderList();
  const { count: savedCount } = useWishlist();

  return (
    <Drawer
      id={id}
      open={open}
      onClose={onClose}
      title="Wholesale Menu"
      side="right"
      headerContent={<Logo markClassName="size-9 ring-1 ring-gold/30" wordmarkClassName="text-[0.9375rem] font-semibold text-ink" onClick={onClose} />}
      footer={
        <div className="flex flex-col gap-4 border-t border-line pt-4">
          <WhatsAppButton fullWidth label="Order on WhatsApp" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href={siteConfig.contact.phoneHref}
              className="flex min-h-10 items-center text-xs font-semibold tracking-wide text-muted transition-colors hover:text-maroon"
            >
              {siteConfig.contact.phoneDisplay}
            </a>
            <SocialLinks size="sm" />
          </div>
        </div>
      }
    >
      <button
        type="button"
        onClick={() => {
          onClose();
          openSearch();
        }}
        className="flex min-h-12 w-full items-center gap-3 rounded-xs border border-line bg-canvas px-4 text-left text-sm text-subtle transition-colors hover:border-maroon/40"
        aria-haspopup="dialog"
      >
        <SearchIcon size={18} className="shrink-0 text-muted" />
        <span className="truncate text-xs font-medium">Search sarees, fabrics or codes</span>
      </button>

      <nav aria-label="Mobile Navigation" className="mt-4">
        <ul>
          {mainNavigation.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <li key={item.href} className="border-b border-line/60">
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 items-center justify-between gap-4 font-display text-xl transition-colors",
                    isActive ? "text-maroon font-semibold" : "text-ink hover:text-maroon",
                  )}
                >
                  {item.label}
                  {isActive ? (
                    <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-maroon" />
                  ) : (
                    <ChevronRightIcon size={16} className="shrink-0 text-muted/60" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <ul className="mt-6 space-y-1 rounded-xs border border-line bg-canvas p-2">
        <li>
          <button
            type="button"
            onClick={() => {
              onClose();
              openOrderList();
            }}
            className={secondaryItemClass}
            aria-haspopup="dialog"
          >
            <span className="flex items-center gap-3">
              <BagIcon size={18} className="text-maroon" /> Wholesale Order List
            </span>
            {summary.designCount > 0 ? (
              <span className="rounded-full bg-maroon px-2 py-0.5 text-[0.6875rem] font-bold text-white">
                {summary.designCount}
              </span>
            ) : null}
          </button>
        </li>
        <li>
          <Link href="/wishlist" onClick={onClose} className={secondaryItemClass}>
            <span className="flex items-center gap-3">
              <HeartIcon size={18} className="text-maroon" /> Saved Designs
            </span>
            {savedCount > 0 ? (
              <span className="rounded-full bg-gold px-2 py-0.5 text-[0.6875rem] font-bold text-white">
                {savedCount}
              </span>
            ) : null}
          </Link>
        </li>
      </ul>
    </Drawer>
  );
}

