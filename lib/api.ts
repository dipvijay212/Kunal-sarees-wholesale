/**
 * Centralized API client for Kunal Sarees REST Backend
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

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
  slug: string;
  description: string | null;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCollection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendProduct {
  id: number;
  name: string;
  slug: string;
  productCode: string;
  description: string | null;
  shortDescription: string | null;
  categoryId: number | null;
  category?: { id: number; name: string; slug: string; description?: string };
  fabric: string | null;
  color: string | null;
  price: string | number;
  minimumOrderQuantity: number;
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNew: boolean;
  images?: BackendProductImage[];
  collections?: { id: number; name: string; slug: string; image?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendOrderItem {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  unitPrice: string | number;
  quantity: number;
  subtotal: string | number;
  product?: BackendProduct;
}

export interface BackendOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  businessName: string | null;
  phone: string;
  whatsappNumber: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string | null;
  totalItems: number;
  subtotal: string | number;
  totalAmount: string | number;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'completed' | 'cancelled';
  items?: BackendOrderItem[];
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
    return request<{ collections: BackendCollection[] }>('/collections');
  },

  getBySlug: async (slug: string, params: { sort?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    const qs = query.toString();
    return request<{
      collection: BackendCollection;
      products: BackendProduct[];
      pagination: PaginationMeta;
    }>(`/collections/${encodeURIComponent(slug)}${qs ? `?${qs}` : ''}`);
  },
};

export const ordersApi = {
  create: async (orderPayload: {
    customerName: string;
    businessName?: string;
    phone: string;
    whatsappNumber: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
    items: { productId: number; quantity: number }[];
  }) => {
    return request<{
      orderNumber: string;
      status: string;
      totalItems: number;
      subtotal: number;
      totalAmount: number;
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
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
      collectionIds?: number[];
    }) => {
      return request<{ product: BackendProduct }>('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    },

    update: async (id: number | string, productData: Omit<Partial<BackendProduct>, 'images'> & {
      images?: { imageUrl: string; altText?: string; displayOrder?: number }[];
      collectionIds?: number[];
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
    create: async (data: { name: string; slug: string; description?: string }) => {
      return request<{ category: BackendCategory }>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: number | string, data: { name?: string; slug?: string; description?: string; isActive?: boolean }) => {
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
    create: async (data: { name: string; slug: string; description?: string; image?: string }) => {
      return request<{ collection: BackendCollection }>('/admin/collections', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: number | string, data: { name?: string; slug?: string; description?: string; image?: string; isActive?: boolean }) => {
      return request<{ collection: BackendCollection }>(`/admin/collections/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: number | string) => {
      return request<{ message: string }>(`/admin/collections/${id}`, {
        method: 'DELETE',
      });
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
};
