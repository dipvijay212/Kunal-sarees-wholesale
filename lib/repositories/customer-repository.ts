import { orderRepository } from "./order-repository";
import { getCustomerProfilesFromOrders, CustomerProfile } from "@/app/admin/customers/page";

export interface CustomerRepository {
  getAll(): CustomerProfile[];
  getById(id: string): CustomerProfile | undefined;
}

export const customerRepository: CustomerRepository = {
  getAll() {
    const orders = orderRepository.getAll();
    return getCustomerProfilesFromOrders(orders);
  },

  getById(id) {
    const decoded = decodeURIComponent(id);
    return this.getAll().find((c) => c.id === id || c.whatsapp === decoded || c.name === decoded);
  },
};
