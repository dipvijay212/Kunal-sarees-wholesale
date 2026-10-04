"use client";

import { useState, useEffect } from "react";
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
  WhatsAppIcon,
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

  const [isOwnerDevice, setIsOwnerDevice] = useState(false);
  const [deviceSaved, setDeviceSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOwnerDevice(localStorage.getItem("ks:owner_mode") === "true");
    }
  }, [open]);

  const handleSetOwnerDevice = () => {
    try {
      localStorage.setItem("ks:owner_mode", "true");
      setIsOwnerDevice(true);
      setDeviceSaved(true);
      setTimeout(() => setDeviceSaved(false), 3000);
    } catch {}
  };

  const handleShareToWhatsApp = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://kunalsarees.com";
    const adminUrl = `${origin}/admin`;
    const text = `नमस्ते! कुणाल साड़ी एडमिन ऐप को अपने फोन में इंस्टॉल करने के लिए इस लिंक पर क्लिक करें और Chrome में 'Install app' या 'Add to Home screen' चुनें:\n\n${adminUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isInstalled ? "KS Admin App Installed" : "कुणाल साड़ी एडमिन ऐप इंस्टॉल करें"}
      description={
        isInstalled
          ? "एडमिन ऐप आपके फोन/कंप्यूटर पर इंस्टॉल हो चुका है।"
          : "सीधे एडमिन पैनल पर 1-टैप पहुंच के लिए अपने मोबाइल में ऐप इंस्टॉल करें।"
      }
      size="md"
    >
      <div className="space-y-6">
        {/* App Showcase Header */}
        <div className="flex items-center gap-4 rounded-xs border border-line bg-canvas-deep p-4">
          <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full ring-2 ring-gold/40 bg-canvas p-1 shadow-sm">
            <Image
              src="/admin/icon-admin-192.png"
              alt="Kunal Sarees Admin Logo"
              width={56}
              height={56}
              className="size-full rounded-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-ink truncate">
                KS Admin (कुणाल एडमिन)
              </h3>
              {isInstalled ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6875rem] font-bold text-emerald-800">
                  <CheckIcon size={12} /> Installed
                </span>
              ) : (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[0.6875rem] font-bold text-accent">
                  Dedicated Admin App
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              1-टैप ऑर्डर, कैटलॉग और स्टॉक मैनेजमेंट पोर्टल
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
                <p className="text-sm font-semibold">फोन पर ऐप इंस्टॉल हो चुका है</p>
                <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                  आप ऐप को फोन की होम स्क्रीन पर मौजूद <strong>KS Admin</strong> आइकॉन से कभी भी 1-टैप में खोल सकते हैं। यह सीधे एडमिन पैनल पर खुलेगा।
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Highlight Banner: Separate from public store */}
        <div className="rounded-xs border border-amber-300 bg-amber-50/80 p-3.5 text-xs text-amber-950">
          <p className="font-semibold flex items-center gap-1.5 text-amber-900">
            <span>💡</span> दुकान मालिक के लिए विशेष सुविधा:
          </p>
          <p className="mt-1 text-amber-800 leading-relaxed">
            यह ऐप पब्लिक वेबसाइट नहीं, बल्कि सीधे <strong>एडमिन पैनल</strong> खोलेगा। फोन की होम स्क्रीन पर &apos;KS Admin&apos; का अलग आइकॉन बनेगा।
          </p>
        </div>

        {/* Native 1-Click Install Button (When browser supports it) */}
        {!isInstalled && canPromptNative ? (
          <div className="rounded-xs border border-accent/25 bg-accent/5 p-4 text-center">
            <p className="text-xs text-ink font-medium mb-3">
              आपका ब्राउज़र 1-क्लिक इंस्टॉलेशन सपोर्ट करता है:
            </p>
            <Button
              variant="primary"
              size="md"
              fullWidth
              leadingIcon={<DownloadIcon size={18} />}
              onClick={triggerInstall}
              disabled={isPrompting}
              className="py-3 text-sm font-bold shadow-md"
            >
              {isPrompting ? "ओपन हो रहा है..." : "📱 एडमिन ऐप अभी इंस्टॉल करें (1-क्लिक)"}
            </Button>
          </div>
        ) : null}

        {/* WhatsApp Share Button for Owner Setup */}
        <div className="rounded-xs border border-line bg-canvas p-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-ink">
                मालिक के मोबाइल पर लिंक भेजें
              </p>
              <p className="text-[0.6875rem] text-muted">
                दुकान मालिक के फोन के WhatsApp पर 1-क्लिक इंस्टॉल लिंक भेजें।
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={<WhatsAppIcon size={16} className="text-emerald-600" />}
              onClick={handleShareToWhatsApp}
              className="shrink-0"
            >
              WhatsApp पर शेयर करें
            </Button>
          </div>
        </div>

        {/* Mark as Owner Device Toggle */}
        <div className="rounded-xs border border-line bg-canvas p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-ink">
                इस फोन को &apos;मालिक का फोन&apos; सेट करें
              </p>
              <p className="text-[0.6875rem] text-muted">
                यह फोन हमेशा सीधे एडमिन पैनल पर खुलेगा।
              </p>
            </div>
            <button
              type="button"
              onClick={handleSetOwnerDevice}
              className={`rounded-xs px-3 py-1.5 text-xs font-semibold transition-all ${
                isOwnerDevice
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-accent/10 text-accent border border-accent/30 hover:bg-accent hover:text-white"
              }`}
            >
              {deviceSaved ? "✓ सेट हो गया" : isOwnerDevice ? "✓ एक्टिव है" : "सेट करें"}
            </button>
          </div>
        </div>

        {/* Step-by-step browser guides */}
        {!isInstalled ? (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              मोबाइल में इंस्टॉल करने का तरीका
            </h4>

            {/* Android Guide */}
            {platform === "android" || platform === "chrome" || platform === "other" ? (
              <div className="rounded-xs border border-line bg-canvas p-4 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <SmartphoneIcon size={16} className="text-accent" />
                  <span>Android फोन (Chrome ब्राउज़र में):</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-muted text-xs pl-1">
                  <li>
                    स्क्रीन के ऊपर दाईं तरफ <strong className="text-ink">⋮ (3 बिंदु)</strong> पर टैप करें।
                  </li>
                  <li>
                    मेन्यू में से <strong className="text-ink">Install app</strong> या <strong className="text-ink">Add to Home screen</strong> (होम स्क्रीन में जोड़ें) चुनें।
                  </li>
                  <li>
                    <strong className="text-ink">Install</strong> पर क्लिक करें। आपके फोन पर <strong className="text-ink">&apos;KS Admin&apos;</strong> ऐप आ जाएगा!
                  </li>
                </ol>
              </div>
            ) : null}

            {/* iOS Safari Guide */}
            {platform === "ios" || platform === "safari" ? (
              <div className="rounded-xs border border-line bg-canvas p-4 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <ShareIcon size={16} className="text-accent" />
                  <span>iPhone / iPad (Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-muted text-xs pl-1">
                  <li>
                    सफारी में नीचे <strong className="text-ink">Share</strong> बटन (तीर वाला आइकॉन) दबाएं।
                  </li>
                  <li>
                    नीचे स्क्रॉल करके <strong className="text-ink">Add to Home Screen</strong> दबाएं।
                  </li>
                  <li>
                    ऊपर कोने में <strong className="text-ink">Add</strong> दबाएं। KS Admin ऐप फोन में जुड़ जाएगा!
                  </li>
                </ol>
              </div>
            ) : null}

            {/* Chrome / Edge Desktop Guide */}
            {platform === "chrome" || platform === "edge" ? (
              <div className="rounded-xs border border-line bg-canvas p-4 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <LaptopIcon size={16} className="text-accent" />
                  <span>कंप्यूटर / लैपटॉप (Chrome व Edge):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-muted text-xs pl-1">
                  <li>
                    URL बार (ऊपर लिंक वाली पट्टी) के दाईं तरफ <strong className="text-ink">Install (⊕ या मॉनिटर)</strong> आइकॉन दबाएं।
                  </li>
                  <li>
                    <strong className="text-ink">Install</strong> पर क्लिक करें। डेस्कटॉप पर ऐप का शॉर्टकट बन जाएगा।
                  </li>
                </ol>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-line">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {isInstalled ? "बंद करें" : "हो गया"}
          </Button>
          {!isInstalled && canPromptNative ? (
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<DownloadIcon size={15} />}
              onClick={triggerInstall}
              disabled={isPrompting}
            >
              ऐप इंस्टॉल करें
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
