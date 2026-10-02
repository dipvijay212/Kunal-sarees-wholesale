import { productsApi } from "@/lib/api";
import { adaptProduct } from "@/lib/api-adapters";
import type { Product } from "@/types";

let cachedProducts: Product[] = [];

export interface ProductRepository {
  getAll(options?: { includeInactive?: boolean }): Product[];
  getById(id: string, options?: { includeInactive?: boolean }): Product | undefined;
  getBySlug(slug: string, options?: { includeInactive?: boolean }): Product | undefined;
  fetchBySlug(slug: string): Promise<Product | undefined>;
  fetchAll(options?: { includeInactive?: boolean; limit?: number }): Promise<Product[]>;
  create(data: Partial<Product> & { name: string; price: number }): Product;
  update(id: string, data: Partial<Product>): Product | undefined;
  delete(id: string): boolean;
}

export const productRepository: ProductRepository = {
  getAll(options = {}) {
    return options.includeInactive ? cachedProducts : cachedProducts.filter((p: Product) => p.status === "active");
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
        limit: options.limit ?? 100,
      });
      if (res && res.products) {
        const adapted = res.products.map(adaptProduct);
        cachedProducts = adapted;
        return adapted;
      }
    } catch (err) {
      console.error("Error fetching all products from API:", err);
    }
    return this.getAll(options);
  },

  create(data) {
    const newProd = data as Product;
    cachedProducts.unshift(newProd);
    return newProd;
  },

  update(id, data) {
    const index = cachedProducts.findIndex((p) => p.id === id);
    if (index >= 0) {
      cachedProducts[index] = { ...cachedProducts[index], ...data };
      return cachedProducts[index];
    }
    return undefined;
  },

  delete(id) {
    cachedProducts = cachedProducts.filter((p) => p.id !== id);
    return true;
  },
};
