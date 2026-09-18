import { createLocalStore } from "./local-store";
import { products as mockProducts } from "@/data/products";
import { categories as mockCategories } from "@/data/categories";
import { collections as mockCollections } from "@/data/collections";
import { businessSettings } from "@/data/business";
import type { Product, Category, Collection, BusinessSettings, PlacedOrder } from "@/types";

/* 1. Admin Auth Store ---------------------------------------------------- */

export interface AdminSession {
  isAuthenticated: boolean;
  email?: string;
  name?: string;
  loginAt?: number;
}

const EMPTY_SESSION: AdminSession = { isAuthenticated: false };

function isAdminSession(val: unknown): val is AdminSession {
  if (typeof val !== "object" || val === null) return false;
  const s = val as Record<string, unknown>;
  return typeof s.isAuthenticated === "boolean";
}

export const adminAuthStore = createLocalStore<AdminSession>({
  key: "ks:admin:session:v1",
  initialValue: EMPTY_SESSION,
  validate: isAdminSession,
});

export function loginAdmin(email: string, password: string): { success: boolean; error?: string } {
  if (email.trim().toLowerCase() === "admin@kunalsarees.com" && password === "Admin@123") {
    adminAuthStore.set({
      isAuthenticated: true,
      email: "admin@kunalsarees.com",
      name: "Kunal Sarees Admin",
      loginAt: Date.now(),
    });
    return { success: true };
  }
  return { success: false, error: "Invalid email or password. Use demo credentials." };
}

export function logoutAdmin() {
  adminAuthStore.reset();
}

/* 2. Admin Products Store ------------------------------------------------ */

function isProductList(val: unknown): val is Product[] {
  return Array.isArray(val) && val.length > 0 && typeof val[0].id === "string";
}

export const adminProductsStore = createLocalStore<Product[]>({
  key: "ks:admin:products:v1",
  initialValue: mockProducts,
  validate: isProductList,
});

export function saveAdminProduct(productData: Partial<Product>) {
  adminProductsStore.set((products) => {
    if (productData.id) {
      // Edit existing product
      return products.map((p) => (p.id === productData.id ? ({ ...p, ...productData } as Product) : p));
    }
    // Add new product
    const name = productData.name || "Untitled Saree";
    const newId = `prod-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const codeDigits = Math.floor(1000 + Math.random() * 9000);
    const newProduct: Product = {
      id: newId,
      productCode: productData.productCode || `KS-NEW-${codeDigits}`,
      name,
      slug: productData.slug || slug,
      description: productData.description || "",
      shortDescription: productData.shortDescription || productData.description || "",
      categoryId: productData.categoryId || mockCategories[0].id,
      collectionId: productData.collectionId || mockCollections[0].id,
      fabric: productData.fabric || "Banarasi Silk",
      design: productData.design || "Zari Weave",
      price: productData.price || 2500,
      moq: productData.moq || 5,
      orderMultiple: productData.orderMultiple || 1,
      stock: productData.stock ?? 50,
      colors: productData.colors || [{ name: "Red", hex: "#DC2626" }],
      images: productData.images || [
        {
          url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
          alt: name,
          width: 1200,
          height: 1600,
        },
      ],
      variants: [],
      specifications: productData.specifications || {
        sareeLength: "5.5 meters",
        blousePiece: "0.8 meters (Unstitched)",
        weight: "750g",
        washCare: "Dry Clean Only",
        origin: "Surat, Gujarat",
      },
      highlights: productData.highlights || ["Pure Silk Fabric", "Intricate Weave", "Wholesale MOQ 5 Pcs"],
      featured: Boolean(productData.featured),
      newArrival: Boolean(productData.newArrival),
      status: productData.status || "active",
      createdAt: new Date().toISOString(),
    };
    return [newProduct, ...products];
  });
}

export function deleteAdminProduct(id: string) {
  adminProductsStore.set((products) => products.filter((p) => p.id !== id));
}

export function toggleAdminProductStatus(id: string) {
  adminProductsStore.set((products) =>
    products.map((p) =>
      p.id === id ? { ...p, status: p.status === "active" ? "draft" : "active" } : p,
    ),
  );
}

/* 3. Admin Categories Store ---------------------------------------------- */

function isCategoryList(val: unknown): val is Category[] {
  return Array.isArray(val) && val.length > 0 && typeof val[0].id === "string";
}

export const adminCategoriesStore = createLocalStore<Category[]>({
  key: "ks:admin:categories:v1",
  initialValue: mockCategories,
  validate: isCategoryList,
});

export function saveAdminCategory(categoryData: Partial<Category>) {
  adminCategoriesStore.set((categories) => {
    if (categoryData.id) {
      return categories.map((c) => (c.id === categoryData.id ? ({ ...c, ...categoryData } as Category) : c));
    }
    const name = categoryData.name || "New Category";
    const newId = `cat-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newCat: Category = {
      id: newId,
      name,
      slug: categoryData.slug || slug,
      description: categoryData.description || "",
      image: categoryData.image || {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        alt: name,
        width: 800,
        height: 1000,
      },
      featured: Boolean(categoryData.featured),
      order: categories.length + 1,
    };
    return [...categories, newCat];
  });
}

