import { adminCategoriesStore, saveAdminCategory, deleteAdminCategory } from "@/lib/admin-stores";
import { categories as staticCategories } from "@/data/categories";
import type { Category } from "@/types";

export interface CategoryRepository {
  getAll(): Category[];
  getById(id: string): Category | undefined;
  getBySlug(slug: string): Category | undefined;
  create(data: Partial<Category> & { name: string }): Category;
  update(id: string, data: Partial<Category>): Category | undefined;
  delete(id: string): boolean;
}

export const categoryRepository: CategoryRepository = {
  getAll() {
    if (typeof window === "undefined") return staticCategories;
    return adminCategoriesStore.getSnapshot();
  },

  getById(id) {
    return this.getAll().find((c) => c.id === id);
  },

  getBySlug(slug) {
    return this.getAll().find((c) => c.slug === slug);
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
