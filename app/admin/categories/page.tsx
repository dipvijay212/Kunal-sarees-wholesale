"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import {
  adminCategoriesStore,
  deleteAdminCategory,
  saveAdminCategory,
} from "@/lib/admin-stores";
import type { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/Icons";

export default function AdminCategoriesPage() {
  const categories = useLocalStore(adminCategoriesStore);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const handleOpenAddModal = () => {
    setEditingCategory({
      name: "",
      slug: "",
      description: "",
      featured: true,
      order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;
    await saveAdminCategory(editingCategory as Partial<Category> & { name: string });
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <AdminLayout title="Category Management">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-5">
        <div>
          <h2 className="type-h4 text-ink font-serif">Saree Categories ({categories.length})</h2>
          <p className="text-xs text-muted">Organize sarees by weave type, fabric family, and craft techniques.</p>
        </div>

        <Button onClick={handleOpenAddModal} leadingIcon={<PlusIcon size={18} />}>
          Add Category
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xs border border-line bg-canvas shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas-deep text-xs uppercase tracking-wider text-muted font-semibold">
            <tr>
              <th className="px-4 py-3">Category Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-canvas-deep/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-ink">{cat.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{cat.slug}</td>
                <td className="px-4 py-3 text-xs text-muted max-w-xs truncate">{cat.description}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-xs px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                      cat.featured
                        ? "bg-success/15 text-success"
                        : "bg-muted/15 text-muted"
                    }`}
                  >
                    {cat.featured ? "Featured" : "Standard"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAdminCategory(cat.id)}
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

      {isModalOpen && editingCategory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xs border border-line bg-canvas p-6 shadow-lg">
            <h3 className="type-h3 text-ink font-serif border-b border-line pb-3">
              {editingCategory.id ? "Edit Category" : "Add Category"}
            </h3>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-ink block">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-ink font-semibold">
                <input
                  type="checkbox"
                  checked={editingCategory.featured || false}
                  onChange={(e) => setEditingCategory({ ...editingCategory, featured: e.target.checked })}
                  className="accent-accent"
                />
                Show as Featured Category
              </label>

              <div className="flex justify-end gap-3 border-t border-line pt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Category</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
