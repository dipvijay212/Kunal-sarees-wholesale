import { adminProductsStore, saveAdminProduct, deleteAdminProduct } from "@/lib/admin-stores";
import { productsApi } from "@/lib/api";
import { adaptProduct } from "@/lib/api-adapters";
import type { Product } from "@/types";

export interface ProductRepository {
  getAll(options?: { includeInactive?: boolean }): Product[];
  getById(id: string, options?: { includeInactive?: boolean }): Product | undefined;
  getBySlug(slug: string, options?: { includeInactive?: boolean }): Product | undefined;
  fetchBySlug(slug: string): Promise<Product | undefined>;
  fetchAll(options?: { includeInactive?: boolean }): Promise<Product[]>;
  create(data: Partial<Product> & { name: string; price: number }): Product;
  update(id: string, data: Partial<Product>): Product | undefined;
  delete(id: string): boolean;
}

export const productRepository: ProductRepository = {
  getAll(options = {}) {
    const all = adminProductsStore.getSnapshot();
    return options.includeInactive ? all : all.filter((p: Product) => p.status === "active");
  },

  getById(id, options = {}) {
    return this.getAll(options).find((p) => p.id === id);
  },

  getBySlug(slug, options = {}) {
    return this.getAll(options).find((p) => p.slug === slug);
  },

  async fetchBySlug(slug: string): Promise<Product | undefined> {
    try {
      const res = await productsApi.getBySlug(slug);
      if (res && res.product) {
        return adaptProduct(res.product);
      }
    } catch (err) {
      console.error(`Error fetching product by slug '${slug}':`, err);
    }
    return this.getBySlug(slug);
  },

  async fetchAll(options = {}): Promise<Product[]> {
    try {
      const res = await productsApi.getAll({
        isAvailable: options.includeInactive ? undefined : true,
        limit: 100,
      });
      if (res && res.products) {
        const adapted = res.products.map(adaptProduct);
        if (typeof window !== "undefined") {
          adminProductsStore.set(adapted);
        }
        return adapted;
      }
    } catch (err) {
      console.error("Error fetching all products from API:", err);
    }
    return this.getAll(options);
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
