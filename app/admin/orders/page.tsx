"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminOrdersStore, syncAdminOrders, updateOrderStatus, OrderStatusLabel } from "@/lib/admin-stores";
import { formatPieces, formatPrice } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";

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
    return isoString || "-";
  }
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const orders = useLocalStore(adminOrdersStore);
  const [loading, setLoading] = useState(orders.length === 0);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    let isMounted = true;
    syncAdminOrders()
      .catch((err) => console.error("Error syncing orders from DB:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "all" ? true : o.orderStatus === filterStatus;
    if (!matchesStatus) return false;
    if (!search.trim()) return true;

    const term = search.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(term) ||
      o.customerDetails?.fullName?.toLowerCase().includes(term) ||
      o.customerDetails?.businessName?.toLowerCase().includes(term) ||
      o.customerDetails?.whatsappNumber?.includes(term) ||
      o.customerDetails?.city?.toLowerCase().includes(term)
    );
  });

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleStatusChange = async (orderId: string, orderNumber: string, newStatus: OrderStatusLabel) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res?.success) {
        setStatusFeedback({
          type: "success",
          message: `✓ Order ${orderNumber} status updated to "${newStatus}" and saved to database.`,
        });
        setTimeout(() => setStatusFeedback(null), 4000);
      } else {
        setStatusFeedback({
          type: "error",
          message: `⚠ Failed to update status for order ${orderNumber}: ${res?.error || "Error"}`,
        });
        setTimeout(() => setStatusFeedback(null), 5000);
      }
    } catch (err: any) {
      setStatusFeedback({
        type: "error",
        message: `⚠ Failed to update status: ${err?.message || "Unknown error"}`,
      });
      setTimeout(() => setStatusFeedback(null), 5000);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <AdminLayout title="Wholesale Order Management">
      {statusFeedback ? (
        <div
          className={`mb-4 rounded-xs border p-3 text-xs font-semibold animate-in fade-in flex items-center justify-between gap-3 ${
            statusFeedback.type === "success"
              ? "border-success/40 bg-success/10 text-success"
              : "border-danger/40 bg-danger/10 text-danger"
          }`}
        >
          <span>{statusFeedback.message}</span>
          <button
            type="button"
            onClick={() => setStatusFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-5">
        <div>
          <h2 className="type-h4 text-ink font-serif">Customer Enquiries ({filteredOrders.length})</h2>
          <p className="text-xs text-muted">Manage stock confirmations, invoice status, and order dispatch workflow directly from database.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none w-48"
          />

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

          {/* Refresh */}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              syncAdminOrders().finally(() => setLoading(false));
            }}
            className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs font-semibold text-ink hover:bg-canvas-deep transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xs border border-line bg-canvas shadow-xs">
        {loading && orders.length === 0 ? (
          <div className="p-8">
            <LoadingState variant="lines" count={3} label="Loading orders from database..." />
          </div>
        ) : (
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
                    No orders found matching the criteria in database.
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
                      <div className="flex items-center gap-1.5">
                        <select
                          disabled={updatingOrderId === order.id}
                          value={order.orderStatus || "New"}
                          onChange={(e) => handleStatusChange(order.id, order.orderNumber, e.target.value as OrderStatusLabel)}
                          className={`rounded-xs border px-2.5 py-1 text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                            updatingOrderId === order.id ? "opacity-50 pointer-events-none" : ""
                          } ${
                            order.orderStatus === "Completed"
                              ? "border-success/40 bg-success/10 text-success"
                              : order.orderStatus === "Cancelled"
                              ? "border-danger/40 bg-danger/10 text-danger"
                              : order.orderStatus === "Confirmed"
                              ? "border-maroon/40 bg-accent-soft text-maroon"
                              : order.orderStatus === "Processing" || order.orderStatus === "Ready"
                              ? "border-gold/50 bg-gold/10 text-gold-dark"
                              : "border-line bg-canvas text-accent"
                          }`}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st} className="bg-canvas text-ink font-medium">
                              {st}
                            </option>
                          ))}
                        </select>
                        {updatingOrderId === order.id ? (
                          <span className="text-[0.625rem] text-muted animate-pulse font-medium">Saving...</span>
                        ) : null}
                      </div>
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
        )}
      </div>
    </AdminLayout>
  );
}
