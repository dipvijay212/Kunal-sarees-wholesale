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
import { PlusIcon, CloseIcon } from "@/components/ui/Icons";

export default function AdminCategoriesPage() {
  const categories = useLocalStore(adminCategoriesStore);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const handleOpenAddModal = () => {
    setEditingCategory({
      name: "",
      description: "",
      featured: true,
      order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    const catName = cat.name || cat.name_en || cat.name_hi || "";
    const catDesc = cat.description || cat.description_en || cat.description_hi || "";
    setEditingCategory({
      ...cat,
      name: catName,
      description: catDesc,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const catName = editingCategory.name?.trim() || "";
    if (!catName) return;

    const slug = (
      editingCategory.slug || catName
    )
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `category-${Date.now()}`;

    const desc = editingCategory.description?.trim() || "";

    await saveAdminCategory({
      ...editingCategory,
      name: catName,
      name_hi: catName,
      name_en: catName,
      slug,
      description: desc,
      description_hi: desc,
      description_en: desc,
      featured: editingCategory.featured !== undefined ? editingCategory.featured : true,
    });
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
                <td className="px-4 py-3 font-semibold text-ink">
                  <div>{cat.name || cat.name_en || cat.name_hi}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{cat.slug}</td>
                <td className="px-4 py-3 text-xs text-muted max-w-xs truncate">
                  {cat.description || cat.description_en || cat.description_hi || "—"}
                </td>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-xs p-3 sm:p-6 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative flex flex-col w-full max-w-md max-h-[90vh] rounded-xs border border-line bg-canvas shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-canvas shrink-0">
              <div>
                <h3 className="type-h4 text-ink font-serif">
                  {editingCategory.id ? "Edit Category" : "Add Category"}
                </h3>
                <p className="text-[11px] text-muted">
                  Configure category name and description.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xs p-1.5 text-muted hover:text-ink hover:bg-canvas-deep transition-colors"
                aria-label="Close"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Form & Scrollable Content */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto p-5 space-y-4 text-xs flex-1">
                {/* Category Name */}
                <div>
                  <label className="font-semibold text-ink block">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Banarasi Silk"
                    value={editingCategory.name || ""}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-semibold text-ink block">Description</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Luxurious handcrafted Banarasi silk sarees..."
                    value={editingCategory.description || ""}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex justify-end gap-3 border-t border-line bg-canvas-deep px-5 py-3.5 shrink-0">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
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
