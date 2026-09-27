import { settingsRepository } from "@/lib/repositories/settings-repository";
import type { OrderListLine, OrderListSummary, Product } from "@/types";
import { formatPieces, formatPrice } from "./format";

/**
 * WhatsApp click-to-chat helpers (https://wa.me). These only open a chat with a
 * pre-filled message — no WhatsApp Business API is involved.
 */

export function getWhatsAppNumber(): string {
  return settingsRepository.get().contact.whatsappNumber;
}

export function getBusinessName(): string {
  return settingsRepository.get().businessName;
}

export function buildWhatsAppUrl(message?: string, phoneNumber?: string): string {
  const numberToUse = phoneNumber || getWhatsAppNumber();
  const base = `https://wa.me/${numberToUse}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Absolute product URL, only when a real public site URL is configured. */
function productLink(product: Product): string | null {
  const settings = settingsRepository.get();
  if (!process.env.NEXT_PUBLIC_SITE_URL) return null;
  return `${settings.seo.siteUrl}/products/${product.slug}`;
}

export const defaultWhatsAppMessage = `Hello, I would like to know more about your wholesale saree collections.`;

export function buildProductEnquiryMessage(product: Product, quantity?: number): string {
  const lines = [
    `Hello ${getBusinessName()},`,
    "",
    "I would like to enquire about this design:",
    `• ${product.name} (${product.productCode})`,
  ];

  if (quantity) {
    lines.push(`• Quantity: ${formatPieces(quantity)}`);
  }

  lines.push(`• Listed wholesale rate: ${formatPrice(product.price)} per piece`);

  const link = productLink(product);
  if (link) lines.push(`• ${link}`);

  lines.push("", "Please share availability and dispatch timelines.");
  return lines.join("\n");
}

export function buildMultiColorEnquiryMessage(
  product: Product,
  colorQuantities: Record<string, number>,
  totalQuantity: number,
): string {
  const lines = [
    `Hello ${getBusinessName()},`,
    "",
    "I would like to place an enquiry for this design:",
    `• Product: ${product.name} (${product.productCode})`,
  ];

  const activeColors = Object.entries(colorQuantities).filter(([, qty]) => qty > 0);
  if (activeColors.length > 0) {
    lines.push("• Color Breakdown:");
    for (const [colorName, qty] of activeColors) {
      lines.push(`  - ${colorName}: ${formatPieces(qty)}`);
    }
  }

  lines.push(`• Total Quantity: ${formatPieces(totalQuantity)}`);
  lines.push(`• Wholesale rate: ${formatPrice(product.price)} per piece (Est. ${formatPrice(totalQuantity * product.price)})`);

  const link = productLink(product);
  if (link) lines.push(`• Link: ${link}`);

  lines.push("", "Please confirm availability, stock status and dispatch timelines.");
  return lines.join("\n");
}

export function buildOrderListMessage(lines: OrderListLine[], summary: OrderListSummary): string {
  const body = lines.map(({ product, item, lineTotal }, index) =>
    [
      `${index + 1}. ${product.name} (${product.productCode})`,
      `   ${formatPieces(item.quantity)} × ${formatPrice(product.price)} = ${formatPrice(lineTotal)}`,
    ].join("\n"),
  );

  return [
    `Hello ${getBusinessName()},`,
    "",
    "I would like to place a wholesale order for the following designs:",
    "",
    ...body,
    "",
    `Designs: ${summary.designCount}`,
    `Total quantity: ${formatPieces(summary.totalPieces)}`,
    `Estimated value: ${formatPrice(summary.estimatedValue)} (excl. GST)`,
    "",
    "Please confirm availability, final pricing and dispatch timelines.",
  ].join("\n");
}

export interface WholesaleEnquiryDetails {
  name: string;
  businessName: string;
  city: string;
  phone: string;
  gstin?: string;
  interest: string;
  message?: string;
}

export function buildWholesaleEnquiryMessage(details: WholesaleEnquiryDetails): string {
  const lines = [
    `Hello ${getBusinessName()},`,
    "",
    "I would like to become a wholesale stockist.",
    "",
    `Name: ${details.name}`,
    `Business: ${details.businessName}`,
    `City: ${details.city}`,
    `Phone: ${details.phone}`,
  ];

  if (details.gstin) lines.push(`GSTIN: ${details.gstin}`);
  lines.push(`Interested in: ${details.interest}`);
  if (details.message) lines.push("", details.message);

  return lines.join("\n");
}

export function buildCheckoutWhatsAppMessage(
  formData: {
    fullName: string;
    mobileNumber: string;
    whatsappNumber: string;
    fullAddress: string;
    email?: string;
    businessName?: string;
    customerType?: string;
    city?: string;
    state?: string;
    pincode?: string;
    notes?: string;
  },
  lines: OrderListLine[],
  summary: OrderListSummary,
): string {
  const messageLines: string[] = [
    `Hello ${getBusinessName()},`,
    "",
    "I would like to place an order.",
    "",
    "📋 *Customer Details:*",
    `• Name: ${formData.fullName}`,
  ];

  if (formData.businessName) {
    messageLines.push(`• Business / Shop: ${formData.businessName}`);
  }

  messageLines.push(
    `• Mobile: ${formData.mobileNumber}`,
    `• WhatsApp: ${formData.whatsappNumber}`,
  );

  if (formData.email) {
    messageLines.push(`• Email: ${formData.email}`);
  }

  messageLines.push(`• Delivery Address: ${formData.fullAddress}`);

  messageLines.push("", "🛍️ *Selected Sarees:*", "");

  lines.forEach(({ product, item }, index) => {
    messageLines.push(`${index + 1}. ${product.name}`);
    messageLines.push(`   Code: ${product.productCode}`);

    if (item.selectedColors) {
      const activeColors = Object.entries(item.selectedColors).filter(([, qty]) => qty > 0);
      if (activeColors.length > 0) {
        for (const [colorName, qty] of activeColors) {
          messageLines.push(`   ${colorName}: ${qty} pcs`);
        }
      } else {
        messageLines.push(`   Quantity: ${item.quantity} pcs`);
      }
    } else {
      messageLines.push(`   Quantity: ${item.quantity} pcs`);
    }

    messageLines.push("");
  });

  messageLines.push(`📊 *Order Summary:*`);
  messageLines.push(`• Total Designs: ${summary.designCount}`);
  messageLines.push(`• Total Quantity: ${summary.totalPieces} Pieces`);
  if (summary.estimatedValue > 0) {
    messageLines.push(`• Estimated Value: ${formatPrice(summary.estimatedValue)} (excl. GST & shipping)`);
  }

  if (formData.notes?.trim()) {
    messageLines.push("", `Notes: ${formData.notes.trim()}`);
  }

  messageLines.push("", "Thank you.");

  return messageLines.join("\n");
}
