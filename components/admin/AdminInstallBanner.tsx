"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { AdminInstallModal } from "./AdminInstallModal";
import { Button } from "@/components/ui/Button";
import { CloseIcon, DownloadIcon, SparkleIcon } from "@/components/ui/Icons";

const STORAGE_KEY = "ks:admin:install_banner_dismissed:v1";

export function AdminInstallBanner() {
  const {
    isInstalled,
    modalOpen,
    closeModal,
    triggerInstall,
    isPrompting,
  } = usePwaInstall();

  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Only show if not installed and not dismissed previously
    const isDismissed = localStorage.getItem(STORAGE_KEY) === "true";
    setDismissed(isDismissed);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
  };

  // If already installed or dismissed, do not render the banner
  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      <div className="relative mb-6 overflow-hidden rounded-xs border border-accent/25 bg-gradient-to-r from-accent/10 via-canvas to-accent/5 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-full ring-2 ring-gold/40 bg-canvas p-0.5 shadow-sm">
              <Image
                src="/admin/icon-admin-192.png"
                alt="KS Admin App Icon"
                width={48}
                height={48}
                className="size-full rounded-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="type-h4 text-ink font-serif text-base sm:text-lg">
                  📱 कुणाल साड़ी एडमिन ऐप इंस्टॉल करें (KS Admin)
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[0.6875rem] font-bold text-accent">
                  <SparkleIcon size={12} /> डायरेक्ट 1-टैप एडमिन
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted max-w-xl leading-relaxed">
                फोन की होम स्क्रीन पर KS Admin ऐप जोड़ें। ऐप खोलते ही सीधे ऑर्डर्स, प्रोडक्ट्स और स्टॉक दिखेंगे (पब्लिक वेबसाइट नहीं)।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<DownloadIcon size={15} />}
              onClick={triggerInstall}
              disabled={isPrompting}
              className="shadow-xs"
            >
              {isPrompting ? "Opening..." : "एडमिन ऐप इंस्टॉल करें"}
            </Button>
            <button
              type="button"
              onClick={handleDismiss}
              title="Dismiss banner"
              className="p-1.5 text-muted hover:text-ink transition-colors rounded-xs hover:bg-canvas-deep"
              aria-label="Dismiss banner"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      <AdminInstallModal open={modalOpen} onClose={closeModal} />
    </>
  );
}
