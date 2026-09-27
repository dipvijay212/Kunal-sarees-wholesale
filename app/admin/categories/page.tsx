"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import {
  adminCategoriesStore,
  deleteAdminCategory,
  saveAdminCategory,
} from "@/lib/admin-stores";
import { adminApi } from "@/lib/api";
import type { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { PlusIcon, CloseIcon } from "@/components/ui/Icons";
import type { Language } from "@/lib/translations";

export default function AdminCategoriesPage() {
  const categories = useLocalStore(adminCategoriesStore);

  // Active Enabled Languages in System
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>(["hi", "en"]);

  useEffect(() => {
    adminApi.settings.getLanguage()
      .then((res) => {
        if (res && Array.isArray(res.availableLanguages)) {
          setAvailableLanguages(res.availableLanguages);
        }
      })
      .catch(() => {});
  }, []);

  const isHindiEnabled = availableLanguages.includes("hi");
  const isEnglishEnabled = availableLanguages.includes("en");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const handleOpenAddModal = () => {
    setEditingCategory({
      name: "",
      name_hi: "",
      name_en: "",
      slug: "",
      description: "",
      description_hi: "",
      description_en: "",
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
    if (!editingCategory) return;
    const primaryName = editingCategory.name_hi || editingCategory.name_en || editingCategory.name || "";
    if (!primaryName) return;

    await saveAdminCategory({
      ...editingCategory,
      name: primaryName,
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
                  <div>{cat.name_hi || cat.name}</div>
                  {cat.name_en && cat.name_en !== cat.name_hi ? (
                    <div className="text-xs text-muted font-normal">EN: {cat.name_en}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{cat.slug}</td>
                <td className="px-4 py-3 text-xs text-muted max-w-xs truncate">
                  {cat.description_hi || cat.description_en || cat.description}
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
                  Configure category names and multilingual descriptions.
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
                {/* Category Name (Hindi) */}
                {isHindiEnabled && (
                  <div>
                    <label className="font-semibold text-ink block">
                      Category Name (Hindi / हिंदी) *
                    </label>
                    <input
                      type="text"
                      required={isHindiEnabled}
                      placeholder="उदा. बनारसी सिल्क"
                      value={editingCategory.name_hi || editingCategory.name || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name_hi: e.target.value,
                          name: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                )}

                {/* Category Name (English) */}
                {isEnglishEnabled && (
                  <div>
                    <label className="font-semibold text-ink block">
                      Category Name (English) {!isHindiEnabled ? "*" : ""}
                    </label>
                    <input
                      type="text"
                      required={!isHindiEnabled}
                      placeholder="e.g. Banarasi Silk"
                      value={editingCategory.name_en || (!isHindiEnabled ? editingCategory.name : "") || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name_en: e.target.value,
                          name: !isHindiEnabled ? e.target.value : (editingCategory.name || e.target.value),
                        })
                      }
                      className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="font-semibold text-ink block">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. banarasi-silk"
                    value={editingCategory.slug || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Description Hindi */}
                {isHindiEnabled && (
                  <div>
                    <label className="font-semibold text-ink block">Description (Hindi / हिंदी)</label>
                    <textarea
                      rows={2}
                      placeholder="उदा. बनारस के कारीगरों द्वारा तैयार की गई शुद्ध सिल्क साड़ियां..."
                      value={editingCategory.description_hi || editingCategory.description || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          description_hi: e.target.value,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                )}

                {/* Description English */}
                {isEnglishEnabled && (
                  <div>
                    <label className="font-semibold text-ink block">Description (English)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Luxurious handcrafted Banarasi silk sarees..."
                      value={editingCategory.description_en || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          description_en: e.target.value,
                          ...(!isHindiEnabled ? { description: e.target.value } : {}),
                        })
                      }
                      className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer text-ink font-semibold">
                  <input
                    type="checkbox"
                    checked={editingCategory.featured || false}
                    onChange={(e) => setEditingCategory({ ...editingCategory, featured: e.target.checked })}
                    className="accent-accent"
                  />
                  Show as Featured Category
                </label>
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
