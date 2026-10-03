"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { useSettings } from "@/hooks/use-settings";
import { formatPieces, formatPrice } from "@/lib/format";
import { clearOrderList } from "@/lib/stores";
import { buildWhatsAppUrl, getProductImageUrl, productLink } from "@/lib/whatsapp";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { OrderListLine, OrderListSummary } from "@/types";

interface OrderCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  lines: OrderListLine[];
  summary: OrderListSummary;
}

export function OrderCheckoutModal({ open, onClose, lines, summary }: OrderCheckoutModalProps) {
  const settings = useSettings();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !businessName.trim() || !city.trim() || !phone.trim()) {
      setError(
        isHi
          ? "कृपया अपना नाम, बिज़नेस का नाम, शहर और मोबाइल नंबर भरें।"
          : "Please fill in your name, business name, city, and mobile number."
      );
      return;
    }
    setError("");

    // Format WhatsApp Order Message
    const messageLines: string[] = [
      isHi ? `नमस्ते ${settings.businessName},` : `Hello ${settings.businessName},`,
      "",
      isHi
        ? "मैं नीचे दी गई साड़ियों का होलसेल ऑर्डर देना चाहता/चाहती हूँ:"
        : "I would like to place a wholesale order for the following sarees:",
      "",
      isHi ? "📋 *ग्राहक की जानकारी*" : "📋 *Customer Details*",
      `• ${isHi ? "नाम" : "Name"}: ${name.trim()}`,
      `• ${isHi ? "दुकान / बुटीक का नाम" : "Shop / Boutique"}: ${businessName.trim()}`,
      `• ${isHi ? "शहर / राज्य" : "City / State"}: ${city.trim()}`,
      `• ${isHi ? "मोबाइल नंबर" : "Mobile"}: ${phone.trim()}`,
    ];

    if (gstin.trim()) {
      messageLines.push(`• GSTIN: ${gstin.trim()}`);
    }

    messageLines.push("", isHi ? "🛍️ *ऑर्डर की साड़ियां*" : "🛍️ *Selected Sarees*");
    lines.forEach(({ product, item, lineTotal }, idx) => {
      const prodName = product.name_en || product.name;
      messageLines.push(`${idx + 1}. ${prodName}`);

      const imageUrl = getProductImageUrl(product) || productLink(product);
      if (imageUrl) {
        messageLines.push(`   ${isHi ? "फोटो" : "Image"}: ${imageUrl}`);
      }

      // Add selected colors breakdown if available
      if (item.selectedColors) {
        const colors = Object.entries(item.selectedColors).filter(([, qty]) => qty > 0);
        if (colors.length > 0) {
          const colorStr = colors.map(([color, q]) => `${color}: ${q} ${isHi ? "पीस" : "pcs"}`).join(", ");
          messageLines.push(`   ${isHi ? "कलर" : "Colors"}: [ ${colorStr} ]`);
        }
      }

      messageLines.push(`   ${formatPieces(item.quantity)} × ${formatPrice(product.price)} = ${formatPrice(lineTotal)}`);
    });

    messageLines.push(
      "",
      isHi ? "📊 *ऑर्डर समरी*" : "📊 *Order Summary*",
      `• ${isHi ? "कुल साड़ियां" : "Total Designs"}: ${summary.designCount} ${isHi ? "प्रकार" : "designs"}`,
      `• ${isHi ? "कुल पीस" : "Total Quantity"}: ${formatPieces(summary.totalPieces)}`,
      `• ${isHi ? "कुल कीमत" : "Total Value"}: ${formatPrice(summary.estimatedValue)} (${isHi ? "GST व डिलीवरी अलग" : "GST & shipping extra"})`,
    );

    if (note.trim()) {
      messageLines.push("", `• ${isHi ? "खास निर्देश" : "Special Notes"}: ${note.trim()}`);
    }

    messageLines.push(
      "",
      isHi
        ? "कृपया स्टॉक उपलब्धता, पक्का बिल और डिलीवरी का समय बताएं।"
        : "Please share stock availability, wholesale invoice, and dispatch schedule."
    );

    const url = buildWhatsAppUrl(messageLines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    clearOrderList();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isHi ? "ऑर्डर की जानकारी" : "Wholesale Order Details"}
      description={
        isHi
          ? "अपनी जानकारी भरें ताकि आपका पूरा ऑर्डर सीधे WhatsApp पर भेजा जा सके।"
          : "Fill your business details to send this wholesale manifest directly via WhatsApp."
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
        {error ? (
          <div className="rounded-xs border border-danger/30 bg-danger/10 p-3 text-xs text-danger">{error}</div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="checkout-name" className="field-label">
              {isHi ? "आपका नाम" : "Your Full Name"} <span className="text-accent">*</span>
            </label>
            <Input
              id="checkout-name"
              type="text"
              required
              placeholder={isHi ? "जैसे: रमेश पटेल" : "e.g. Ramesh Patel"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="checkout-business" className="field-label">
              {isHi ? "दुकान / बुटीक का नाम" : "Shop / Boutique Name"} <span className="text-accent">*</span>
            </label>
            <Input
              id="checkout-business"
              type="text"
              required
              placeholder={isHi ? "जैसे: संगम साड़ी बुटीक" : "e.g. Sangam Saree Boutique"}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="checkout-city" className="field-label">
              {isHi ? "शहर और राज्य" : "City & State"} <span className="text-accent">*</span>
            </label>
            <Input
              id="checkout-city"
              type="text"
              required
              placeholder={isHi ? "जैसे: अहमदाबाद, गुजरात" : "e.g. Ahmedabad, Gujarat"}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="checkout-phone" className="field-label">
              {isHi ? "मोबाइल / WhatsApp नंबर" : "Mobile / WhatsApp"} <span className="text-accent">*</span>
            </label>
            <Input
              id="checkout-phone"
              type="tel"
              required
              placeholder={isHi ? "जैसे: +91 98765 43210" : "e.g. 9876543210"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <label htmlFor="checkout-gstin" className="field-label">
            GSTIN <span className="text-subtle">({isHi ? "वैकल्पिक" : "Optional"})</span>
          </label>
          <Input
            id="checkout-gstin"
            type="text"
            placeholder={isHi ? "जैसे: 24AAAAA0000A1Z5" : "e.g. 24AAAAA0000A1Z5"}
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="checkout-note" className="field-label">
            {isHi ? "कोई खास जानकारी या ट्रांसपोर्ट निर्देश" : "Special Instructions / Transport Request"}{" "}
            <span className="text-subtle">({isHi ? "वैकल्पिक" : "Optional"})</span>
          </label>
          <textarea
            id="checkout-note"
            rows={2}
            placeholder={
              isHi
                ? "जैसे: शादी सीजन के लिए जल्दी डिलीवरी चाहिए..."
                : "e.g. Need priority dispatch for wedding season..."
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input mt-1.5 w-full py-2"
          />
        </div>

        <div className="mt-4 flex flex-col gap-3.5 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            {isHi ? "कैंसल करें" : "Cancel"}
          </Button>
          <Button type="submit" leadingIcon={<WhatsAppIcon size={18} />}>
            {isHi ? "WhatsApp पर ऑर्डर भेजें" : "Send Order via WhatsApp"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

