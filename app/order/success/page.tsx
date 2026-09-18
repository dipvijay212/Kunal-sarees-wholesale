"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BagIcon, CheckIcon, HomeIcon, ShieldCheckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { useLocalStore } from "@/hooks/use-local-store";
import { placedOrdersStore } from "@/lib/stores";
import { formatPieces, formatPrice } from "@/lib/format";
import type { PlacedOrder } from "@/types";

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

function OrderSuccessContent() {
  const orders = useLocalStore(placedOrdersStore);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const order =
    (orderNumber ? orders.find((o: PlacedOrder) => o.orderNumber === orderNumber) : null) ||
    orders[0] ||
    null;

  return (
    <div className="section-y border-b border-line bg-canvas">
      <Container size="narrow">
        <div className="flex flex-col items-center text-center">
          {/* Status Badge Icon */}
          <div className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success ring-8 ring-success/5">
            <CheckIcon size={32} />
          </div>

          <p className="type-eyebrow mt-6 text-accent">Wholesale Order Request</p>
          <h1 className="type-h1 mt-2 text-ink">Order Request Created</h1>

          <p className="mt-2 text-base font-medium text-ink">
            Your wholesale order has been prepared successfully.
          </p>

          {/* Highlight Message Box */}
          <div className="mt-6 w-full max-w-lg rounded-xs border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">WhatsApp Action Required</p>
            <p className="mt-1 text-sm leading-relaxed text-ink font-medium">
              Your order details have been prepared for WhatsApp. Please complete the WhatsApp message to contact Kunal Sarees.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {order?.whatsappUrl ? (
              <Button
                href={order.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                leadingIcon={<WhatsAppIcon size={20} />}
              >
                Send Order on WhatsApp
              </Button>
            ) : null}

            <Button href="/products" variant="secondary" size="lg" leadingIcon={<BagIcon size={18} />}>
              Continue Shopping
            </Button>

            {order ? (
              <Button href="#order-details" variant="secondary" size="lg">
                View Order
              </Button>
            ) : null}

            <Button href="/" variant="ghost" size="lg" leadingIcon={<HomeIcon size={18} />}>
              Back to Home
            </Button>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {order ? (
          <div id="order-details" className="mt-12 rounded-xs border border-line bg-canvas p-6 shadow-xs sm:p-8">
            <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="type-h4 text-ink">Order Request Summary</h2>
                <p className="text-xs text-muted">Reference code for your WhatsApp wholesale enquiry</p>
              </div>
              <span className="self-start rounded-xs border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent sm:self-auto">
                Enquiry Sent to WhatsApp
              </span>
            </div>

            {/* Grid of Key Info */}
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">Order Number</dt>
                <dd className="mt-1 font-mono text-base font-bold text-ink">{order.orderNumber}</dd>
              </div>

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">Customer Name</dt>
                <dd className="mt-1 font-semibold text-ink">{order.customerDetails.fullName}</dd>
              </div>

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">Business Name</dt>
                <dd className="mt-1 font-semibold text-ink">{order.customerDetails.businessName}</dd>
              </div>

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">Total Products</dt>
                <dd className="mt-1 font-semibold text-ink">{order.summary.designCount} Saree Designs</dd>
              </div>

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">Total Quantity</dt>
                <dd className="mt-1 font-semibold text-ink">{formatPieces(order.summary.totalPieces)}</dd>
              </div>

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">Date & Time</dt>
                <dd className="mt-1 font-medium text-ink">{formatDate(order.placedAt)}</dd>
              </div>
            </dl>

            {/* Itemized Order List */}
            <div className="mt-8 border-t border-line pt-6">
              <h3 className="type-h4 text-ink">Shortlisted Saree Designs ({order.items.length})</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-ink">{item.productName}</p>
                      <p className="text-xs font-mono text-muted">Code: {item.productCode}</p>

                      {item.selectedColors ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(item.selectedColors)
                            .filter(([, q]) => q > 0)
                            .map(([color, q]) => (
                              <span key={color} className="rounded-xs border border-line bg-canvas-deep px-1.5 py-0.5 text-[0.625rem] text-muted">
                                {color}: <strong className="text-ink">{q} pcs</strong>
                              </span>
                            ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="text-right sm:self-center">
                      <p className="font-semibold text-ink">{formatPieces(item.quantity)}</p>
                      <p className="text-xs text-muted">{formatPrice(item.lineTotal)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between text-base font-bold">
                <span className="text-ink">Estimated Wholesale Value</span>
                <span className="type-price text-xl text-ink">{formatPrice(order.summary.estimatedValue)}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-10 text-center">
          <p className="flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheckIcon size={16} className="text-accent" />
            No online payment taken. Order details are sent directly to WhatsApp for B2B pricing and dispatch confirmation.
          </p>
        </div>
      </Container>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingState variant="lines" count={4} label="Loading order request details" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