export function deleteAdminCategory(id: string) {
  adminCategoriesStore.set((categories) => categories.filter((c) => c.id !== id));
}

/* 4. Admin Collections Store --------------------------------------------- */

function isCollectionList(val: unknown): val is Collection[] {
  return Array.isArray(val) && val.length > 0 && typeof val[0].id === "string";
}

export const adminCollectionsStore = createLocalStore<Collection[]>({
  key: "ks:admin:collections:v1",
  initialValue: mockCollections,
  validate: isCollectionList,
});

export function saveAdminCollection(collectionData: Partial<Collection>) {
  adminCollectionsStore.set((collections) => {
    if (collectionData.id) {
      return collections.map((col) => (col.id === collectionData.id ? ({ ...col, ...collectionData } as Collection) : col));
    }
    const name = collectionData.name || "New Collection";
    const newId = `col-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newCol: Collection = {
      id: newId,
      name,
      slug: collectionData.slug || slug,
      tagline: collectionData.tagline || "",
      description: collectionData.description || "",
      image: collectionData.image || {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        alt: name,
        width: 800,
        height: 1000,
      },
      featured: Boolean(collectionData.featured),
      order: collections.length + 1,
    };
    return [...collections, newCol];
  });
}

export function deleteAdminCollection(id: string) {
  adminCollectionsStore.set((collections) => collections.filter((c) => c.id !== id));
}

/* 5. Admin Settings Store ------------------------------------------------ */

function isBusinessSettings(val: unknown): val is BusinessSettings {
  return typeof val === "object" && val !== null && typeof (val as Record<string, unknown>).businessName === "string";
}

export const adminSettingsStore = createLocalStore<BusinessSettings>({
  key: "ks:admin:settings:v1",
  initialValue: businessSettings,
  validate: isBusinessSettings,
});

export function updateAdminSettings(updated: Partial<BusinessSettings>) {
  adminSettingsStore.set((current) => ({
    ...current,
    ...updated,
    contact: {
      ...current.contact,
      ...(updated.contact || {}),
      address: {
        ...current.contact.address,
        ...(updated.contact?.address || {}),
      },
    },
  }));
}

/* 6. Admin Orders & Status Management ----------------------------------- */

export type OrderStatusLabel = "New" | "Confirmed" | "Processing" | "Ready" | "Completed" | "Cancelled";

export interface AdminOrderRecord extends PlacedOrder {
  orderStatus: OrderStatusLabel;
}

const SEED_ORDERS: AdminOrderRecord[] = [
  {
    id: "ord-seed-1",
    orderNumber: "KS-ORD-2026-8812",
    customerDetails: {
      fullName: "Rajesh Sharma",
      businessName: "Sharma Silk Store",
      customerType: "Retailer",
      whatsappNumber: "9876543210",
      mobileNumber: "9876543210",
      city: "Surat",
      state: "Gujarat",
      pincode: "395002",
      fullAddress: "Shop 104, Millennium Market, Ring Road",
      notes: "Need urgent dispatch for festival season.",
    },
    items: [
      {
        productId: "prod-banarasi-01",
        productCode: "KS-BNS-1001",
        productName: "Aaranya Temple Border Kanjivaram Saree",
        quantity: 15,
        price: 3450,
        lineTotal: 51750,
        selectedColors: { Red: 10, Green: 5 },
      },
    ],
    summary: {
      designCount: 1,
      totalPieces: 15,
      estimatedValue: 51750,
    },
    placedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    whatsappUrl: "https://wa.me/919913238496",
    orderStatus: "New",
  },
  {
    id: "ord-seed-2",
    orderNumber: "KS-ORD-2026-4409",
    customerDetails: {
      fullName: "Priya Mehta",
      businessName: "Vogue Boutique",
      customerType: "Boutique",
      whatsappNumber: "9812345678",
      mobileNumber: "9812345678",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380009",
      fullAddress: "12 CG Road, Opp Municipal Market",
      notes: "Please include fabric shade swatches.",
    },
    items: [
      {
        productId: "prod-banarasi-02",
        productCode: "KS-BNS-1002",
        productName: "Meenakshi Korvai Silk Saree",
        quantity: 20,
        price: 4200,
        lineTotal: 84000,
        selectedColors: { Pink: 10, Blue: 10 },
      },
    ],
    summary: {
      designCount: 1,
      totalPieces: 20,
      estimatedValue: 84000,
    },
    placedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    whatsappUrl: "https://wa.me/919913238496",
    orderStatus: "Confirmed",
  },
];

function isAdminOrderList(val: unknown): val is AdminOrderRecord[] {
  return Array.isArray(val);
}

export const adminOrdersStore = createLocalStore<AdminOrderRecord[]>({
  key: "ks:admin:orders:v1",
  initialValue: SEED_ORDERS,
  validate: isAdminOrderList,
});

export function saveAdminOrder(order: PlacedOrder) {
  adminOrdersStore.set((orders) => [
    { ...order, orderStatus: "New" as OrderStatusLabel },
    ...orders.filter((o) => o.id !== order.id && o.orderNumber !== order.orderNumber),
  ]);
}

export function updateOrderStatus(orderId: string, status: OrderStatusLabel) {
  adminOrdersStore.set((orders) =>
    orders.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: status } : o)),
  );
}
