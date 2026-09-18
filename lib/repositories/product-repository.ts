import { adminProductsStore, saveAdminProduct, deleteAdminProduct } from "@/lib/admin-stores";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/types";

export interface ProductRepository {
  getAll(options?: { includeInactive?: boolean }): Product[];
  getById(id: string, options?: { includeInactive?: boolean }): Product | undefined;
  getBySlug(slug: string, options?: { includeInactive?: boolean }): Product | undefined;
  create(data: Partial<Product> & { name: string; price: number }): Product;
  update(id: string, data: Partial<Product>): Product | undefined;
  delete(id: string): boolean;
}

export const productRepository: ProductRepository = {
  getAll(options = {}) {
    if (typeof window === "undefined") {
      return options.includeInactive ? staticProducts : staticProducts.filter((p: Product) => p.status === "active");
    }
    const all = adminProductsStore.getSnapshot();
    return options.includeInactive ? all : all.filter((p: Product) => p.status === "active");
  },

  getById(id, options = {}) {
    return this.getAll(options).find((p) => p.id === id);
  },

  getBySlug(slug, options = {}) {
    return this.getAll(options).find((p) => p.slug === slug);
  },

  create(data) {
    saveAdminProduct(data);
    const all = this.getAll({ includeInactive: true });
    return all[0] || (data as Product);
  },

  update(id, data) {
    saveAdminProduct({ ...data, id });
    return this.getById(id, { includeInactive: true });
  },

  delete(id) {
    deleteAdminProduct(id);
    return true;
  },
};
