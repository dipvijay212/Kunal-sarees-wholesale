"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminCustomersStore, syncAdminCustomers } from "@/lib/admin-stores";
import { LoadingState } from "@/components/ui/LoadingState";
import { AdminCustomerRecord } from "@/lib/admin-stores";
import type { PlacedOrder } from "@/types";

export interface CustomerProfile {
  id: string;
  name: string;
  business: string;
  whatsapp: string;
  city: string;
  state: string;
  type: string;
  totalOrders: number;
  totalPieces: number;
  totalSpent: number;
  lastOrderDate: string;
}

export function getCustomerProfilesFromOrders(orders: PlacedOrder[]): CustomerProfile[] {
  const map = new Map<string, CustomerProfile>();
  orders.forEach((o) => {
    const key = o.customerDetails?.whatsappNumber || o.customerDetails?.fullName || "Guest";
    const existing = map.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalPieces += o.summary?.totalPieces || 0;
      existing.totalSpent += o.summary?.estimatedValue || 0;
      if (new Date(o.placedAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.placedAt;
      }
    } else {
      map.set(key, {
        id: encodeURIComponent(key),
        name: o.customerDetails?.fullName || "Guest Buyer",
        business: o.customerDetails?.businessName || "-",
        whatsapp: o.customerDetails?.whatsappNumber || "-",
        city: o.customerDetails?.city || "-",
        state: o.customerDetails?.state || "-",
        type: o.customerDetails?.customerType || "Wholesale Buyer",
        totalOrders: 1,
        totalPieces: o.summary?.totalPieces || 0,
        totalSpent: o.summary?.estimatedValue || 0,
        lastOrderDate: o.placedAt || new Date().toISOString(),
      });
    }
  });
  return Array.from(map.values());
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return isoString || "-";
  }
}

export default function AdminCustomersPage() {
  const customers = useLocalStore(adminCustomersStore);
  const [loading, setLoading] = useState(customers.length === 0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    syncAdminCustomers()
      .catch((err) => console.error("Error syncing customers from DB:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCustomers = customers.filter((cust) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      cust.name?.toLowerCase().includes(term) ||
      cust.business?.toLowerCase().includes(term) ||
      cust.phone?.includes(term) ||
      cust.whatsapp?.includes(term) ||
      cust.city?.toLowerCase().includes(term) ||
      cust.email?.toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout title="Customer Directory">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-5">
        <div>
          <h2 className="type-h4 text-ink font-serif">
            Wholesale Buyers & Resellers ({filteredCustomers.length})
          </h2>
          <p className="text-xs text-muted">
            Directory of registered buyers and wholesale clients directly from the database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none w-64"
          />
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              syncAdminCustomers().finally(() => setLoading(false));
            }}
            className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs font-semibold text-ink hover:bg-canvas-deep transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xs border border-line bg-canvas shadow-xs">
        {loading && customers.length === 0 ? (
          <div className="p-8">
            <LoadingState variant="lines" count={3} label="Loading customers from database..." />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas-deep text-xs uppercase tracking-wider text-muted font-semibold">
              <tr>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Business Name</th>
                <th className="px-4 py-3">WhatsApp / Mobile</th>
                <th className="px-4 py-3">City, State</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Total Orders</th>
                <th className="px-4 py-3">Last Order</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-muted">
                    No customers found in database.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-canvas-deep/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-ink">{cust.name}</td>
                    <td className="px-4 py-3 font-medium text-ink">{cust.business}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{cust.whatsapp || cust.phone}</td>
                    <td className="px-4 py-3 text-xs text-ink">{cust.city}, {cust.state}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-xs bg-canvas-deep px-2 py-0.5 text-xs font-semibold text-accent border border-line">
                        {cust.type || "Retailer"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {cust.totalOrders} order{cust.totalOrders === 1 ? "" : "s"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDate(cust.lastOrderDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders?search=${encodeURIComponent(cust.phone || cust.name)}`}
                        className="text-xs font-semibold text-accent hover:underline"
                      >
                        View Orders
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
