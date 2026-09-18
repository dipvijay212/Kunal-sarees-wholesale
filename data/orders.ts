import type { Order, OrderChannel, OrderItem, OrderStatus } from "@/types";
import { businessSettings } from "./business";
import { products } from "./products";

/**
 * Mock order history. Line items are built from the catalogue so codes, names
 * and prices always match, and totals are computed rather than hand-written.
 */

interface OrderLineSeed {
  productId: string;
  quantity: number;
  colorName?: string;
}

interface OrderSeed {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  channel: OrderChannel;
  discount: number;
  shipping: number;
  placedAt: string;
  dispatchedAt?: string;
  courier?: string;
  trackingNumber?: string;
  notes?: string;
  lines: OrderLineSeed[];
}

const productsById = new Map(products.map((product) => [product.id, product]));

const seeds: OrderSeed[] = [
  {
    id: "ord-001",
    orderNumber: "KS/2026/0141",
    customerId: "cus-001",
    status: "delivered",
    channel: "whatsapp",
    discount: 1200,
    shipping: 450,
    placedAt: "2026-07-18",
    dispatchedAt: "2026-07-20",
    courier: "Delhivery Surface",
    trackingNumber: "DL8842197365",
    notes: "Repeat order of pastel organza sets before the festive window.",
    lines: [
      { productId: "prd-1013", quantity: 12, colorName: "Blush" },
      { productId: "prd-1014", quantity: 6, colorName: "Powder Blue" },
      { productId: "prd-1010", quantity: 24, colorName: "Pistachio" },
    ],
  },
  {
    id: "ord-002",
    orderNumber: "KS/2026/0152",
    customerId: "cus-002",
    status: "delivered",
    channel: "phone",
    discount: 2500,
    shipping: 0,
    placedAt: "2026-07-29",
    dispatchedAt: "2026-08-01",
    courier: "Gati Transport",
    trackingNumber: "GT5519034471",
    notes: "Collected by the customer's transporter; freight paid at destination.",
    lines: [
      { productId: "prd-1010", quantity: 60, colorName: "Ivory" },
      { productId: "prd-1017", quantity: 40, colorName: "Sage" },
      { productId: "prd-1018", quantity: 24, colorName: "Onyx Black" },
    ],
  },
  {
    id: "ord-003",
    orderNumber: "KS/2026/0163",
    customerId: "cus-004",
    status: "dispatched",
    channel: "counter",
    discount: 0,
    shipping: 780,
    placedAt: "2026-08-22",
    dispatchedAt: "2026-08-24",
    courier: "VRL Logistics",
    trackingNumber: "VRL7730082214",
    lines: [
      { productId: "prd-1001", quantity: 4, colorName: "Antique Ochre" },
      { productId: "prd-1004", quantity: 8, colorName: "Deep Wine" },
    ],
  },
  {
    id: "ord-004",
    orderNumber: "KS/2026/0171",
    customerId: "cus-006",
    status: "packed",
    channel: "whatsapp",
    discount: 900,
    shipping: 520,
    placedAt: "2026-09-04",
    notes: "Awaiting the customer's confirmation on the second colourway.",
    lines: [
      { productId: "prd-1007", quantity: 24, colorName: "Onyx Black" },
      { productId: "prd-1025", quantity: 16, colorName: "Deep Wine" },
      { productId: "prd-1026", quantity: 8, colorName: "Rani Pink" },
    ],
  },
  {
    id: "ord-005",
    orderNumber: "KS/2026/0178",
    customerId: "cus-005",
    status: "confirmed",
    channel: "whatsapp",
    discount: 0,
    shipping: 0,
    placedAt: "2026-09-09",
    notes: "Bridal piece made to order in champagne. Hand delivery in Delhi.",
    lines: [{ productId: "prd-1029", quantity: 1, colorName: "Champagne Gold" }],
  },
  {
    id: "ord-006",
    orderNumber: "KS/2026/0182",
    customerId: "cus-003",
    status: "confirmed",
    channel: "whatsapp",
    discount: 600,
    shipping: 380,
    placedAt: "2026-09-12",
    notes: "Needs stock counts per colour for online listings before dispatch.",
    lines: [
      { productId: "prd-1009", quantity: 20, colorName: "Mauve" },
      { productId: "prd-1016", quantity: 20, colorName: "Powder Blue" },
    ],
  },
  {
    id: "ord-007",
    orderNumber: "KS/2026/0186",
    customerId: "cus-001",
    status: "enquiry",
    channel: "whatsapp",
    discount: 0,
    shipping: 0,
    placedAt: "2026-09-16",
    notes: "Sent from the website order list; awaiting availability confirmation.",
    lines: [
      { productId: "prd-1015", quantity: 6, colorName: "Sage" },
      { productId: "prd-1024", quantity: 4, colorName: "Plum" },
    ],
  },
  {
    id: "ord-008",
    orderNumber: "KS/2025/0925",
    customerId: "cus-004",
    status: "cancelled",
    channel: "phone",
    discount: 0,
    shipping: 0,
    placedAt: "2025-12-02",
    notes: "Cancelled when the Paithani Tussar design was discontinued.",
    lines: [{ productId: "prd-1032", quantity: 4, colorName: "Peacock Teal" }],
  },
];

function buildItems(seed: OrderSeed): OrderItem[] {
  return seed.lines.map((line, index) => {
    const product = productsById.get(line.productId);
    if (!product) throw new Error(`Unknown product in ${seed.orderNumber}: ${line.productId}`);

    return {
      id: `${seed.id}-i${index + 1}`,
      productId: product.id,
      productCode: product.productCode,
      productName: product.name,
      colorName: line.colorName,
      quantity: line.quantity,
      unitPrice: product.price,
      lineTotal: product.price * line.quantity,
    };
  });
}

export const orders: Order[] = seeds.map((seed) => {
  const items = buildItems(seed);
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const taxableValue = subtotal - seed.discount;
  const gstRate = businessSettings.wholesale.gstRate;
  const gstAmount = Math.round((taxableValue * gstRate) / 100);

  const { lines, ...order } = seed;
  return {
    ...order,
    items,
    subtotal,
    gstRate,
    gstAmount,
    total: taxableValue + gstAmount + seed.shipping,
  };
});
