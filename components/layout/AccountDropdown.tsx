"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/hooks/use-customer";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { IconButton } from "@/components/ui/IconButton";
import { BagIcon, MapPinIcon, UserIcon } from "@/components/ui/Icons";

export function AccountDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t, language } = useLanguage();
  const isHi = language === "hi";
  const { isAuthenticated, customer, logout } = useCustomer();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push("/login");
  };

  if (!isAuthenticated || !customer) {
    return (
      <Link
        href="/login"
        aria-label={t.auth.loginButton}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink hover:text-maroon hover:bg-accent-soft transition-colors"
      >
        <UserIcon size={19} />
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t.account.title}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent hover:bg-accent/20 transition-colors font-bold text-xs"
      >
        {customer.name ? customer.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xs border border-line bg-canvas p-2 shadow-lg z-50 animate-fadeIn">
          {/* User Info Header */}
          <div className="border-b border-line/60 px-3 py-2">
            <p className="truncate text-xs font-semibold text-ink">
              {customer.name}
            </p>
            {customer.businessName ? (
              <p className="truncate text-[11px] text-muted">
                {customer.businessName}
              </p>
            ) : null}
            <p className="text-[10px] text-muted/80">{customer.phone}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1 flex flex-col gap-0.5">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xs px-3 py-2 text-xs font-medium text-ink hover:bg-canvas-subtle hover:text-maroon transition-colors"
            >
              <UserIcon size={14} className="text-muted" />
              {t.account.title}
            </Link>

            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xs px-3 py-2 text-xs font-medium text-ink hover:bg-canvas-subtle hover:text-maroon transition-colors"
            >
              <BagIcon size={14} className="text-muted" />
              {t.account.myOrders}
            </Link>

            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xs px-3 py-2 text-xs font-medium text-ink hover:bg-canvas-subtle hover:text-maroon transition-colors"
            >
              <MapPinIcon size={14} className="text-muted" />
              {t.account.myInformation}
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-line/60 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-xs font-medium text-danger hover:bg-danger/5 transition-colors"
            >
              <span>{t.account.logout}</span>
              <span className="text-[10px]">→</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
