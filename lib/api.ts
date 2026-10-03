/**
 * Centralized API client for Kunal Sarees REST Backend
 */

const CONFIGURED_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace(/\/+$/, '');

const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

/**
 * A backend on localhost can't be reached by a browser that opened the site through a
 * forwarded port, tunnel or another device. There, go through the same-origin
 * /backend-api rewrite (see next.config.ts) instead.
 */
function resolveApiBase(): string {
  if (typeof window === 'undefined') return CONFIGURED_API_BASE;
  if (LOOPBACK_HOSTS.includes(window.location.hostname)) return CONFIGURED_API_BASE;
  try {
    if (LOOPBACK_HOSTS.includes(new URL(CONFIGURED_API_BASE).hostname)) return '/backend-api';
  } catch {
    // not an absolute URL — use it as configured
  }
  return CONFIGURED_API_BASE;
}

const API_BASE = resolveApiBase();

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BackendProductImage {
  id: number;
  imageUrl: string;
  altText: string;
  displayOrder: number;
}

export interface BackendCategory {
  id: number;
  name: string;
  name_en?: string | null;
  nameEn?: string | null;
  name_hi?: string | null;
  nameHi?: string | null;
  slug: string;
  description: string | null;
  description_en?: string | null;
  descriptionEn?: string | null;
  description_hi?: string | null;
  descriptionHi?: string | null;
  productCount?: number;
  image?: string | null;
  imageUrl?: string | null;
  /** Optional admin SEO overrides (null = auto-generate). */
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCollection {
  id: number;
  name: string;
  name_en?: string | null;
  nameEn?: string | null;
  name_hi?: string | null;
  nameHi?: string | null;
  slug: string;
  description: string | null;
  description_en?: string | null;
  descriptionEn?: string | null;
  description_hi?: string | null;
  descriptionHi?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendProduct {
  id: number;
  name: string;
  name_en?: string | null;
  nameEn?: string | null;
  name_hi?: string | null;
  nameHi?: string | null;
  slug: string;
  productCode: string;
  description: string | null;
  description_en?: string | null;
  descriptionEn?: string | null;
  description_hi?: string | null;
  descriptionHi?: string | null;
  shortDescription: string | null;
  short_description_en?: string | null;
  shortDescriptionEn?: string | null;
  short_description_hi?: string | null;
  shortDescriptionHi?: string | null;
  categoryId: number | null;
  category?: {
    id: number;
    name: string;
    name_en?: string | null;
    nameEn?: string | null;
    name_hi?: string | null;
    nameHi?: string | null;
    slug: string;
    description?: string | null;
    description_en?: string | null;
    descriptionEn?: string | null;
    description_hi?: string | null;
    descriptionHi?: string | null;
  };
  fabric: string | null;
  fabric_en?: string | null;
  fabricEn?: string | null;
  fabric_hi?: string | null;
  fabricHi?: string | null;
  color: string | null;
  color_en?: string | null;
  colorEn?: string | null;
  color_hi?: string | null;
  colorHi?: string | null;
  price: string | number;
  minimumOrderQuantity: number;
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNew: boolean;
  videoUrl?: string | null;
  video_url?: string | null;
  videoUrls?: string[] | null;
  images?: BackendProductImage[];
  collections?: { id: number; name: string; slug: string; image?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendOrderItem {
  id: number;
  orderId?: number;
  productId: number | null;
  productName: string;
  productNameEn?: string | null;
  productNameHi?: string | null;
  productCode: string;
  unitPrice: string | number;
  quantity: number;
  subtotal: string | number;
  product?: BackendProduct | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendOrder {
  id: number;
  orderNumber: string;
  customerId?: number | null;
  customerName?: string;
  businessName?: string | null;
  phone?: string;
  whatsappNumber?: string | null;
  email?: string | null;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  customerNameSnapshot?: string;
  businessNameSnapshot?: string | null;
  phoneSnapshot?: string;
  whatsappNumberSnapshot?: string | null;
  emailSnapshot?: string | null;
  addressSnapshot?: string;
  citySnapshot?: string;
  stateSnapshot?: string;
  pincodeSnapshot?: string;
  notes?: string | null;
  totalItems: number;
  subtotal: string | number;
  totalAmount: string | number;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'completed' | 'cancelled';
  items?: BackendOrderItem[];
  customer?: BackendCustomer | null;
  createdAt: string;
  updatedAt: string;
}


export interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('ks:admin:jwt:v1') || null;
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem('ks:admin:jwt:v1', token);
    } else {
      localStorage.removeItem('ks:admin:jwt:v1');
    }
  } catch (err) {
    console.error('Error setting auth token', err);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  // Cache public catalogue reads on the server so page navigations don't re-hit the backend every time.
  // Admin edits appear on the storefront within this window.
  const isPublicServerGet =
    typeof window === 'undefined' &&
    (!options.method || options.method === 'GET') &&
    !headers.has('Authorization') &&
    !endpoint.startsWith('/admin');
  if (isPublicServerGet && options.cache === undefined) {
    fetchOptions.next = { revalidate: 30 };
  }

  const res = await fetch(url, fetchOptions);

  const json: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    message: `Server returned invalid JSON (${res.status})`,
    data: {} as T,
  }));

