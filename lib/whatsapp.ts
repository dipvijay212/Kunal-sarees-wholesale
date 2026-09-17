import { siteConfig } from "@/data/site";
import type { OrderListLine, OrderListSummary, Product } from "@/types";
import { formatPieces, formatPrice } from "./format";

/**
 * WhatsApp click-to-chat helpers (https://wa.me). These only open a chat with a
 * pre-filled message — no WhatsApp Business API is involved.
 */

export function buildWhatsAppUrl(message?: string, phoneNumber = siteConfig.contact.whatsappNumber): string {
  const base = `https://wa.me/${phoneNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Absolute product URL, only when a real public site URL is configured. */
function productLink(product: Product): string | null {
  if (!process.env.NEXT_PUBLIC_SITE_URL) return null;
  return `${siteConfig.url}/products/${product.slug}`;
}

export const defaultWhatsAppMessage = `Hello ${siteConfig.name}, I would like to know more about your wholesale saree collections.`;

export function buildProductEnquiryMessage(product: Product, quantity?: number): string {
  const lines = [
    `Hello ${siteConfig.name},`,
    "",
    "I would like to enquire about this design:",
    `• ${product.name} (${product.sku})`,
  ];

  if (quantity) {
    lines.push(`• Quantity: ${formatPieces(quantity)}`);
  }

  lines.push(`• Listed wholesale rate: ${formatPrice(product.pricing.pricePerPiece)} per piece`);

  const link = productLink(product);
  if (link) lines.push(`• ${link}`);

  lines.push("", "Please share availability and dispatch timelines.");
  return lines.join("\n");
}

export function buildOrderListMessage(lines: OrderListLine[], summary: OrderListSummary): string {
  const body = lines.map(({ product, item, lineTotal }, index) =>
    [
      `${index + 1}. ${product.name} (${product.sku})`,
      `   ${formatPieces(item.quantity)} × ${formatPrice(product.pricing.pricePerPiece)} = ${formatPrice(lineTotal)}`,
    ].join("\n"),
  );

  return [
    `Hello ${siteConfig.name},`,
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
    `Hello ${siteConfig.name},`,
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
