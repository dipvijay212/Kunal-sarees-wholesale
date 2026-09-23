import { adminOrdersStore, updateOrderStatus, saveAdminOrder, OrderStatusLabel, AdminOrderRecord } from "@/lib/admin-stores";
import { adminApi } from "@/lib/api";
import { adaptOrder } from "@/lib/api-adapters";
import type { PlacedOrder } from "@/types";

export interface OrderRepository {
  getAll(): AdminOrderRecord[];
  getById(id: string): AdminOrderRecord | undefined;
  fetchAll(): Promise<AdminOrderRecord[]>;
  create(order: PlacedOrder): AdminOrderRecord;
  updateStatus(id: string, status: OrderStatusLabel): AdminOrderRecord | undefined;
}

export const orderRepository: OrderRepository = {
  getAll() {
    return adminOrdersStore.getSnapshot();
  },

  getById(id) {
    return this.getAll().find((o) => o.id === id || o.orderNumber === id);
  },

  async fetchAll(): Promise<AdminOrderRecord[]> {
    try {
      const res = await adminApi.orders.getAll({ limit: 100 });
      if (res && res.orders) {
        const adapted = res.orders.map((o) => adaptOrder(o) as AdminOrderRecord);
        if (typeof window !== "undefined") {
          adminOrdersStore.set(adapted);
        }
        return adapted;
      }
    } catch (err) {
      console.error("Error fetching orders from API:", err);
    }
    return this.getAll();
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
