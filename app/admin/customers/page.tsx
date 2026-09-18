"use client";

import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminOrdersStore } from "@/lib/admin-stores";
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
    const key = o.customerDetails.whatsappNumber || o.customerDetails.fullName;
    const existing = map.get(key);

    if (existing) {
      existing.totalOrders += 1;
      existing.totalPieces += o.summary.totalPieces;
      existing.totalSpent += o.summary.estimatedValue;
      if (new Date(o.placedAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.placedAt;
      }
    } else {
      map.set(key, {
        id: encodeURIComponent(key),
        name: o.customerDetails.fullName,
        business: o.customerDetails.businessName,
        whatsapp: o.customerDetails.whatsappNumber,
        city: o.customerDetails.city,
        state: o.customerDetails.state,
        type: o.customerDetails.customerType || "Retailer",
        totalOrders: 1,
        totalPieces: o.summary.totalPieces,
        totalSpent: o.summary.estimatedValue,
        lastOrderDate: o.placedAt,
      });
    }
  });

  return Array.from(map.values());
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return isoString;
  }
}

export default function AdminCustomersPage() {
  const orders = useLocalStore(adminOrdersStore);
  const customers = getCustomerProfilesFromOrders(orders);

  return (
    <AdminLayout title="Customer Directory">
      <div className="border-b border-line pb-5">
        <h2 className="type-h4 text-ink font-serif">Wholesale Buyers & Resellers ({customers.length})</h2>
        <p className="text-xs text-muted">Directory of retail buyers, boutique owners, and distributors compiled from enquiries.</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xs border border-line bg-canvas shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas-deep text-xs uppercase tracking-wider text-muted font-semibold">
            <tr>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Business Name</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Customer Type</th>
              <th className="px-4 py-3">Total Orders</th>
              <th className="px-4 py-3">Last Order</th>
              <th className="px-4 py-3 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customers.map((cust) => (
              <tr key={cust.id} className="hover:bg-canvas-deep/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-ink">{cust.name}</td>
                <td className="px-4 py-3 font-medium text-ink">{cust.business}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{cust.whatsapp}</td>
                <td className="px-4 py-3 text-xs text-ink">{cust.city}, {cust.state}</td>
                <td className="px-4 py-3">
                  <span className="rounded-xs bg-canvas-deep px-2 py-0.5 text-xs font-semibold text-accent border border-line">
                    {cust.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-ink">{cust.totalOrders} order(s)</td>
                <td className="px-4 py-3 text-xs text-muted">{formatDate(cust.lastOrderDate)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/customers/${cust.id}`}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
