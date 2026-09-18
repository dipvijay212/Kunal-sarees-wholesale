import { adminOrdersStore, updateOrderStatus, saveAdminOrder, OrderStatusLabel, AdminOrderRecord } from "@/lib/admin-stores";
import type { PlacedOrder } from "@/types";

export interface OrderRepository {
  getAll(): AdminOrderRecord[];
  getById(id: string): AdminOrderRecord | undefined;
  create(order: PlacedOrder): AdminOrderRecord;
  updateStatus(id: string, status: OrderStatusLabel): AdminOrderRecord | undefined;
}

export const orderRepository: OrderRepository = {
  getAll() {
    if (typeof window === "undefined") return [];
    return adminOrdersStore.get();
  },

  getById(id) {
    return this.getAll().find((o) => o.id === id || o.orderNumber === id);
  },

  create(order) {
    saveAdminOrder(order);
    return this.getById(order.id) || (order as AdminOrderRecord);
  },

  updateStatus(id, status) {
    updateOrderStatus(id, status);
    return this.getById(id);
  },
};
