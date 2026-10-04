"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CheckIcon, CopyIcon, ShareIcon, WhatsAppIcon } from "@/components/ui/Icons";

export const STORE_SHARE_MESSAGE = `🌸 Welcome to Kunal Sarees! 🌸
💰 सिर्फ ₹10,000 से अपना साड़ी बिज़नेस शुरू करें!
👗 Wholesale Sarees | ✨ New Designs | 📦 Business Collection
👉 आज ही Collection देखें:
https://www.kunalsarees.in/
Kunal Sarees ❤️
आपके बिज़नेस की शुरुआत, हमारे साथ!`;

interface AdminShareWebsiteModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminShareWebsiteModal({ open, onClose }: AdminShareWebsiteModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(STORE_SHARE_MESSAGE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = STORE_SHARE_MESSAGE;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(STORE_SHARE_MESSAGE)}`;
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Kunal Sarees — Wholesale Sarees",
          text: STORE_SHARE_MESSAGE,
          url: "https://www.kunalsarees.in/",
        });
      } catch {}
    } else {
      handleWhatsAppShare();
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="🌸 Share Website Link"
      description="ग्राहकों और रीसेलर्स के साथ Kunal Sarees वेबसाइट लिंक और मैसेज शेयर करें।"
      size="md"
    >
      <div className="space-y-4">
        {/* Message Preview Box */}
        <div className="relative rounded-xs border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>💬</span> Ready-to-Send WhatsApp Message
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              {copied ? (
                <>
                  <CheckIcon size={13} className="text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon size={13} />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-ink bg-white/80 rounded-xs border border-emerald-100 p-3.5 select-all">
            {STORE_SHARE_MESSAGE}
          </pre>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Button
            variant="primary"
            size="md"
            leadingIcon={<WhatsAppIcon size={18} />}
            onClick={handleWhatsAppShare}
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xs font-semibold py-2.5"
          >
            WhatsApp पर शेयर करें
          </Button>

          <Button
            variant="secondary"
            size="md"
            leadingIcon={copied ? <CheckIcon size={16} className="text-emerald-600" /> : <CopyIcon size={16} />}
            onClick={handleCopy}
            className="font-semibold py-2.5"
          >
            {copied ? "✓ कॉपी हो गया! (Copied)" : "मैसेज कॉपी करें (Copy)"}
          </Button>
        </div>

        {canNativeShare ? (
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            leadingIcon={<ShareIcon size={15} />}
            onClick={handleNativeShare}
            className="text-muted hover:text-ink text-xs"
          >
            अन्य ऐप्स में शेयर करें (Telegram, SMS, etc.)
          </Button>
        ) : null}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-line">
          <Button variant="secondary" size="sm" onClick={onClose}>
            बंद करें (Close)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