  if (!res.ok || !json.success) {
    const errorMsg = json.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return json.data;
}

/* ========================================================================== */
/* Auth API                                                                   */
/* ========================================================================== */

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const data = await request<{ user: BackendUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  getMe: async () => {
    return request<{ user: BackendUser }>('/auth/me');
  },

  forgotPassword: async (email: string) => {
    return request<{ email?: string; maskedEmail?: string; message?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyResetToken: async (token: string) => {
    return request<{ valid: boolean; email?: string }>('/auth/verify-reset-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  resetPassword: async (payload: { token: string; password: string; confirmPassword?: string }) => {
    return request<{ message?: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout: () => {
    setStoredToken(null);
  },
};

/* ========================================================================== */
/* Public Catalog APIs                                                        */
/* ========================================================================== */

export const productsApi = {
  getAll: async (params: {
    search?: string;
    category?: string | number;
    collection?: string | number;
    fabric?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    const qs = query.toString();
    return request<{ products: BackendProduct[]; pagination: PaginationMeta }>(
      `/products${qs ? `?${qs}` : ''}`
    );
  },

  getBySlug: async (slug: string) => {
    return request<{ product: BackendProduct }>(`/products/${encodeURIComponent(slug)}`);
  },
};

export const categoriesApi = {
  getAll: async () => {
    return request<{ categories: BackendCategory[] }>('/categories');
  },
};

export const collectionsApi = {
  getAll: async () => {
    return { collections: [] as BackendCollection[] };
  },

  getBySlug: async (_slug: string) => {
    return {
      collection: { id: 0, name: '', slug: '', description: null, image: null } as BackendCollection,
      products: [] as BackendProduct[],
      pagination: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 12, hasNextPage: false, hasPrevPage: false },
    };
  },
};

export interface BackendCustomer {
  id: number;
  name: string;
  businessName: string | null;
  phone: string;
  whatsappNumber: string | null;
  email: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


export function getCustomerStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('ks:customer:jwt:v1');
  } catch {
    return null;
  }
}

export function setCustomerStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem('ks:customer:jwt:v1', token);
    } else {
      localStorage.removeItem('ks:customer:jwt:v1');
    }
  } catch (err) {
    console.error('Error setting customer auth token', err);
  }
}

export const customerAuthApi = {
  login: async (credentials: { phone: string; password: string }) => {
    const data = await request<{ customer: BackendCustomer; token: string }>('/customer/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setCustomerStoredToken(data.token);
    }
    return data;
  },

  register: async (payload: {
    name: string;
    businessName?: string;
    phone: string;
    whatsappNumber?: string;
    email?: string;
    password: string;
    confirmPassword?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    const data = await request<{ customer: BackendCustomer; token: string }>('/customer/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data.token) {
      setCustomerStoredToken(data.token);
    }
    return data;
  },

  getMe: async (token?: string) => {
    const headers: Record<string, string> = {};
    const effectiveToken = token || getCustomerStoredToken();
    if (effectiveToken) {
      headers['Authorization'] = `Bearer ${effectiveToken}`;
    }
    return request<{ customer: BackendCustomer }>('/customer/me', { headers });
  },

  updateMe: async (payload: Partial<BackendCustomer>, token?: string) => {
    const headers: Record<string, string> = {};
    const effectiveToken = token || getCustomerStoredToken();
    if (effectiveToken) {
      headers['Authorization'] = `Bearer ${effectiveToken}`;
    }
    return request<{ customer: BackendCustomer }>('/customer/me', {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
  },

  forgotPassword: async (email: string) => {
    return request<{ email?: string; maskedEmail?: string; message?: string }>('/customer/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyResetToken: async (token: string) => {
    return request<{ valid: boolean; email?: string }>('/customer/auth/verify-reset-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  resetPassword: async (payload: { token: string; password: string; confirmPassword?: string }) => {
    return request<{ message?: string }>('/customer/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout: () => {
    setCustomerStoredToken(null);
  },
};

export const customerOrdersApi = {
  getAll: async (params: { page?: number; limit?: number } = {}, token?: string) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    const qs = query.toString();

    const headers: Record<string, string> = {};
    const effectiveToken = token || getCustomerStoredToken();
    if (effectiveToken) {
      headers['Authorization'] = `Bearer ${effectiveToken}`;
    }

    return request<{ orders: BackendOrder[]; pagination: PaginationMeta }>(
      `/customer/orders${qs ? `?${qs}` : ''}`,
      { headers }
    );
  },

  getById: async (id: string | number, token?: string) => {
    const headers: Record<string, string> = {};
    const effectiveToken = token || getCustomerStoredToken();
    if (effectiveToken) {
      headers['Authorization'] = `Bearer ${effectiveToken}`;
    }

    return request<{ order: BackendOrder }>(`/customer/orders/${id}`, { headers });
  },
};

export const ordersApi = {
  create: async (
    orderPayload: {
      customerName: string;
      businessName?: string;
      phone: string;
      whatsappNumber?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      address: string;
      city?: string;
      state?: string;
      pincode?: string;
      notes?: string;
      items: { productId: number; quantity: number }[];
    },
    token?: string
  ) => {
    const headers: Record<string, string> = {};
    const effectiveToken = token || getCustomerStoredToken();
    if (effectiveToken) {
      headers['Authorization'] = `Bearer ${effectiveToken}`;
    }

    return request<{
      orderNumber: string;
      status: string;
      totalItems: number;
      subtotal: number;
      totalAmount: number;
      customer?: BackendCustomer;
      token?: string;
    }>('/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload),
    });
  },
};

/** Business contact details saved in Admin → Settings (see backend setting.controller.js). */
export interface StoredBusinessSettings {
  businessName: string | null;
  contact: {
    whatsappNumber: string | null;
    phoneDisplay: string | null;
    email: string | null;
    address: { lines: string[]; city: string; region: string; postalCode: string; country: string };
    hours: { days: string; hours: string }[];
  };
  social: { platform: 'instagram' | 'facebook' | 'youtube'; label: string; href: string }[];
  storefrontImages?: {
    heroImage?: string | null;
    wholesaleBannerImage?: string | null;
    whyChooseUsImage?: string | null;
  } | null;
}

export const settingsApi = {
  getBusiness: async () => {
    return request<{ businessSettings: StoredBusinessSettings | null }>('/settings/business', {
      cache: 'no-store',
    });
  },

  getLanguage: async () => {
    return request<{
      defaultLanguage: 'hi' | 'en';
      availableLanguages: ('hi' | 'en')[];
      allowCustomerLanguageSwitch: boolean;
    }>('/settings/language');
  },
};

/* ========================================================================== */
/* Admin APIs                                                                 */
/* ========================================================================== */

export const adminApi = {
  products: {
    getAll: async (params: {
      search?: string;
      category?: string | number;
      isAvailable?: boolean;
      sort?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
      const qs = query.toString();
      return request<{ products: BackendProduct[]; pagination: PaginationMeta }>(
        `/admin/products${qs ? `?${qs}` : ''}`
      );
    },

    getById: async (id: number | string) => {
      return request<{ product: BackendProduct }>(`/admin/products/${id}`);
    },

    create: async (productData: Omit<Partial<BackendProduct>, 'images'> & {
      name: string;
      productCode: string;
      slug: string;
      price: number;
      images?: { imageUrl: string; altText?: string; displayOrder?: number }[];
    }) => {
      return request<{ product: BackendProduct }>('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    },

    update: async (id: number | string, productData: Omit<Partial<BackendProduct>, 'images'> & {
      images?: { imageUrl: string; altText?: string; displayOrder?: number }[];
    }) => {
      return request<{ product: BackendProduct }>(`/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(productData),
      });
    },

    delete: async (id: number | string) => {
      return request<{ message: string }>(`/admin/products/${id}`, {
        method: 'DELETE',
      });
    },
  },

  categories: {
    create: async (data: {
      name: string;
      name_en?: string;
      name_hi?: string;
      slug: string;
      description?: string;
      description_en?: string;
      description_hi?: string;
      imageUrl?: string | null;
      image?: string | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
    }) => {
      return request<{ category: BackendCategory }>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (
      id: number | string,
      data: {
        name?: string;
        name_en?: string;
        name_hi?: string;
        slug?: string;
        description?: string;
        description_en?: string;
        description_hi?: string;
        isActive?: boolean;
        imageUrl?: string | null;
        image?: string | null;
        seoTitle?: string | null;
        seoDescription?: string | null;
      }
    ) => {
      return request<{ category: BackendCategory }>(`/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: number | string) => {
      return request<{ message: string }>(`/admin/categories/${id}`, {
        method: 'DELETE',
      });
    },
  },

  collections: {
    create: async (_data: { name: string; slug: string; description?: string; image?: string }) => {
      return { collection: { id: 0, name: '', slug: '', description: null, image: null } as BackendCollection };
    },

    update: async (_id: number | string, _data: { name?: string; slug?: string; description?: string; image?: string; isActive?: boolean }) => {
      return { collection: { id: 0, name: '', slug: '', description: null, image: null } as BackendCollection };
    },

    delete: async (_id: number | string) => {
      return { message: 'Deleted' };
    },
  },

  orders: {
    getAll: async (params: {
      status?: string;
      search?: string;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
      const qs = query.toString();
      return request<{ orders: BackendOrder[]; pagination: PaginationMeta }>(
        `/admin/orders${qs ? `?${qs}` : ''}`
      );
    },

    getById: async (id: number | string) => {
      return request<{ order: BackendOrder }>(`/admin/orders/${id}`);
    },

    updateStatus: async (id: number | string, status: string) => {
      return request<{ order: BackendOrder }>(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },

  customers: {
    getAll: async (params: {
      search?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
      const qs = query.toString();
      return request<{
        customers: {
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
        }[];
        pagination: PaginationMeta;
      }>(`/admin/customers${qs ? `?${qs}` : ''}`);
    },

    getById: async (id: number | string) => {
      return request<{ customer: unknown }>(`/admin/customers/${id}`);
    },
  },

  settings: {
    getLanguage: async () => {
      return request<{
        id: number;
        defaultLanguage: 'hi' | 'en';
        availableLanguages: ('hi' | 'en')[];
        allowCustomerLanguageSwitch: boolean;
        updatedAt?: string;
      }>('/admin/settings/language');
    },

    updateLanguage: async (data: {
      defaultLanguage?: 'hi' | 'en';
      availableLanguages?: ('hi' | 'en')[];
      allowCustomerLanguageSwitch?: boolean;
    }) => {
      return request<{
        id: number;
        defaultLanguage: 'hi' | 'en';
        availableLanguages: ('hi' | 'en')[];
        allowCustomerLanguageSwitch: boolean;
        updatedAt?: string;
      }>('/admin/settings/language', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    updateBusiness: async (data: StoredBusinessSettings) => {
      return request<{ businessSettings: StoredBusinessSettings }>('/admin/settings/business', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
  },

  media: {
    uploadImages: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });
      return request<{
        urls: string[];
        images: { url: string; publicId: string; width: number; height: number; format: string; bytes: number }[];
      }>('/admin/upload/images', {
        method: 'POST',
        body: formData,
      });
    },

    uploadVideo: async (file: File) => {
      const formData = new FormData();
      formData.append('video', file);
      return request<{
        url: string;
        publicId: string;
        duration?: number;
        format?: string;
        bytes?: number;
      }>('/admin/upload/video', {
        method: 'POST',
        body: formData,
      });
    },

    uploadVideos: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('videos', file);
      });
      return request<{
        urls: string[];
        videos: { url: string; publicId: string; duration?: number; format?: string; bytes?: number }[];
      }>('/admin/upload/videos', {
        method: 'POST',
        body: formData,
      });
    },

    deleteMedia: async (publicId: string, resourceType: 'image' | 'video' = 'image') => {
      return request<{ result: unknown }>('/admin/upload/media', {
        method: 'DELETE',
        body: JSON.stringify({ publicId, resourceType }),
      });
    },
  },
};

