import { createLocalStore } from "./local-store";
import { businessSettings } from "@/data/business";
import { authApi, adminApi, categoriesApi, collectionsApi } from "./api";
import { adaptProduct, adaptCategory, adaptCollection, adaptOrder } from "./api-adapters";
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

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await authApi.login({ email, password });
    adminAuthStore.set({
      isAuthenticated: true,
      email: res.user.email,
      name: res.user.name,
      loginAt: Date.now(),
    });
    // Trigger initial background sync for admin data
    syncAdminData();
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Invalid email or password.";
    return { success: false, error: errorMsg };
  }
}

export function logoutAdmin() {
  authApi.logout();
  adminAuthStore.reset();
}

/* 2. Admin Products Store ------------------------------------------------ */

function isProductList(val: unknown): val is Product[] {
  return Array.isArray(val);
}

export const adminProductsStore = createLocalStore<Product[]>({
  key: "ks:admin:products:v2",
  initialValue: [],
  validate: isProductList,
});

export async function syncAdminProducts() {
  try {
    const res = await adminApi.products.getAll({ limit: 100 });
    const adapted = res.products.map(adaptProduct);
    adminProductsStore.set(adapted);
    return adapted;
  } catch (err) {
    console.error("Failed to sync admin products:", err);
    return adminProductsStore.getSnapshot();
  }
}

export async function saveAdminProduct(productData: Partial<Product>) {
  try {
    const rawName = productData.name || productData.name_hi || productData.name_en || "साड़ी";
    const nameHi = productData.name_hi || rawName;
    const nameEn = productData.name_en || rawName;

    // Combine specifications with description for complete clarity
    let fullDescription = productData.description || "";
    if (productData.specifications?.sareeLength || productData.specifications?.blousePiece) {
      const specsSummary = [
        productData.specifications.sareeLength ? `Saree Cut: ${productData.specifications.sareeLength}` : "",
        productData.specifications.blousePiece ? `Blouse: ${productData.specifications.blousePiece}` : "",
      ].filter(Boolean).join(" | ");

      if (specsSummary && !fullDescription.includes(specsSummary)) {
        fullDescription = fullDescription ? `${specsSummary}\n\n${fullDescription}` : specsSummary;
      }
    }

    const descHi = productData.description_hi || fullDescription;
    const descEn = productData.description_en || fullDescription;
    const shortDesc = productData.shortDescription || productData.shortDescription_hi || productData.shortDescription_en || (fullDescription ? fullDescription.slice(0, 120) : rawName);
    const shortHi = shortDesc;
    const shortEn = shortDesc;

    const fabricVal = typeof productData.fabric === "string" ? productData.fabric : (productData.fabric_hi || productData.fabric_en || "Banarasi Silk");
    const colorVal = (typeof productData.color_hi === "string" ? productData.color_hi : "") ||
                     (typeof productData.color_en === "string" ? productData.color_en : "") ||
                     (productData.colors || []).map((c) => c.name).join(", ") ||
                     "Multi / Matching Set";

    // Extract raw Category ID number if in string format (e.g. "cat-1" -> 1 or "1" -> 1)
    let categoryIdNum: number | undefined = undefined;
    if (productData.categoryId) {
      const parsedId = Number(String(productData.categoryId).replace(/^cat-/, ""));
      if (!isNaN(parsedId) && parsedId > 0) {
        categoryIdNum = parsedId;
      }
    }

    const productImages = (productData.images || []).map((img, idx) => ({
      imageUrl: img.url,
      altText: img.alt || rawName,
      displayOrder: idx + 1,
    }));

    if (productData.id) {
      const rawId = productData.id.replace(/^prd-/, "");
      await adminApi.products.update(rawId, {
        name: rawName,
        name_hi: nameHi,
        name_en: nameEn,
        slug: productData.slug,
        productCode: productData.productCode,
        categoryId: categoryIdNum,
        description: fullDescription,
        description_hi: descHi,
        description_en: descEn,
        shortDescription: shortDesc,
        short_description_hi: shortHi,
        short_description_en: shortEn,
        fabric: fabricVal,
        fabric_hi: fabricVal,
        fabric_en: fabricVal,
        color: colorVal,
        color_hi: colorVal,
        color_en: colorVal,
        price: productData.price,
        minimumOrderQuantity: productData.moq,
        stockQuantity: productData.stock,
        isAvailable: productData.status === "active",
        isFeatured: Boolean(productData.featured),
        isNew: Boolean(productData.newArrival),
        videoUrl: productData.videoUrl || null,
        images: productImages,
      });
    } else {
      const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "saree";
      const codeDigits = Math.floor(1000 + Math.random() * 9000);
      await adminApi.products.create({
        name: rawName,
        name_hi: nameHi,
        name_en: nameEn,
        slug: productData.slug || slug,
        productCode: productData.productCode || `KS-NEW-${codeDigits}`,
        categoryId: categoryIdNum,
        description: fullDescription,
        description_hi: descHi,
        description_en: descEn,
        shortDescription: shortDesc,
        short_description_hi: shortHi,
        short_description_en: shortEn,
        fabric: fabricVal,
        fabric_hi: fabricVal,
        fabric_en: fabricVal,
        color: colorVal,
        color_hi: colorVal,
        color_en: colorVal,
        price: productData.price || 2500,
        minimumOrderQuantity: productData.moq || 2,
        stockQuantity: productData.stock ?? 50,
        isAvailable: productData.status ? productData.status === "active" : true,
        isFeatured: Boolean(productData.featured),
        isNew: Boolean(productData.newArrival),
        videoUrl: productData.videoUrl || null,
        images: productImages,
      });
    }
    await syncAdminProducts();
  } catch (err) {
    console.error("Error saving admin product:", err);
  }
}

