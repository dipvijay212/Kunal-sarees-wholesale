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

/**
 * Makes sure a product the visitor is acting on (adding to the order list) is in the
 * client catalogue, with its latest data. The order list, checkout and search resolve
 * saved product ids against this store.
 */
export function rememberCatalogueProduct(product: Product) {
  adminProductsStore.set((products) =>
    products.some((existing) => existing.id === product.id)
      ? products.map((existing) => (existing.id === product.id ? product : existing))
      : [...products, product],
  );
}

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
    // Catalogue data is saved in English only (the backend rejects Hindi and clears *_hi).
    const rawName = (productData.name_en || productData.name || "Saree").trim();
    const nameEn = rawName;

    // Combine specifications with description cleanly without repeating previous cut summaries
    let fullDescription = (productData.description || "")
      .replace(/^Saree Cut:[^\n]+\n*/gi, "")
      .replace(/Blouse:[^\n]+\n*/gi, "")
      .trim();

    const specsSummary = [
      productData.specifications?.sareeLength ? `Saree Cut: ${productData.specifications.sareeLength}` : "",
      productData.specifications?.blousePiece ? `Blouse: ${productData.specifications.blousePiece}` : "",
      productData.design ? `Work: ${productData.design}` : "",
    ].filter(Boolean).join(" | ");

    if (specsSummary) {
      fullDescription = fullDescription ? `${specsSummary}\n\n${fullDescription}` : specsSummary;
    }

    const descEn = fullDescription;
    const shortDesc = productData.shortDescription || (fullDescription ? fullDescription.slice(0, 120) : rawName);
    const shortEn = shortDesc;

    const fabricVal = typeof productData.fabric === "string" ? productData.fabric : (productData.fabric_en || "Banarasi Silk");
    const colorVal = (typeof productData.color_en === "string" ? productData.color_en : "") ||
                     (productData.colors || []).map((c) => c.name).join(", ") ||
                     "Multi / Matching Set";

    // Extract raw Category ID number if in string format (e.g. "cat-1" -> 1 or "1" -> 1 or by slug)
    let categoryIdNum: number | undefined = undefined;
    if (productData.categoryId) {
      const strCat = String(productData.categoryId);
      const parsedId = Number(strCat.replace(/^cat-/, ""));
      if (!isNaN(parsedId) && parsedId > 0) {
        categoryIdNum = parsedId;
      } else {
        const allCats = adminCategoriesStore.getSnapshot();
        const matched = allCats.find(
          (c) => c.id === strCat || c.slug === strCat || `cat-${c.slug}` === strCat || c.name.toLowerCase() === strCat.toLowerCase()
        );
        if (matched) {
          const mId = Number(String(matched.id).replace(/^cat-/, ""));
          if (!isNaN(mId) && mId > 0) {
            categoryIdNum = mId;
          }
        }
      }
    }

    // Only Cloudinary URLs are persisted; display placeholders (e.g. stock photos) are never saved
    const productImages = (productData.images || []).filter((img) => isCloudinaryUrl(img.url)).map((img, idx) => ({
      imageUrl: img.url,
      altText: img.alt || rawName,
      displayOrder: idx + 1,
    }));

    // Multi-video payload support
    const finalVideoUrls = (productData.videoUrls && productData.videoUrls.length > 0)
      ? productData.videoUrls.filter(Boolean)
      : (productData.videoUrl ? [productData.videoUrl.trim()] : []);
    const videoUrlPayload = finalVideoUrls.length > 1
      ? JSON.stringify(finalVideoUrls)
      : (finalVideoUrls[0] || null);

    if (productData.id) {
      const rawId = String(productData.id).replace(/^prd-/, "");
      const res = await adminApi.products.update(rawId, {
        name: rawName,
        name_en: nameEn,
        slug: productData.slug,
        productCode: productData.productCode,
        categoryId: categoryIdNum,
        description: fullDescription,
        description_en: descEn,
        shortDescription: shortDesc,
        short_description_en: shortEn,
        fabric: fabricVal,
        fabric_en: fabricVal,
        color: colorVal,
        color_en: colorVal,
        price: Number(productData.price) || 0,
        minimumOrderQuantity: Number(productData.moq) || 1,
        stockQuantity: productData.stock !== undefined && productData.stock !== null && !isNaN(Number(productData.stock)) ? Number(productData.stock) : (productData.status === "active" ? 100 : 0),
        isAvailable: productData.status === "active",
        isFeatured: Boolean(productData.featured),
        isNew: Boolean(productData.newArrival),
        videoUrl: videoUrlPayload,
        images: productImages,
      });

      if (res && res.product) {
        const adapted = adaptProduct(res.product);
        adminProductsStore.set((prev) =>
          prev.map((p) => (p.id === productData.id || p.id === `prd-${rawId}` ? adapted : p))
        );
      }
    } else {
      const cleanSlug = rawName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const codeDigits = Math.floor(1000 + Math.random() * 9000);
      const generatedSlug = cleanSlug ? `${cleanSlug}-${codeDigits}` : `saree-${codeDigits}`;

      const res = await adminApi.products.create({
        name: rawName,
        name_en: nameEn,
        slug: generatedSlug,
        productCode: productData.productCode || `KS-NEW-${codeDigits}`,
        categoryId: categoryIdNum,
        description: fullDescription,
        description_en: descEn,
        shortDescription: shortDesc,
        short_description_en: shortEn,
        fabric: fabricVal,
        fabric_en: fabricVal,
        color: colorVal,
        color_en: colorVal,
        price: Number(productData.price) || 2500,
        minimumOrderQuantity: Number(productData.moq) || 2,
        stockQuantity: productData.stock !== undefined && productData.stock !== null && !isNaN(Number(productData.stock)) ? Number(productData.stock) : (productData.status ? (productData.status === "active" ? 100 : 0) : 100),
        isAvailable: productData.status ? productData.status === "active" : true,
        isFeatured: Boolean(productData.featured),
        isNew: Boolean(productData.newArrival),
        videoUrl: videoUrlPayload,
        images: productImages,
      });

      if (res && res.product) {
        const adapted = adaptProduct(res.product);
        adminProductsStore.set((prev) => [adapted, ...prev.filter((p) => p.id !== adapted.id)]);
      }
    }
    await syncAdminProducts();
  } catch (err) {
    console.error("Error saving admin product:", err);
    throw err;
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

/** Media must live on Cloudinary; the backend rejects any other URL (including base64 data URLs). */
function isCloudinaryUrl(url: unknown): url is string {
  return typeof url === "string" && /^https:\/\/res\.cloudinary\.com\//i.test(url.trim());
}

export async function saveAdminCategory(categoryData: Partial<Category>) {
  try {
    const nameVal = (categoryData.name || categoryData.name_en || categoryData.name_hi || "Category").trim();
    const descVal = (categoryData.description || categoryData.description_en || categoryData.description_hi || "").trim();
    const slugVal = (categoryData.slug || nameVal)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const rawImageUrl = categoryData.image?.url || (categoryData as any).imageUrl || (categoryData as any).image || undefined;
    const imageUrlVal = isCloudinaryUrl(rawImageUrl) ? rawImageUrl : undefined;
    // Empty strings clear the override so the storefront auto-generates SEO again.
    const seoTitleVal = categoryData.seoTitle?.trim() || null;
    const seoDescriptionVal = categoryData.seoDescription?.trim() || null;

    if (categoryData.id) {
      const rawId = String(categoryData.id).replace(/^cat-/, "");
      await adminApi.categories.update(rawId, {
        name: nameVal,
        name_en: nameVal,
        slug: slugVal,
        description: descVal,
        description_en: descVal,
        imageUrl: imageUrlVal,
        seoTitle: seoTitleVal,
        seoDescription: seoDescriptionVal,
      });
    } else {
      await adminApi.categories.create({
        name: nameVal,
        name_en: nameVal,
        slug: slugVal,
        description: descVal,
        description_en: descVal,
        imageUrl: imageUrlVal,
        seoTitle: seoTitleVal,
        seoDescription: seoDescriptionVal,
      });
    }
    await syncAdminCategories();
  } catch (err) {
    console.error("Error saving admin category:", err);
    throw err;
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

/* 7. Admin Customers Store (Live from Database) -------------------------- */

export interface AdminCustomerRecord {
  id: string;
  dbId: number;
  name: string;
  business: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  type: string;
  isActive: boolean;
  totalOrders: number;
  totalPieces: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
}

function isCustomerList(val: unknown): val is AdminCustomerRecord[] {
  return Array.isArray(val);
}

export const adminCustomersStore = createLocalStore<AdminCustomerRecord[]>({
  key: "ks:admin:customers:v2",
  initialValue: [],
  validate: isCustomerList,
});

export async function syncAdminCustomers() {
  try {
    const res = await adminApi.customers.getAll({ limit: 100 });
    adminCustomersStore.set(res.customers);
    return res.customers;
  } catch (err) {
    console.error("Failed to sync admin customers:", err);
    return adminCustomersStore.getSnapshot();
  }
}

export async function syncAdminData() {
  if (typeof window === "undefined") return;
  await Promise.allSettled([
    syncAdminProducts(),
    syncAdminCategories(),
    syncAdminOrders(),
    syncAdminCustomers(),
  ]);
}

