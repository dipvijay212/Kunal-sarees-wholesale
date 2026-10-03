"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  CheckIcon,
  DownloadIcon,
  LaptopIcon,
  ShareIcon,
  SmartphoneIcon,
  SparkleIcon,
} from "@/components/ui/Icons";
import { usePwaInstall } from "@/hooks/use-pwa-install";

interface AdminInstallModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminInstallModal({ open, onClose }: AdminInstallModalProps) {
  const {
    isInstalled,
    canPromptNative,
    isPrompting,
    platform,
    triggerInstall,
  } = usePwaInstall();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isInstalled ? "Kunal Sarees App Installed" : "Install Kunal Sarees App"}
      description={
        isInstalled
          ? "The application is ready to use directly from your device."
          : "Add Kunal Sarees to your Desktop or Mobile device for fast, 1-tap admin access."
      }
      size="md"
    >
      <div className="space-y-6">
        {/* App Showcase Header */}
        <div className="flex items-center gap-4 rounded-xs border border-line bg-canvas-deep p-4">
          <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full ring-2 ring-gold/40 bg-canvas p-1 shadow-sm">
            <Image
              src="/brand/ks-logo-320.png"
              alt="Kunal Sarees Logo"
              width={56}
              height={56}
              className="size-full rounded-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-ink truncate">
                Kunal Sarees Wholesale
              </h3>
              {isInstalled ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6875rem] font-bold text-emerald-800">
                  <CheckIcon size={12} /> Installed
                </span>
              ) : (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[0.6875rem] font-bold text-accent">
                  Official PWA
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              Admin & Wholesale Management App
            </p>
          </div>
        </div>

        {/* If App is already installed */}
        {isInstalled ? (
          <div className="rounded-xs border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950">
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <CheckIcon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold">Already installed on this device</p>
                <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                  You are either running the app in standalone mode or have already installed it. You can open it anytime from your Desktop Taskbar, Start Menu, or Mobile Home Screen.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xs border border-line bg-canvas p-3">
            <div className="flex items-center gap-2 text-accent font-semibold text-xs mb-1">
              <SparkleIcon size={15} />
              <span>Instant Launch</span>
            </div>
            <p className="text-[0.6875rem] text-muted leading-relaxed">
              Open with 1 tap from your home screen without opening a browser tab.
            </p>
          </div>

          <div className="rounded-xs border border-line bg-canvas p-3">
            <div className="flex items-center gap-2 text-accent font-semibold text-xs mb-1">
              <LaptopIcon size={15} />
              <span>Dedicated Window</span>
            </div>
            <p className="text-[0.6875rem] text-muted leading-relaxed">
              Distraction-free workspace with more screen space for orders & catalog.
            </p>
          </div>

          <div className="rounded-xs border border-line bg-canvas p-3">
            <div className="flex items-center gap-2 text-accent font-semibold text-xs mb-1">
              <SmartphoneIcon size={15} />
              <span>Mobile & Desktop</span>
            </div>
            <p className="text-[0.6875rem] text-muted leading-relaxed">
              Works smoothly across Android, iPhone, Windows PC, and Mac.
            </p>
          </div>
        </div>

        {/* Native 1-Click Install Button (When browser supports it) */}
        {!isInstalled && canPromptNative ? (
          <div className="rounded-xs border border-accent/25 bg-accent/5 p-4 text-center">
            <p className="text-xs text-ink font-medium mb-3">
              Your browser supports 1-click installation!
            </p>
            <Button
              variant="primary"
              size="md"
              fullWidth
              leadingIcon={<DownloadIcon size={18} />}
              onClick={triggerInstall}
              disabled={isPrompting}
            >
              {isPrompting ? "Opening Browser Prompt..." : "Install App Now (1-Click)"}
            </Button>
          </div>
        ) : null}

        {/* Step-by-step browser guides */}
        {!isInstalled ? (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              How to install on your browser
            </h4>

            {/* iOS Safari Guide */}
            {platform === "ios" || platform === "safari" ? (
              <div className="rounded-xs border border-line bg-canvas p-4 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <ShareIcon size={16} className="text-accent" />
                  <span>On iPhone / iPad (Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-muted text-xs pl-1">
                  <li>
                    Tap the <strong className="text-ink">Share</strong> button at the bottom of the screen (the square with an arrow pointing up).
                  </li>
                  <li>
                    Scroll down the share sheet and tap <strong className="text-ink">Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong className="text-ink">Add</strong> in the top right corner. Kunal Sarees will appear on your home screen!
                  </li>
                </ol>
              </div>
            ) : null}

            {/* Chrome / Edge Desktop Guide */}
            {platform === "chrome" || platform === "edge" || platform === "other" ? (
              <div className="rounded-xs border border-line bg-canvas p-4 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <DownloadIcon size={16} className="text-accent" />
                  <span>On Desktop (Google Chrome & Microsoft Edge):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-muted text-xs pl-1">
                  <li>
                    Look at the right side of the <strong className="text-ink">Address Bar (URL bar)</strong> at the top of your browser.
                  </li>
                  <li>
                    Click the <strong className="text-ink">Install Kunal Sarees</strong> icon (a computer monitor with a down arrow or a ⊕ plus symbol).
                  </li>
                  <li>
                    Click <strong className="text-ink">Install</strong> in the popup to add Kunal Sarees to your Desktop and Taskbar.
                  </li>
                  <li>
                    Alternatively, click browser menu (<strong className="text-ink">⋮</strong> or <strong className="text-ink">⋯</strong>) → <strong className="text-ink">Install Kunal Sarees</strong>.
                  </li>
                </ol>
              </div>
            ) : null}

            {/* Android Guide */}
            {platform === "android" ? (
              <div className="rounded-xs border border-line bg-canvas p-4 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <SmartphoneIcon size={16} className="text-accent" />
                  <span>On Android (Chrome / Brave / Samsung Internet):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-muted text-xs pl-1">
                  <li>
                    Tap the menu button (<strong className="text-ink">⋮ three dots</strong>) in the top-right corner.
                  </li>
                  <li>
                    Tap <strong className="text-ink">Install app</strong> or <strong className="text-ink">Add to Home screen</strong>.
                  </li>
                  <li>
                    Confirm by tapping <strong className="text-ink">Install</strong>. The Kunal Sarees app will be added to your app drawer and home screen.
                  </li>
                </ol>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-line">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {isInstalled ? "Close" : "Done"}
          </Button>
          {!isInstalled && canPromptNative ? (
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<DownloadIcon size={15} />}
              onClick={triggerInstall}
              disabled={isPrompting}
            >
              Install App
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
