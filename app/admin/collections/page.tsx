"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import {
  adminCollectionsStore,
  deleteAdminCollection,
  saveAdminCollection,
} from "@/lib/admin-stores";
import type { Collection } from "@/types";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/Icons";

export default function AdminCollectionsPage() {
  const collections = useLocalStore(adminCollectionsStore);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Partial<Collection> | null>(null);

  const handleOpenAddModal = () => {
    setEditingCollection({
      name: "",
      tagline: "",
      description: "",
      featured: true,
      order: collections.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (col: Collection) => {
    setEditingCollection({ ...col });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection?.name) return;
    saveAdminCollection(editingCollection as Partial<Collection> & { name: string });
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  return (
    <AdminLayout title="Collection Management">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-5">
        <div>
          <h2 className="type-h4 text-ink font-serif">Curated Collections ({collections.length})</h2>
          <p className="text-xs text-muted">Manage seasonal edits, bridal edits, and festive bulk buying catalogs.</p>
        </div>

        <Button onClick={handleOpenAddModal} leadingIcon={<PlusIcon size={18} />}>
          Add Collection
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xs border border-line bg-canvas shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas-deep text-xs uppercase tracking-wider text-muted font-semibold">
            <tr>
              <th className="px-4 py-3">Collection Name</th>
              <th className="px-4 py-3">Tagline</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {collections.map((col) => (
              <tr key={col.id} className="hover:bg-canvas-deep/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-ink">{col.name}</td>
                <td className="px-4 py-3 text-xs text-muted">{col.tagline}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{col.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-xs px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                      col.featured
                        ? "bg-success/15 text-success"
                        : "bg-muted/15 text-muted"
                    }`}
                  >
                    {col.featured ? "Featured" : "Standard"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(col)}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAdminCollection(col.id)}
                    className="text-xs font-semibold text-alert hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingCollection ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xs border border-line bg-canvas p-6 shadow-lg">
            <h3 className="type-h3 text-ink font-serif border-b border-line pb-3">
              {editingCollection.id ? "Edit Collection" : "Add Collection"}
            </h3>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-ink block">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={editingCollection.name || ""}
                  onChange={(e) => setEditingCollection({ ...editingCollection, name: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Tagline</label>
                <input
                  type="text"
                  value={editingCollection.tagline || ""}
                  onChange={(e) => setEditingCollection({ ...editingCollection, tagline: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Description</label>
                <textarea
                  rows={3}
                  value={editingCollection.description || ""}
                  onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-ink font-semibold">
                <input
                  type="checkbox"
                  checked={editingCollection.featured || false}
                  onChange={(e) => setEditingCollection({ ...editingCollection, featured: e.target.checked })}
                  className="accent-accent"
                />
                Show as Featured Collection
              </label>

              <div className="flex justify-end gap-3 border-t border-line pt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Collection</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
