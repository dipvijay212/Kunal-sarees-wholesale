import { orderRepository, customerRepository } from "@/lib/repositories";
import type { Customer, Order, OrderStatus } from "@/types";

/*
 * Customer and order queries backed by live repository layer.
 */

export function getCustomers(): Customer[] {
  const profiles = customerRepository.getAll();
  return profiles.map((p) => ({
    id: p.id,
    businessName: p.business,
    contactName: p.name,
    type: "retail-store" as const,
    phone: p.whatsapp,
    city: p.city,
    state: p.state,
    since: p.lastOrderDate,
  }));
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find((c) => c.id === id);
}

export function getOrders(): Order[] {
  const adminOrders = orderRepository.getAll();
  return adminOrders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerId: o.customerDetails.whatsappNumber || o.customerDetails.fullName,
    items: o.items.map((it) => ({
      id: it.productId,
      productId: it.productId,
      productCode: it.productCode,
      productName: it.productName,
      quantity: it.quantity,
      unitPrice: it.price,
      lineTotal: it.lineTotal,
    })),
    status: (o.orderStatus?.toLowerCase() || "enquiry") as OrderStatus,
    channel: "whatsapp" as const,
    subtotal: o.summary.estimatedValue,
    discount: 0,
    gstRate: 0,
    gstAmount: 0,
    shipping: 0,
    total: o.summary.estimatedValue,
    placedAt: o.placedAt,
  }));
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((order) => order.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return getOrders().find((order) => order.orderNumber === orderNumber);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return getOrders().filter((order) => order.customerId === customerId);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return getOrders().filter((order) => order.status === status);
}
