"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminOrdersStore } from "@/lib/admin-stores";
import { formatPieces, formatPrice } from "@/lib/format";
import { ArrowLeftIcon, WhatsAppIcon } from "@/components/ui/Icons";

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const rawId = params?.id as string;
  const decodedId = rawId ? decodeURIComponent(rawId) : "";

  const orders = useLocalStore(adminOrdersStore);

  // Filter orders for this customer
  const customerOrders = orders.filter(
    (o) =>
      (o.customerDetails.whatsappNumber || o.customerDetails.fullName) === decodedId ||
      o.customerDetails.fullName === decodedId,
  );

  const profile = customerOrders[0]?.customerDetails;

  const totalPieces = customerOrders.reduce((sum, o) => sum + o.summary.totalPieces, 0);
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.summary.estimatedValue, 0);

  return (
    <AdminLayout title="Customer Profile & Order History">
      <div className="mb-4">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          <ArrowLeftIcon size={14} />
          Back to Customer Directory
        </Link>
      </div>

      {profile ? (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Profile Card */}
          <div className="lg:col-span-4 rounded-xs border border-line bg-canvas p-6 shadow-xs">
            <div className="border-b border-line pb-4">
              <h2 className="type-h3 font-serif text-ink">{profile.fullName}</h2>
              <p className="text-sm font-semibold text-accent mt-0.5">{profile.businessName}</p>
              <span className="mt-2 inline-block rounded-xs bg-canvas-deep border border-line px-2 py-0.5 text-xs font-semibold text-muted">
                {profile.customerType || "Retailer"}
              </span>
            </div>

            <dl className="mt-4 space-y-3 text-xs">
              <div>
                <dt className="text-muted">WhatsApp Number</dt>
                <dd className="font-mono text-sm font-semibold text-ink">{profile.whatsappNumber}</dd>
              </div>
              <div>
                <dt className="text-muted">Mobile Contact</dt>
                <dd className="font-mono text-sm font-semibold text-ink">{profile.mobileNumber}</dd>
              </div>
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="font-semibold text-ink">
                  {profile.city}, {profile.state} ({profile.pincode})
                </dd>
              </div>
              <div>
                <dt className="text-muted">Delivery Address</dt>
                <dd className="text-ink">{profile.fullAddress}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-line pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Total Orders Placed:</span>
                <strong className="text-ink">{customerOrders.length}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Total Saree Quantity:</span>
                <strong className="text-ink">{formatPieces(totalPieces)}</strong>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-ink">Total Order Value:</span>
                <span className="text-accent">{formatPrice(totalSpent)}</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xs bg-success px-4 py-2.5 text-xs font-bold text-white hover:bg-success/90 transition-colors"
              >
                <WhatsAppIcon size={16} />
                Contact Buyer on WhatsApp
              </a>
            </div>
          </div>

          {/* Customer Order History */}
          <div className="lg:col-span-8 rounded-xs border border-line bg-canvas p-6 shadow-xs">
            <h2 className="type-h4 text-ink font-serif border-b border-line pb-3">
              Order History ({customerOrders.length})
            </h2>

            <div className="mt-4 divide-y divide-line">
              {customerOrders.map((order) => (
                <div key={order.id} className="py-4 space-y-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-mono font-bold text-sm text-ink">{order.orderNumber}</span>
                      <span className="ml-3 text-xs text-muted">{formatDate(order.placedAt)}</span>
                    </div>
                    <span className="rounded-xs bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                      Status: {order.orderStatus || "New"}
                    </span>
                  </div>

                  {/* Items summary */}
                  <ul className="divide-y divide-line/50 border-y border-line/50 text-xs">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between py-2">
                        <div>
                          <p className="font-semibold text-ink">{item.productName}</p>
                          <p className="font-mono text-[0.625rem] text-muted">Code: {item.productCode}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-ink">{formatPieces(item.quantity)}</p>
                          <p className="text-[0.625rem] text-muted">{formatPrice(item.lineTotal)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Order Total ({formatPieces(order.summary.totalPieces)})</span>
                    <span className="text-ink">{formatPrice(order.summary.estimatedValue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xs border border-line bg-canvas p-8 text-center text-muted">
          Customer record not found.
        </div>
      )}
    </AdminLayout>
  );
}
