"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import {
  adminCategoriesStore,
  adminCollectionsStore,
  adminProductsStore,
  deleteAdminProduct,
  saveAdminProduct,
  toggleAdminProductStatus,
} from "@/lib/admin-stores";
import { formatPieces, formatPrice } from "@/lib/format";
import type { Product, Fabric, DesignType, ProductStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { PlusIcon, SearchIcon } from "@/components/ui/Icons";

export default function AdminProductsPage() {
  const products = useLocalStore(adminProductsStore);
  const categories = useLocalStore(adminCategoriesStore);
  const collections = useLocalStore(adminCollectionsStore);

  // Filters & State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.productCode.toLowerCase().includes(search.toLowerCase()) ||
      p.fabric.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchesCollection = selectedCollection === "all" || p.collectionId === selectedCollection;
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesCollection && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingProduct({
      name: "",
      productCode: `KS-BNS-${Math.floor(1000 + Math.random() * 9000)}`,
      description: "",
      fabric: "Banarasi Silk" as Fabric,
      design: "Zari Weave" as DesignType,
      price: 2500,
      moq: 5,
      stock: 50,
      categoryId: categories[0]?.id || "",
      collectionId: collections[0]?.id || "",
      featured: false,
      newArrival: true,
      status: "active" as ProductStatus,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;
    saveAdminProduct(editingProduct as Partial<Product> & { name: string; price: number });
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <AdminLayout title="Product Management">
      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-5">
        <div>
          <h2 className="type-h4 text-ink font-serif">Saree Catalogue ({filteredProducts.length})</h2>
          <p className="text-xs text-muted">Manage design prices, minimum order quantities, stock levels and visibility.</p>
        </div>

        <Button onClick={handleOpenAddModal} leadingIcon={<PlusIcon size={18} />}>
          Add New Saree
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search name, code, fabric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xs border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Collection Filter */}
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="all">All Collections</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft / Hidden</option>
          <option value="discontinued">Discontinued</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="mt-6 overflow-x-auto rounded-xs border border-line bg-canvas shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas-deep text-xs uppercase tracking-wider text-muted font-semibold">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Fabric</th>
              <th className="px-4 py-3">Wholesale Price</th>
              <th className="px-4 py-3">MOQ</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-canvas-deep/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-ink">
                  <div>
                    {product.name}
                    {product.featured ? (
                      <span className="ml-2 inline-block rounded-xs bg-amber-500/15 px-1.5 py-0.2 text-[0.625rem] font-bold text-amber-700">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{product.productCode}</td>
                <td className="px-4 py-3 text-xs text-ink">{product.fabric}</td>
                <td className="px-4 py-3 font-semibold text-ink">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 text-xs text-muted">{formatPieces(product.moq)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-semibold text-xs ${
                      product.stock < 15 ? "text-alert" : "text-ink"
                    }`}
                  >
                    {formatPieces(product.stock)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAdminProductStatus(product.id)}
                    className={`rounded-xs px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                      product.status === "active"
                        ? "bg-success/15 text-success hover:bg-success/25"
                        : "bg-muted/15 text-muted hover:bg-muted/25"
                    }`}
                  >
                    {product.status}
                  </button>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAdminProduct(product.id)}
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xs border border-line bg-canvas p-6 shadow-lg my-8">
            <h3 className="type-h3 text-ink font-serif border-b border-line pb-3">
              {editingProduct.id ? "Edit Saree Product" : "Add New Saree Product"}
            </h3>

            <form onSubmit={handleSave} className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
              <div>
                <label className="font-semibold text-ink block">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Product Code *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.productCode || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, productCode: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-ink block">Category</label>
                <select
                  value={editingProduct.categoryId || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-ink block">Wholesale Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.price || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Minimum Order Quantity (MOQ) *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.moq || 5}
                  onChange={(e) => setEditingProduct({ ...editingProduct, moq: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Stock Available (pcs) *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.stock || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block">Fabric</label>
                <input
                  type="text"
                  value={editingProduct.fabric || "Banarasi Silk"}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value as Fabric })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-ink block">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2 py-2">
                <label className="flex items-center gap-2 cursor-pointer text-ink font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="accent-accent"
                  />
                  Featured Design
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-ink font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.newArrival || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, newArrival: e.target.checked })}
                    className="accent-accent"
                  />
                  New Arrival
                </label>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 border-t border-line pt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Product</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
