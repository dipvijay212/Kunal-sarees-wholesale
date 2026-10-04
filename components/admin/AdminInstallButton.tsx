"use client";

import Image from "next/image";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { AdminInstallModal } from "./AdminInstallModal";
import { CheckIcon, DownloadIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

export function AdminInstallButton({
  className,
  variant = "header",
}: {
  className?: string;
  variant?: "header" | "sidebar" | "banner";
}) {
  const {
    isInstalled,
    modalOpen,
    closeModal,
    triggerInstall,
    isPrompting,
  } = usePwaInstall();

  if (variant === "header") {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          disabled={isPrompting}
          title={isInstalled ? "KS Admin App is installed" : "Install KS Admin App"}
          className={cn(
            "group relative flex items-center gap-1.5 rounded-xs px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30",
            isInstalled
              ? "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              : "border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-accent-contrast shadow-2xs hover:shadow-xs",
            className,
          )}
        >
          {isInstalled ? (
            <>
              <CheckIcon size={14} className="text-emerald-700" />
              <span className="hidden sm:inline">KS Admin Installed</span>
              <span className="sm:hidden">Installed</span>
            </>
          ) : (
            <>
              <DownloadIcon
                size={14}
                className="transition-transform group-hover:-translate-y-0.5"
              />
              <span className="hidden sm:inline">Install KS Admin</span>
              <span className="sm:hidden">Install</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            </>
          )}
        </button>

        <AdminInstallModal open={modalOpen} onClose={closeModal} />
      </>
    );
  }

  // Sidebar card variant
  return (
    <>
      <div
        className={cn(
          "rounded-xs border border-accent/25 bg-gradient-to-b from-accent/10 to-accent/5 p-3.5 shadow-2xs",
          className,
        )}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex size-7 shrink-0 items-center justify-center rounded-full ring-1.5 ring-gold/40 bg-canvas p-0.5 shadow-2xs">
              <Image
                src="/admin/icon-admin-192.png"
                alt="KS Admin App Logo"
                width={28}
                height={28}
                className="size-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs font-bold text-ink font-serif tracking-tight">
              KS Admin App
            </span>
          </div>
          {isInstalled ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-emerald-800">
              <CheckIcon size={10} /> Installed
            </span>
          ) : (
            <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[0.625rem] font-bold text-accent">
              Admin App
            </span>
          )}
        </div>

        <p className="text-[0.6875rem] text-muted mb-2.5 leading-relaxed">
          {isInstalled
            ? "App is installed for direct 1-tap admin access."
            : "Install for 1-tap mobile & desktop order management."}
        </p>

        <button
          type="button"
          onClick={triggerInstall}
          disabled={isPrompting}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-xs py-1.5 px-3 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-accent/30",
            isInstalled
              ? "border border-line bg-canvas text-ink hover:bg-canvas-deep"
              : "bg-accent text-accent-contrast hover:bg-maroon shadow-xs",
          )}
        >
          {isInstalled ? (
            <>
              <CheckIcon size={13} className="text-emerald-600" />
              <span>View App Details</span>
            </>
          ) : (
            <>
              <DownloadIcon size={13} />
              <span>Install KS Admin</span>
            </>
          )}
        </button>
      </div>

      <AdminInstallModal open={modalOpen} onClose={closeModal} />
    </>
  );
}
