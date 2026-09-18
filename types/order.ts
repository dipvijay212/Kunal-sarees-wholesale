/** Wholesale orders start as WhatsApp enquiries and are confirmed by the team. */
export type OrderStatus = "enquiry" | "confirmed" | "packed" | "dispatched" | "delivered" | "cancelled";

export type OrderChannel = "whatsapp" | "phone" | "counter";

export interface OrderItem {
  id: string;
  productId: string;
  /** Copied at order time so history is not affected by catalogue edits. */
  productCode: string;
  productName: string;
  colorName?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  channel: OrderChannel;
  subtotal: number;
  discount: number;
  /** GST percentage applied to the taxable value. */
  gstRate: number;
  gstAmount: number;
  shipping: number;
  total: number;
  placedAt: string;
  dispatchedAt?: string;
  courier?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  customerDetails: {
    fullName: string;
    businessName: string;
    customerType: string;
    whatsappNumber: string;
    mobileNumber: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    notes?: string;
  };
  items: {
    productId: string;
    productCode: string;
    productName: string;
    quantity: number;
    price: number;
    lineTotal: number;
    selectedColors?: Record<string, number>;
  }[];
  summary: {
    designCount: number;
    totalPieces: number;
    estimatedValue: number;
  };
  placedAt: string;
  whatsappUrl: string;
}
