"use client";

import { useEffect } from "react";
import { useLocalStore } from "./use-local-store";
import {
  customerAuthStore,
  syncCustomerSession,
  loginCustomer,
  logoutCustomer,
  setCustomerSession,
  updateCustomerProfile,
  type CustomerSession,
} from "@/lib/customer-store";

export function useCustomer() {
  const session: CustomerSession = useLocalStore(customerAuthStore);

  useEffect(() => {
    // Attempt profile sync on initial load if token exists
    syncCustomerSession();
  }, []);

  return {
    isAuthenticated: session.isAuthenticated,
    customer: session.customer,
    token: session.token,
    login: loginCustomer,
    logout: logoutCustomer,
    setSession: setCustomerSession,
    updateProfile: updateCustomerProfile,
    refreshSession: syncCustomerSession,
  };
}
