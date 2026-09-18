"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminOrdersStore, updateOrderStatus, OrderStatusLabel } from "@/lib/admin-stores";
import { formatPieces, formatPrice } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/Icons";

const STATUS_OPTIONS: OrderStatusLabel[] = [
  "New",
  "Confirmed",
  "Processing",
  "Ready",
  "Completed",
  "Cancelled",
];

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return isoString;
  }
}

export default function AdminOrdersPage() {
  const orders = useLocalStore(adminOrdersStore);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredOrders = orders.filter((o) =>
    filterStatus === "all" ? true : o.orderStatus === filterStatus,
  );

  return (
    <AdminLayout title="Wholesale Order Management">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-5">
        <div>
          <h2 className="type-h4 text-ink font-serif">Customer Enquiries ({filteredOrders.length})</h2>
          <p className="text-xs text-muted">Manage stock confirmations, invoice status, and order dispatch workflow.</p>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-none"
        >
          <option value="all">All Order Statuses</option>
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st} Status
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xs border border-line bg-canvas shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas-deep text-xs uppercase tracking-wider text-muted font-semibold">
            <tr>
              <th className="px-4 py-3">Order Number</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Total Qty</th>
              <th className="px-4 py-3">Est. Subtotal</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status Workflow</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-muted">
                  No orders found for the selected filter status.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-canvas-deep/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-ink">{order.orderNumber}</td>
                  <td className="px-4 py-3 font-medium text-ink">{order.customerDetails.fullName}</td>
                  <td className="px-4 py-3 text-muted">{order.customerDetails.businessName}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{formatPieces(order.summary.totalPieces)}</td>
                  <td className="px-4 py-3 text-ink font-semibold">{formatPrice(order.summary.estimatedValue)}</td>
                  <td className="px-4 py-3 text-xs text-muted">{formatDate(order.placedAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus || "New"}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatusLabel)}
                      className="rounded-xs border border-line bg-canvas px-2.5 py-1 text-xs font-bold text-accent focus:border-accent focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {order.whatsappUrl ? (
                      <a
                        href={order.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-xs bg-success/15 px-2.5 py-1 text-xs font-semibold text-success hover:bg-success/25 transition-colors"
                      >
                        <WhatsAppIcon size={14} />
                        WhatsApp
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
