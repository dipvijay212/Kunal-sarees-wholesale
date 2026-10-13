"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminAuthStore, syncAdminData } from "@/lib/admin-stores";
import { LoadingState } from "@/components/ui/LoadingState";
import { Drawer } from "@/components/ui/Drawer";

export function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useLocalStore(adminAuthStore);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (!isClientReady) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("ks:admin:jwt:v1") : null;
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("ks:admin:refresh_jwt:v1") : null;
    const hasToken = Boolean(token || refreshToken);

    if (pathname !== "/admin/login") {
      // If there is no token at all, clear session and immediately show login screen
      if (!hasToken) {
        adminAuthStore.reset();
        router.replace("/admin/login");
        return;
      }

      if (!session.isAuthenticated) {
        adminAuthStore.set({
          isAuthenticated: true,
          email: session.email || "admin@kunalsarees.com",
          name: session.name || "Kunal Sarees Admin",
          loginAt: Date.now(),
        });
      }
      syncAdminData();
    } else {
      // On /admin/login: only redirect to /admin if actively authenticated with an actual token
      if (session.isAuthenticated && hasToken) {
        router.replace("/admin");
      }
    }
  }, [pathname, session.isAuthenticated, session.email, session.name, isClientReady, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // To view any admin screen, a token is strictly required
  const hasToken = typeof window !== "undefined"
    ? Boolean(localStorage.getItem("ks:admin:jwt:v1") || localStorage.getItem("ks:admin:refresh_jwt:v1"))
    : false;

  if (!isClientReady || !hasToken) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-canvas p-6">
        <LoadingState variant="lines" count={3} label="Authenticating admin session..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas-deep">
      {/* Fixed Sidebar for desktop */}
      <AdminSidebar className="hidden w-64 shrink-0 md:flex md:fixed md:inset-y-0 z-30" />

      {/* Mobile Drawer Sidebar */}
      <Drawer
        id="admin-mobile-sidebar"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        side="left"
        title="Admin Navigation"
        bodyClassName="p-0"
      >
        <div className="h-full flex flex-col">
          <AdminSidebar
            className="w-full h-full border-r-0"
            onItemClick={() => setMobileMenuOpen(false)}
          />
        </div>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0">
        <AdminHeader title={title} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
