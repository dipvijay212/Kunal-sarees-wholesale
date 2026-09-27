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
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { PlacedOrder } from "@/types";

function formatDate(isoString: string, lang: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString(lang === "hi" ? "hi-IN" : "en-IN", {
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
  const { t, language } = useLanguage();
  const isHi = language === "hi";

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

          <p className="type-eyebrow mt-6 text-accent">{isHi ? "होलसेल ऑर्डर" : "Wholesale Order"}</p>
          <h1 className="type-h1 mt-2 text-ink">{t.orderSuccess.title}</h1>

          <p className="mt-2 text-base font-medium text-ink">
            {t.orderSuccess.subtitle}
          </p>

          {/* Highlight Message Box */}
          <div className="mt-6 w-full max-w-lg rounded-xs border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {isHi ? "WhatsApp पर संपर्क पूरा करें" : "Complete Confirmation on WhatsApp"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink font-medium">
              {isHi
                ? "आपके ऑर्डर की पूरी लिस्ट WhatsApp पर तैयार है। कृपया WhatsApp पर मैसेज भेजकर Kunal Sarees से कन्फर्मेशन प्राप्त करें।"
                : "Your order manifest is prepared. Please send the message to Kunal Sarees on WhatsApp to receive availability & invoice."}
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
                {t.orderSuccess.btnSendWhatsApp}
              </Button>
            ) : null}

            <Button href="/products" variant="secondary" size="lg" leadingIcon={<BagIcon size={18} />}>
              {t.products.viewAllFull}
            </Button>

            {order ? (
              <Button href="#order-details" variant="secondary" size="lg">
                {isHi ? "ऑर्डर देखें" : "View Manifest"}
              </Button>
            ) : null}

            <Button href="/" variant="ghost" size="lg" leadingIcon={<HomeIcon size={18} />}>
              {t.orderSuccess.btnGoHome}
            </Button>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {order ? (
          <div id="order-details" className="mt-12 rounded-xs border border-line bg-canvas p-6 shadow-xs sm:p-8">
            <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="type-h4 text-ink">{isHi ? "ऑर्डर की जानकारी" : "Order Summary"}</h2>
                <p className="text-xs text-muted">
                  {isHi ? "WhatsApp होलसेल ऑर्डर का संदर्भ नंबर" : "WhatsApp wholesale reference number"}
                </p>
              </div>
              <span className="self-start rounded-xs border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent sm:self-auto">
                {isHi ? "WhatsApp पर तैयार" : "Ready on WhatsApp"}
              </span>
            </div>

            {/* Grid of Key Info */}
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                  {t.orderSuccess.orderNumberLabel}
                </dt>
                <dd className="mt-1 font-mono text-base font-bold text-ink">{order.orderNumber}</dd>
              </div>

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                  {t.checkout.name}
                </dt>
                <dd className="mt-1 font-semibold text-ink">{order.customerDetails.fullName}</dd>
              </div>

              {order.customerDetails.businessName ? (
                <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                    {t.checkout.businessName}
                  </dt>
                  <dd className="mt-1 font-semibold text-ink">{order.customerDetails.businessName}</dd>
                </div>
              ) : null}

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                  {t.checkout.phone}
                </dt>
                <dd className="mt-1 font-semibold text-ink">{order.customerDetails.mobileNumber || order.customerDetails.whatsappNumber}</dd>
              </div>

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                  {t.checkout.totalDesigns}
                </dt>
                <dd className="mt-1 font-semibold text-ink">
                  {order.summary.designCount} {isHi ? "प्रकार" : "designs"}
                </dd>
              </div>

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                  {t.checkout.totalQuantity}
                </dt>
                <dd className="mt-1 font-semibold text-ink">{formatPieces(order.summary.totalPieces)}</dd>
              </div>

              <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                  {isHi ? "तारीख व समय" : "Date & Time"}
                </dt>
                <dd className="mt-1 font-medium text-ink">{formatDate(order.placedAt, language)}</dd>
              </div>

              {order.customerDetails.fullAddress ? (
                <div className="rounded-xs border border-line/60 bg-canvas-deep/40 p-3.5 sm:col-span-2 lg:col-span-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                    {t.checkout.address}
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{order.customerDetails.fullAddress}</dd>
                </div>
              ) : null}
            </dl>

            {/* Itemized Order List */}
            <div className="mt-8 border-t border-line pt-6">
              <h3 className="type-h4 text-ink">
                {isHi ? `चुनी हुई साड़ियां (${order.items.length})` : `Selected Sarees (${order.items.length})`}
              </h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-ink">{item.productName}</p>
                      <p className="text-xs font-mono text-muted">
                        {isHi ? "कोड" : "Code"}: {item.productCode}
                      </p>

                      {item.selectedColors ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(item.selectedColors)
                            .filter(([, q]) => q > 0)
                            .map(([color, q]) => (
                              <span key={color} className="rounded-xs border border-line bg-canvas-deep px-1.5 py-0.5 text-[0.625rem] text-muted">
                                {color}: <strong className="text-ink">{q} {isHi ? "पीस" : "pcs"}</strong>
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
                <span className="text-ink">{t.checkout.totalAmount}</span>
                <span className="type-price text-xl text-ink">{formatPrice(order.summary.estimatedValue)}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-10 text-center">
          <p className="flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheckIcon size={16} className="text-accent" />
            {isHi
              ? "ऑनलाइन पेमेंट की तुरंत जरूरत नहीं। ऑर्डर की जानकारी WhatsApp पर कन्फर्म होगी।"
              : "No instant payment required. Final invoice & dispatch confirmed via WhatsApp."}
          </p>
        </div>
      </Container>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingState variant="lines" count={4} label="Loading order details..." />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

