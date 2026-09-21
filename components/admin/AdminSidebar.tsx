"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  BagIcon,
  ChatIcon,
  ChevronRightIcon,
  FilterIcon,
  HomeIcon,
  PackageIcon,
  SparkleIcon,
  TagIcon,
} from "@/components/ui/Icons";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <HomeIcon size={18} />, exact: true },
  { label: "Products", href: "/admin/products", icon: <PackageIcon size={18} /> },
  { label: "Categories", href: "/admin/categories", icon: <FilterIcon size={18} /> },
  { label: "Collections", href: "/admin/collections", icon: <TagIcon size={18} /> },
  { label: "Orders", href: "/admin/orders", icon: <BagIcon size={18} /> },
  { label: "Customers", href: "/admin/customers", icon: <ChatIcon size={18} /> },
  { label: "Settings", href: "/admin/settings", icon: <SparkleIcon size={18} /> },
];

export function AdminSidebar({
  className,
  onItemClick,
}: {
  className?: string;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-line bg-canvas text-ink",
        className,
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
        <Link href="/admin" onClick={onItemClick} className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xs bg-accent text-xs font-bold text-accent-contrast">
            KS
          </div>
          <div>
            <span className="font-serif text-base font-bold tracking-tight text-ink block leading-none">
              Kunal Sarees
            </span>
            <span className="text-[0.625rem] font-semibold tracking-wider text-muted uppercase">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center justify-between rounded-xs px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-muted hover:bg-canvas-deep hover:text-ink",
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(isActive ? "text-accent" : "text-muted")}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {isActive ? <ChevronRightIcon size={14} className="text-accent" /> : null}
            </Link>
          );
        })}
      </nav>

      {/* Back to Storefront Link */}
      <div className="border-t border-line p-3 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-xs border border-line bg-canvas-deep px-3 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
        >
          <span>View Public Storefront</span>
          <ChevronRightIcon size={12} />
        </Link>
      </div>
    </aside>
  );
}
