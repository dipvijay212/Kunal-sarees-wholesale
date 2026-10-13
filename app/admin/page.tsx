"use client";

import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminOrdersStore, adminProductsStore, adminCustomersStore } from "@/lib/admin-stores";
import { formatPieces, formatPrice } from "@/lib/format";
import { ArrowRightIcon, BagIcon, ChatIcon, PackageIcon, SparkleIcon } from "@/components/ui/Icons";
import { AdminInstallBanner } from "@/components/admin/AdminInstallBanner";

export default function AdminDashboardPage() {
  const products = useLocalStore(adminProductsStore);
  const orders = useLocalStore(adminOrdersStore);
  const customers = useLocalStore(adminCustomersStore);

  // Derive metrics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;

  const totalOrders = orders.length;
  const recentOrders = orders.slice(0, 5);

  // Live database customer count
  const totalCustomers = Math.max(
    customers.length,
    new Set(orders.map((o) => o.customerDetails.whatsappNumber || o.customerDetails.fullName)).size
  );

  return (
    <AdminLayout title="Dashboard Analytics">
      {/* Visible PWA Install Banner */}
      <AdminInstallBanner />

      {/* Metric Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Orders</span>
            <BagIcon size={18} className="text-accent" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{totalOrders}</p>
          <span className="text-[0.625rem] text-muted">WhatsApp enquiries</span>
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
      <div className="mt-8 rounded-xs border border-line bg-canvas p-4 shadow-xs sm:p-6">
        <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="type-h4 text-ink font-serif">Recent WhatsApp Orders</h2>
            <p className="text-xs text-muted">Latest wholesale order enquiries created by retail buyers</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-accent hover:underline"
          >
            <span>View All Orders</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No orders yet. New WhatsApp enquiries will appear here.</p>
        ) : (
        <>
        {/* Phones: one card per order instead of a sideways-scrolling table */}
        <ul className="mt-4 divide-y divide-line md:hidden">
          {recentOrders.map((order) => (
            <li key={order.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm font-bold text-ink">{order.orderNumber}</span>
                <span className="inline-flex shrink-0 rounded-xs bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                  {order.orderStatus || "New"}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-ink">{order.customerDetails.fullName}</p>
              {order.customerDetails.businessName ? (
                <p className="text-xs text-muted">{order.customerDetails.businessName}</p>
              ) : null}
              <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <span className="text-ink">
                  <span className="font-semibold">{formatPieces(order.summary.totalPieces)}</span>
                  {" · "}
                  {formatPrice(order.summary.estimatedValue)}
                </span>
                <Link href="/admin/orders" className="font-medium text-accent hover:underline">
                  Manage
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 hidden overflow-x-auto md:block">
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
              {recentOrders.map((order) => (
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
        </>
        )}
      </div>
    </AdminLayout>
  );
}
