"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { checkIsInstalled } from "@/lib/pwa";
import { adminAuthStore } from "@/lib/admin-stores";

const PREVIEW_KEY = "ks:admin:store_preview";
const OWNER_MODE_KEY = "ks:owner_mode";

export function SmartAdminLauncher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Do nothing if already on an admin route
    if (pathname.startsWith("/admin")) return;

    // Check if user explicitly clicked "View Store" from admin
    const previewParam = searchParams.get("preview") || searchParams.get("mode");
    if (previewParam === "store" || previewParam === "preview") {
      try {
        sessionStorage.setItem(PREVIEW_KEY, "true");
      } catch {}
      return;
    }

    // Check if store preview is active in this browser tab/session
    let isPreviewActive = false;
    try {
      isPreviewActive = sessionStorage.getItem(PREVIEW_KEY) === "true";
    } catch {}

    if (isPreviewActive) return;

    // Check if running as an installed PWA (Standalone app mode)
    const isStandalone = checkIsInstalled();

    // Check admin credentials
    const token = localStorage.getItem("ks:admin:jwt:v1");
    const session = adminAuthStore.getSnapshot();
    const isAuthed = Boolean(session.isAuthenticated || token);
    const isOwnerDevice = localStorage.getItem(OWNER_MODE_KEY) === "true";

    // Auto-Route when launched as standalone PWA
    if (isStandalone) {
      if (isAuthed) {
        // Direct jump to Admin Panel
        router.replace("/admin");
      } else if (isOwnerDevice) {
        // Direct jump to Admin Login
        router.replace("/admin/login");
      }
    }
  }, [pathname, router, searchParams]);

  return null;
}
