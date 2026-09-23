import { adminCollectionsStore, saveAdminCollection, deleteAdminCollection } from "@/lib/admin-stores";
import { collectionsApi } from "@/lib/api";
import { adaptCollection } from "@/lib/api-adapters";
import type { Collection } from "@/types";

export interface CollectionRepository {
  getAll(): Collection[];
  getById(id: string): Collection | undefined;
  getBySlug(slug: string): Collection | undefined;
  fetchAll(): Promise<Collection[]>;
  create(data: Partial<Collection> & { name: string }): Collection;
  update(id: string, data: Partial<Collection>): Collection | undefined;
  delete(id: string): boolean;
}

export const collectionRepository: CollectionRepository = {
  getAll() {
    return adminCollectionsStore.getSnapshot();
  },

  getById(id) {
    return this.getAll().find((col) => col.id === id);
  },

  getBySlug(slug) {
    return this.getAll().find((col) => col.slug === slug);
  },

  async fetchAll(): Promise<Collection[]> {
    try {
      const res = await collectionsApi.getAll();
      if (res && res.collections) {
        const adapted = res.collections.map((c, i) => adaptCollection(c, i));
        if (typeof window !== "undefined") {
          adminCollectionsStore.set(adapted);
        }
        return adapted;
      }
    } catch (err) {
      console.error("Error fetching collections from API:", err);
    }
    return this.getAll();
  },

  create(data) {
    saveAdminCollection(data);
    const all = this.getAll();
    return all[all.length - 1];
  },

  update(id, data) {
    saveAdminCollection({ ...data, id });
    return this.getById(id);
  },

  delete(id) {
    deleteAdminCollection(id);
    return true;
  },
};
