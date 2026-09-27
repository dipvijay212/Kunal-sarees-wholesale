import { createLocalStore } from './local-store';
import { customerAuthApi, getCustomerStoredToken, setCustomerStoredToken, type BackendCustomer } from './api';

export interface CustomerSession {
  isAuthenticated: boolean;
  token?: string | null;
  customer?: BackendCustomer | null;
}

const EMPTY_CUSTOMER_SESSION: CustomerSession = {
  isAuthenticated: false,
  token: null,
  customer: null,
};

function isCustomerSession(val: unknown): val is CustomerSession {
  if (typeof val !== 'object' || val === null) return false;
  const s = val as Record<string, unknown>;
  return typeof s.isAuthenticated === 'boolean';
}

export const customerAuthStore = createLocalStore<CustomerSession>({
  key: 'ks:customer:session:v1',
  initialValue: EMPTY_CUSTOMER_SESSION,
  validate: isCustomerSession,
});

/**
 * Initializes/synchronizes customer session from token on mount
 */
export async function syncCustomerSession(): Promise<BackendCustomer | null> {
  const token = getCustomerStoredToken();
  if (!token) {
    if (customerAuthStore.getSnapshot().isAuthenticated) {
      customerAuthStore.reset();
    }
    return null;
  }

  try {
    const res = await customerAuthApi.getMe(token);
    if (res && res.customer) {
      customerAuthStore.set({
        isAuthenticated: true,
        token,
        customer: res.customer,
      });
      return res.customer;
    }
    return null;
  } catch (err: unknown) {
    // If token is invalid or expired, reset
    const status = (err as { status?: number })?.status;
    if (status === 401 || status === 403) {
      logoutCustomer();
    }
    return null;
  }
}

/**
 * Sets session directly from API response (e.g. after order checkout creates an account)
 */
export function setCustomerSession(token: string, customer: BackendCustomer) {
  setCustomerStoredToken(token);
  customerAuthStore.set({
    isAuthenticated: true,
    token,
    customer,
  });
}

/**
 * Customer login with mobile number & password
 */
export async function loginCustomer(phone: string, password: string): Promise<{ success: boolean; error?: string; customer?: BackendCustomer }> {
  try {
    const res = await customerAuthApi.login({ phone, password });
    if (res.token && res.customer) {
      setCustomerSession(res.token, res.customer);
      return { success: true, customer: res.customer };
    }
    return { success: false, error: 'Login failed. Please check your credentials.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid mobile number or password.';
    return { success: false, error: errorMsg };
  }
}

/**
 * Customer logout
 */
export function logoutCustomer() {
  customerAuthApi.logout();
  customerAuthStore.reset();
}

/**
 * Update customer profile details
 */
export async function updateCustomerProfile(payload: Partial<BackendCustomer>): Promise<{ success: boolean; error?: string; customer?: BackendCustomer }> {
  try {
    const currentToken = customerAuthStore.getSnapshot().token || getCustomerStoredToken();
    if (!currentToken) {
      return { success: false, error: 'Not authenticated' };
    }
    const res = await customerAuthApi.updateMe(payload, currentToken);
    if (res && res.customer) {
      customerAuthStore.set((prev) => ({
        ...prev,
        customer: res.customer,
      }));
      return { success: true, customer: res.customer };
    }
    return { success: false, error: 'Failed to update profile.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update profile.';
    return { success: false, error: errorMsg };
  }
}
