import { adminCollectionsStore, saveAdminCollection, deleteAdminCollection } from "@/lib/admin-stores";
import { collections as staticCollections } from "@/data/collections";
import type { Collection } from "@/types";

export interface CollectionRepository {
  getAll(): Collection[];
  getById(id: string): Collection | undefined;
  getBySlug(slug: string): Collection | undefined;
  create(data: Partial<Collection> & { name: string }): Collection;
  update(id: string, data: Partial<Collection>): Collection | undefined;
  delete(id: string): boolean;
}

export const collectionRepository: CollectionRepository = {
  getAll() {
    if (typeof window === "undefined") return staticCollections;
    return adminCollectionsStore.get();
  },

  getById(id) {
    return this.getAll().find((col) => col.id === id);
  },

  getBySlug(slug) {
    return this.getAll().find((col) => col.slug === slug);
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
