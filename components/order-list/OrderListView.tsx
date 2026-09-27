"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowRightIcon, BagIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { useOrderList } from "@/hooks/use-order-list";
import { formatPieces, formatPrice } from "@/lib/format";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { OrderCheckoutModal } from "./OrderCheckoutModal";
import { OrderListLineItem } from "./OrderListLineItem";

export function OrderListView() {
  const { lines, summary, hydrated, updateQuantity, removeItem, clear } = useOrderList();
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  const [isClearOpen, setClearOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  if (!hydrated) {
    return <LoadingState variant="lines" count={3} label={t.loading.default} />;
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<BagIcon size={26} />}
        title={t.orderList.emptyTitle}
        description={t.orderList.emptySubtitle}
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/products">{t.products.viewAllFull}</Button>
            <Button href="/collections" variant="secondary">
              {isHi ? "कलेक्शन देखें" : "View Collections"}
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
              {isHi ? `चुनी हुई साड़ियां (${summary.designCount})` : `Selected Sarees (${summary.designCount})`}
            </h2>
            <button
              type="button"
              onClick={() => setClearOpen(true)}
              className="min-h-10 text-xs font-semibold tracking-[0.14em] text-muted uppercase transition-colors hover:text-danger"
              aria-haspopup="dialog"
            >
              {t.orderList.clearList}
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
              &larr; {isHi ? "और साड़ियां देखें" : "Browse More Sarees"}
            </Link>
          </div>
        </section>

        {/* Right Column: Order Summary */}
        <aside aria-labelledby="order-summary-heading" className="lg:col-span-5 xl:col-span-4">
          <div className="card card__body lg:top-header lg:sticky">
            <h2 id="order-summary-heading" className="type-h4 text-ink">
              {t.checkout.orderSummary}
            </h2>

            <dl className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t.checkout.totalDesigns}</dt>
                <dd className="type-price text-ink">
                  {summary.designCount} {isHi ? "प्रकार" : "designs"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t.checkout.totalQuantity}</dt>
                <dd className="type-price text-ink">{formatPieces(summary.totalPieces)}</dd>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
                <dt className="field-label">{t.checkout.totalAmount}</dt>
                <dd className="type-price text-2xl text-ink">{formatPrice(summary.estimatedValue)}</dd>
              </div>
            </dl>

            <p className="mt-3 text-xs leading-relaxed text-subtle">
              {isHi
                ? "GST और डिलीवरी चार्ज अलग से। हमारी टीम उपलब्धता और डिलीवरी समय की पुष्टि करेगी।"
                : "GST & transport calculated separately upon order confirmation via WhatsApp."}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                href="/checkout"
                size="lg"
                fullWidth
                trailingIcon={<ArrowRightIcon size={18} />}
              >
                {t.orderList.proceedToCheckout}
              </Button>

              <Button href="/products" variant="secondary" fullWidth>
                {t.products.viewAllFull}
              </Button>
            </div>

            <p className="mt-6 flex items-start gap-3 border-t border-line pt-6 text-xs leading-relaxed text-subtle">
              <ShieldCheckIcon size={18} className="shrink-0 text-accent" />
              {isHi
                ? "ऑनलाइन पेमेंट की तुरंत जरूरत नहीं। WhatsApp पर संपर्क करके ऑर्डर कन्फर्म करें।"
                : "No instant online payment. Direct confirmation and wholesale invoice via WhatsApp."}
            </p>
          </div>
        </aside>
      </div>

      {/* Clear List Confirmation Modal */}
      <Modal
        open={isClearOpen}
        onClose={() => setClearOpen(false)}
        title={isHi ? "क्या आप ऑर्डर लिस्ट खाली करना चाहते हैं?" : "Clear your order list?"}
        description={
          isHi
            ? "इससे इस डिवाइस पर चुनी गई सभी साड़ियां और मात्राएं हट जाएंगी।"
            : "This will remove all selected sarees and quantities saved on this device."
        }
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setClearOpen(false)}>
              {isHi ? "लिस्ट रखें" : "Keep List"}
            </Button>
            <Button
              onClick={() => {
                clear();
                setClearOpen(false);
              }}
            >
              {isHi ? "लिस्ट खाली करें" : "Clear List"}
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

