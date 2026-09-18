"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminAuthStore } from "@/lib/admin-stores";
import { LoadingState } from "@/components/ui/LoadingState";

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

  useEffect(() => {
    if (pathname !== "/admin/login" && !session.isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [pathname, session.isAuthenticated, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!session.isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-canvas p-6">
        <LoadingState variant="lines" count={3} label="Authenticating admin session..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas-deep">
      {/* Fixed Sidebar for desktop */}
      <AdminSidebar className="hidden w-64 shrink-0 md:flex md:fixed md:inset-y-0" />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64">
        <AdminHeader title={title} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
