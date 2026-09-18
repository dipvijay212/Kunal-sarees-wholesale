"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { siteConfig } from "@/data/site";
import { formatPieces, formatPrice } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { OrderListLine, OrderListSummary } from "@/types";

interface OrderCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  lines: OrderListLine[];
  summary: OrderListSummary;
}

export function OrderCheckoutModal({ open, onClose, lines, summary }: OrderCheckoutModalProps) {
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
      setError("Please fill in your Name, Store Name, City, and Phone Number.");
      return;
    }
    setError("");

    // Format WhatsApp Order Message
    const messageLines: string[] = [
      `Hello ${siteConfig.name},`,
      "",
      "I would like to place a wholesale order for the following enquiry list:",
      "",
      "📋 *BUYER DETAILS*",
      `• Contact Name: ${name.trim()}`,
      `• Boutique/Store Name: ${businessName.trim()}`,
      `• City / Location: ${city.trim()}`,
      `• Phone Number: ${phone.trim()}`,
    ];

    if (gstin.trim()) {
      messageLines.push(`• GSTIN: ${gstin.trim()}`);
    }

    messageLines.push("", "🛍️ *ORDERED DESIGNS*");
    lines.forEach(({ product, item, lineTotal }, idx) => {
      messageLines.push(`${idx + 1}. ${product.name} (${product.productCode})`);

      // Add selected colors breakdown if available
      if (item.selectedColors) {
        const colors = Object.entries(item.selectedColors).filter(([, qty]) => qty > 0);
        if (colors.length > 0) {
          const colorStr = colors.map(([color, q]) => `${color}: ${q} pcs`).join(", ");
          messageLines.push(`   Colors: [ ${colorStr} ]`);
        }
      }

      messageLines.push(`   ${formatPieces(item.quantity)} × ${formatPrice(product.price)} = ${formatPrice(lineTotal)}`);
    });

    messageLines.push(
      "",
      "📊 *ORDER SUMMARY*",
      `• Total Designs: ${summary.designCount}`,
      `• Total Quantity: ${formatPieces(summary.totalPieces)}`,
      `• Estimated Value: ${formatPrice(summary.estimatedValue)} (excl. GST & shipping)`,
    );

    if (note.trim()) {
      messageLines.push("", `• Note: ${note.trim()}`);
    }

    messageLines.push("", "Please confirm stock availability, final invoice & dispatch timelines.");

    const url = buildWhatsAppUrl(messageLines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Proceed to Wholesale Enquiry Checkout"
      description="Enter your business details below to send your complete order list directly to our Surat wholesale desk on WhatsApp."
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
        {error ? (
          <div className="rounded-xs border border-danger/30 bg-danger/10 p-3 text-xs text-danger">{error}</div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="checkout-name" className="field-label">
              Your Name <span className="text-accent">*</span>
            </label>
            <Input
              id="checkout-name"
              type="text"
              required
              placeholder="e.g. Ramesh Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="checkout-business" className="field-label">
              Store / Boutique Name <span className="text-accent">*</span>
            </label>
            <Input
              id="checkout-business"
              type="text"
              required
              placeholder="e.g. Saree Sangam Boutique"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="checkout-city" className="field-label">
              City & State <span className="text-accent">*</span>
            </label>
            <Input
              id="checkout-city"
              type="text"
              required
              placeholder="e.g. Ahmedabad, Gujarat"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="checkout-phone" className="field-label">
              Phone / WhatsApp Number <span className="text-accent">*</span>
            </label>
            <Input
              id="checkout-phone"
              type="tel"
              required
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <label htmlFor="checkout-gstin" className="field-label">
            GSTIN <span className="text-subtle">(Optional)</span>
          </label>
          <Input
            id="checkout-gstin"
            type="text"
            placeholder="e.g. 24AAAAA0000A1Z5"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="checkout-note" className="field-label">
            Special Instructions / Preferred Dispatch <span className="text-subtle">(Optional)</span>
          </label>
          <textarea
            id="checkout-note"
            rows={2}
            placeholder="e.g. Urgent festive requirement, need transport delivery..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input mt-1.5 w-full py-2"
          />
        </div>

        <div className="mt-4 flex flex-col gap-3.5 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" leadingIcon={<WhatsAppIcon size={18} />}>
            Send Order on WhatsApp
          </Button>
        </div>
      </form>
    </Modal>
  );
}
