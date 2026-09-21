"use client";

import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/admin-stores";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { MenuIcon } from "@/components/ui/Icons";

export function AdminHeader({
  title,
  onOpenMobileMenu,
}: {
  title: string;
  onOpenMobileMenu?: () => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-canvas px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu ? (
          <IconButton
            label="Open Admin Navigation"
            icon={<MenuIcon size={20} />}
            onClick={onOpenMobileMenu}
            className="md:hidden text-ink hover:text-maroon"
          />
        ) : null}
        <h1 className="type-h4 text-ink font-serif">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin user info badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div className="flex size-7 items-center justify-center rounded-full bg-accent/15 font-semibold text-accent">
            A
          </div>
          <div className="text-left">
            <p className="font-semibold text-ink leading-tight">Admin User</p>
            <p className="text-[0.625rem] text-muted">admin@kunalsarees.com</p>
          </div>
        </div>

        <Button variant="secondary" size="sm" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </header>
  );
}
