import { adminCategoriesStore, saveAdminCategory, deleteAdminCategory } from "@/lib/admin-stores";
import { categoriesApi } from "@/lib/api";
import { adaptCategory } from "@/lib/api-adapters";
import type { Category } from "@/types";

export interface CategoryRepository {
  getAll(): Category[];
  getById(id: string): Category | undefined;
  getBySlug(slug: string): Category | undefined;
  fetchAll(): Promise<Category[]>;
  create(data: Partial<Category> & { name: string }): Category;
  update(id: string, data: Partial<Category>): Category | undefined;
  delete(id: string): boolean;
}

export const categoryRepository: CategoryRepository = {
  getAll() {
    return adminCategoriesStore.getSnapshot();
  },

  getById(id) {
    return this.getAll().find((c) => c.id === id);
  },

  getBySlug(slug) {
    return this.getAll().find((c) => c.slug === slug);
  },

  async fetchAll(): Promise<Category[]> {
    try {
      const res = await categoriesApi.getAll();
      if (res && res.categories) {
        const adapted = res.categories.map((c, i) => adaptCategory(c, i));
        if (typeof window !== "undefined") {
          adminCategoriesStore.set(adapted);
        }
        return adapted;
      }
    } catch (err) {
      console.error("Error fetching categories from API:", err);
    }
    return this.getAll();
  },

  create(data) {
    saveAdminCategory(data);
    const all = this.getAll();
    return all[all.length - 1];
  },

  update(id, data) {
    saveAdminCategory({ ...data, id });
    return this.getById(id);
  },

  delete(id) {
    deleteAdminCategory(id);
    return true;
  },
};
