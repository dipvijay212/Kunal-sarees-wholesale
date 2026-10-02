import { categoriesApi } from "@/lib/api";
import { adaptCategory } from "@/lib/api-adapters";
import type { Category } from "@/types";

let cachedCategories: Category[] = [];

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
    return cachedCategories;
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
        cachedCategories = adapted;
        return adapted;
      }
    } catch (err) {
      console.error("Error fetching categories from API:", err);
    }
    return this.getAll();
  },

  create(data) {
    const newCat = data as Category;
    cachedCategories.push(newCat);
    return newCat;
  },

  update(id, data) {
    const index = cachedCategories.findIndex((c) => c.id === id);
    if (index >= 0) {
      cachedCategories[index] = { ...cachedCategories[index], ...data };
      return cachedCategories[index];
    }
    return undefined;
  },

  delete(id) {
    cachedCategories = cachedCategories.filter((c) => c.id !== id);
    return true;
  },
};