export async function deleteAdminProduct(id: string) {
  try {
    const rawId = id.replace(/^prd-/, "");
    await adminApi.products.delete(rawId);
    adminProductsStore.set((products) => products.filter((p) => p.id !== id));
  } catch (err) {
    console.error("Error deleting admin product:", err);
  }
}

export async function toggleAdminProductStatus(id: string) {
  const current = adminProductsStore.getSnapshot().find((p) => p.id === id);
  if (!current) return;
  const newStatus = current.status === "active" ? "draft" : "active";
  const rawId = id.replace(/^prd-/, "");
  try {
    await adminApi.products.update(rawId, {
      isAvailable: newStatus === "active",
    });
    adminProductsStore.set((products) =>
      products.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  } catch (err) {
    console.error("Error toggling product status:", err);
  }
}

/* 3. Admin Categories Store ---------------------------------------------- */

function isCategoryList(val: unknown): val is Category[] {
  return Array.isArray(val);
}

export const adminCategoriesStore = createLocalStore<Category[]>({
  key: "ks:admin:categories:v2",
  initialValue: [],
  validate: isCategoryList,
});

export async function syncAdminCategories() {
  try {
    const res = await categoriesApi.getAll();
    const adapted = res.categories.map((c, i) => adaptCategory(c, i));
    adminCategoriesStore.set(adapted);
    return adapted;
  } catch (err) {
    console.error("Failed to sync admin categories:", err);
    return adminCategoriesStore.getSnapshot();
  }
}

export async function saveAdminCategory(categoryData: Partial<Category>) {
  try {
    const nameHi = categoryData.name_hi || categoryData.name || "साड़ी";
    const nameEn = categoryData.name_en || categoryData.name || "Saree";
    const descHi = categoryData.description_hi || categoryData.description || "";
    const descEn = categoryData.description_en || categoryData.description || "";

    if (categoryData.id) {
      const rawId = categoryData.id.replace(/^cat-/, "");
      await adminApi.categories.update(rawId, {
        name: nameHi,
        name_hi: nameHi,
        name_en: nameEn,
        slug: categoryData.slug,
        description: descHi,
        description_hi: descHi,
        description_en: descEn,
      });
    } else {
      const slug = (categoryData.name_en || categoryData.name || "category").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await adminApi.categories.create({
        name: nameHi,
        name_hi: nameHi,
        name_en: nameEn,
        slug: categoryData.slug || slug,
        description: descHi,
        description_hi: descHi,
        description_en: descEn,
      });
    }
    await syncAdminCategories();
  } catch (err) {
    console.error("Error saving admin category:", err);
  }
}

export async function deleteAdminCategory(id: string) {
  try {
    const rawId = id.replace(/^cat-/, "");
    await adminApi.categories.delete(rawId);
    adminCategoriesStore.set((categories) => categories.filter((c) => c.id !== id));
  } catch (err) {
    console.error("Error deleting category:", err);
  }
}

/* 4. Admin Collections Store --------------------------------------------- */

function isCollectionList(val: unknown): val is Collection[] {
  return Array.isArray(val);
}

export const adminCollectionsStore = createLocalStore<Collection[]>({
  key: "ks:admin:collections:v2",
  initialValue: [],
  validate: isCollectionList,
});

export async function syncAdminCollections() {
  try {
    const res = await collectionsApi.getAll();
    const adapted = res.collections.map((col, i) => adaptCollection(col, i));
    adminCollectionsStore.set(adapted);
    return adapted;
  } catch (err) {
    console.error("Failed to sync admin collections:", err);
    return adminCollectionsStore.getSnapshot();
  }
}

export async function saveAdminCollection(collectionData: Partial<Collection>) {
  try {
    if (collectionData.id) {
      const rawId = collectionData.id.replace(/^col-/, "");
      await adminApi.collections.update(rawId, {
        name: collectionData.name,
        slug: collectionData.slug,
        description: collectionData.description,
        image: collectionData.image?.url,
      });
    } else {
      const name = collectionData.name || "New Collection";
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await adminApi.collections.create({
        name,
        slug: collectionData.slug || slug,
        description: collectionData.description || "",
        image: collectionData.image?.url,
      });
    }
    await syncAdminCollections();
  } catch (err) {
    console.error("Error saving admin collection:", err);
  }
}

export async function deleteAdminCollection(id: string) {
  try {
    const rawId = id.replace(/^col-/, "");
    await adminApi.collections.delete(rawId);
    adminCollectionsStore.set((collections) => collections.filter((c) => c.id !== id));
  } catch (err) {
    console.error("Error deleting collection:", err);
  }
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

function isOrderList(val: unknown): val is AdminOrderRecord[] {
  return Array.isArray(val);
}

export const adminOrdersStore = createLocalStore<AdminOrderRecord[]>({
  key: "ks:admin:orders:v2",
  initialValue: [],
  validate: isOrderList,
});

export async function syncAdminOrders() {
  try {
    const res = await adminApi.orders.getAll({ limit: 100 });
    const adapted = res.orders.map((o) => adaptOrder(o) as AdminOrderRecord);
    adminOrdersStore.set(adapted);
    return adapted;
  } catch (err) {
    console.error("Failed to sync admin orders:", err);
    return adminOrdersStore.getSnapshot();
  }
}

export async function updateOrderStatus(id: string, newStatus: OrderStatusLabel) {
  const rawId = id.replace(/^ord-/, "");
  const statusMap: Record<OrderStatusLabel, string> = {
    New: "pending",
    Confirmed: "confirmed",
    Processing: "processing",
    Ready: "packed",
    Completed: "completed",
    Cancelled: "cancelled",
  };
  try {
    await adminApi.orders.updateStatus(rawId, statusMap[newStatus] || "pending");
    adminOrdersStore.set((orders) =>
      orders.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o))
    );
  } catch (err) {
    console.error("Error updating order status:", err);
  }
}

export function saveAdminOrder(order: PlacedOrder) {
  const adminRecord: AdminOrderRecord = {
    ...order,
    orderStatus: "New",
  };
  adminOrdersStore.set((orders) => [adminRecord, ...orders]);
}

export async function syncAdminData() {
  if (typeof window === "undefined") return;
  await Promise.allSettled([
    syncAdminProducts(),
    syncAdminCategories(),
    syncAdminOrders(),
  ]);
}
