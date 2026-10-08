"use client";

import { useRouter } from "next/navigation";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminAuthStore, logoutAdmin } from "@/lib/admin-stores";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { MenuIcon } from "@/components/ui/Icons";
import { AdminInstallButton } from "./AdminInstallButton";

export function AdminHeader({
  title,
  onOpenMobileMenu,
}: {
  title: string;
  onOpenMobileMenu?: () => void;
}) {
  const router = useRouter();
  const session = useLocalStore(adminAuthStore);

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-line bg-canvas px-3 sm:gap-3 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-3">
        {onOpenMobileMenu ? (
          <IconButton
            label="Open Admin Navigation"
            icon={<MenuIcon size={20} />}
            onClick={onOpenMobileMenu}
            className="md:hidden shrink-0 text-ink hover:text-maroon"
          />
        ) : null}
        <h1 className="type-h4 min-w-0 text-ink font-serif max-sm:text-base max-sm:leading-tight">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Install App button (phones use the one in the navigation drawer) */}
        <div className="hidden sm:block">
          <AdminInstallButton variant="header" />
        </div>

        {/* Admin user info badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div className="flex size-7 items-center justify-center rounded-full bg-accent/15 font-semibold text-accent">
            A
          </div>
          <div className="text-left">
            <p className="font-semibold text-ink leading-tight">Admin User</p>
            <p className="text-[0.625rem] text-muted">{session.email}</p>
          </div>
        </div>

        <Button variant="secondary" size="sm" onClick={handleLogout} className="whitespace-nowrap max-sm:px-3">
          Log Out
        </Button>
      </div>
    </header>
  );
}
