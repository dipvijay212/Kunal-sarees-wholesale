import { customers } from "@/data/customers";
import { orders } from "@/data/orders";
import type { Customer, Order, OrderStatus } from "@/types";

/*
 * Customer and order queries. Nothing on the storefront uses these yet — they
 * back the mock order history and are ready for an admin area later.
 */

const customersById = new Map(customers.map((customer) => [customer.id, customer]));

export function getCustomers(): Customer[] {
  return customers;
}

export function getCustomerById(id: string): Customer | undefined {
  return customersById.get(id);
}

function byMostRecent(a: Order, b: Order): number {
  return b.placedAt.localeCompare(a.placedAt);
}

export function getOrders(): Order[] {
  return [...orders].sort(byMostRecent);
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return orders.find((order) => order.orderNumber === orderNumber);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return getOrders().filter((order) => order.customerId === customerId);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return getOrders().filter((order) => order.status === status);
}
