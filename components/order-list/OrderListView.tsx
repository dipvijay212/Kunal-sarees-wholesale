"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowRightIcon, BagIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { useOrderList } from "@/hooks/use-order-list";
import { formatPieces, formatPrice, pluralize } from "@/lib/format";
import { OrderCheckoutModal } from "./OrderCheckoutModal";
import { OrderListLineItem } from "./OrderListLineItem";

export function OrderListView() {
  const { lines, summary, hydrated, updateQuantity, removeItem, clear } = useOrderList();
  const [isClearOpen, setClearOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  if (!hydrated) {
    return <LoadingState variant="lines" count={3} label="Loading your order list" />;
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<BagIcon size={26} />}
        title="Your order list is empty"
        description="Shortlist saree designs with the set quantities you need. Your order list stays saved on this device while you browse."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/products">Continue Shopping</Button>
            <Button href="/collections" variant="secondary">
              View Collections
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Order Items */}
        <section aria-labelledby="order-items-heading" className="min-w-0 lg:col-span-7 xl:col-span-8">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <h2 id="order-items-heading" className="type-eyebrow text-muted">
              Shortlisted Designs ({pluralize(summary.designCount, "design")})
            </h2>
            <button
              type="button"
              onClick={() => setClearOpen(true)}
              className="min-h-10 text-xs font-semibold tracking-[0.14em] text-muted uppercase transition-colors hover:text-danger"
              aria-haspopup="dialog"
            >
              Clear list
            </button>
          </div>

          <ul className="divide-y divide-line">
            {lines.map((line) => (
              <li key={line.product.id}>
                <OrderListLineItem line={line} onQuantityChange={updateQuantity} onRemove={removeItem} />
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-line pt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-muted transition-colors hover:text-ink"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </section>

        {/* Right Column: Order Summary */}
        <aside aria-labelledby="order-summary-heading" className="lg:col-span-5 xl:col-span-4">
          <div className="card card__body lg:top-header lg:sticky">
            <h2 id="order-summary-heading" className="type-h4 text-ink">
              Order Summary
            </h2>

            <dl className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Total Products</dt>
                <dd className="type-price text-ink">{summary.designCount} {summary.designCount === 1 ? "design" : "designs"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Total Quantity</dt>
                <dd className="type-price text-ink">{formatPieces(summary.totalPieces)}</dd>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
                <dt className="field-label">Estimated Subtotal</dt>
                <dd className="type-price text-2xl text-ink">{formatPrice(summary.estimatedValue)}</dd>
              </div>
            </dl>

            <p className="mt-3 text-xs leading-relaxed text-subtle">
              Excludes GST and shipping. Our team confirms availability, final bulk pricing, and dispatch timelines before processing.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                size="lg"
                fullWidth
                onClick={() => setCheckoutOpen(true)}
                trailingIcon={<ArrowRightIcon size={18} />}
              >
                Proceed to Checkout
              </Button>

              <Button href="/products" variant="secondary" fullWidth>
                Continue Shopping
              </Button>
            </div>

            <p className="mt-6 flex items-start gap-3 border-t border-line pt-6 text-xs leading-relaxed text-subtle">
              <ShieldCheckIcon size={18} className="shrink-0 text-accent" />
              No online payment required. Sending your enquiry via WhatsApp does not auto-charge your store.
            </p>
          </div>
        </aside>
      </div>

      {/* Clear List Confirmation Modal */}
      <Modal
        open={isClearOpen}
        onClose={() => setClearOpen(false)}
        title="Clear order list?"
        description="This removes every shortlisted design and set quantity from the list on this device."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setClearOpen(false)}>
              Keep list
            </Button>
            <Button
              onClick={() => {
                clear();
                setClearOpen(false);
              }}
            >
              Clear list
            </Button>
          </>
        }
      />

      {/* B2B Checkout Enquiry Modal */}
      <OrderCheckoutModal
        open={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        lines={lines}
        summary={summary}
      />
    </>
  );
}
