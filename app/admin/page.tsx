"use client";

import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminOrdersStore, adminProductsStore } from "@/lib/admin-stores";
import { formatPieces, formatPrice } from "@/lib/format";
import { ArrowRightIcon, BagIcon, ChatIcon, PackageIcon, SparkleIcon } from "@/components/ui/Icons";

export default function AdminDashboardPage() {
  const products = useLocalStore(adminProductsStore);
  const orders = useLocalStore(adminOrdersStore);

  // Derive metrics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter((p) => p.stock < 15).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "New" || o.orderStatus === "Confirmed").length;

  // Extract unique customers
  const uniqueCustomers = Array.from(
    new Set(orders.map((o) => o.customerDetails.whatsappNumber || o.customerDetails.fullName)),
  );
  const totalCustomers = uniqueCustomers.length;

  return (
    <AdminLayout title="Dashboard Analytics">
      {/* Metric Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xs border border-line bg-canvas p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Products</span>
            <PackageIcon size={18} className="text-accent" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{totalProducts}</p>
          <span className="text-[0.625rem] text-muted">All catalog designs</span>
        </div>

        <div className="rounded-xs border border-line bg-canvas p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Active Products</span>
            <SparkleIcon size={18} className="text-success" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{activeProducts}</p>
          <span className="text-[0.625rem] text-success font-medium">Visible on storefront</span>
        </div>

        <div className="rounded-xs border border-line bg-canvas p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Low Stock</span>
            <span className="flex size-2 rounded-full bg-alert"></span>
          </div>
          <p className="mt-2 text-2xl font-bold text-alert">{lowStockProducts}</p>
          <span className="text-[0.625rem] text-alert font-medium">&lt; 15 pcs available</span>
        </div>

        <div className="rounded-xs border border-line bg-canvas p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Orders</span>
            <BagIcon size={18} className="text-accent" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{totalOrders}</p>
          <span className="text-[0.625rem] text-muted">WhatsApp enquiries</span>
        </div>

        <div className="rounded-xs border border-line bg-canvas p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Pending Orders</span>
            <span className="flex size-2 rounded-full bg-amber-500"></span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{pendingOrders}</p>
          <span className="text-[0.625rem] font-medium text-amber-600">Needs confirmation</span>
        </div>

        <div className="rounded-xs border border-line bg-canvas p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Customers</span>
            <ChatIcon size={18} className="text-accent" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{totalCustomers}</p>
          <span className="text-[0.625rem] text-muted">Wholesale buyers</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="mt-8 rounded-xs border border-line bg-canvas p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="type-h4 text-ink font-serif">Recent WhatsApp Orders</h2>
            <p className="text-xs text-muted">Latest wholesale order enquiries created by retail buyers</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
          >
            <span>View All Orders</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas-deep text-xs uppercase tracking-wider text-muted font-semibold">
              <tr>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Est. Value</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-canvas-deep/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-ink">{order.orderNumber}</td>
                  <td className="px-4 py-3 font-medium text-ink">{order.customerDetails.fullName}</td>
                  <td className="px-4 py-3 text-muted">{order.customerDetails.businessName}</td>
                  <td className="px-4 py-3 text-ink font-semibold">{formatPieces(order.summary.totalPieces)}</td>
                  <td className="px-4 py-3 text-ink">{formatPrice(order.summary.estimatedValue)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-xs bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                      {order.orderStatus || "New"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href="/admin/orders"
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
