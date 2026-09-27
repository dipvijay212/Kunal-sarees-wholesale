"use client";

import Link from "next/link";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { ShieldCheckIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatPieces, formatPrice } from "@/lib/format";
import type { OrderListLine, OrderListSummary } from "@/types";

interface CheckoutSummaryCardProps {
  lines: OrderListLine[];
  summary: OrderListSummary;
}

export function CheckoutSummaryCard({ lines, summary }: CheckoutSummaryCardProps) {
  const { t, getLocalized, language } = useLanguage();

  return (
    <div className="card card__body lg:top-header lg:sticky">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h2 className="type-h4 text-ink">{t.checkout.orderSummary}</h2>
        <Link href="/order" className="text-xs text-accent underline underline-offset-4 hover:text-ink">
          {language === "en" ? "Edit List" : "लिस्ट बदलें"}
        </Link>
      </div>

      {/* Itemized list */}
      <ul className="divide-y divide-line max-h-[22rem] overflow-y-auto pr-1 my-4">
        {lines.map(({ product, item, lineTotal }) => {
          const image = product.images[0];
          const displayName = getLocalized(product, "name") || product.name;
          const colorList = item.selectedColors
            ? Object.entries(item.selectedColors).filter(([, qty]) => qty > 0)
            : [];

          return (
            <li key={product.id} className="py-3.5 first:pt-0 flex gap-3">
              <div className="media-frame relative aspect-[3/4] w-14 shrink-0 rounded-xs">
                {image ? <RemoteImage src={image.url} alt="" fill sizes="56px" className="object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-medium text-ink truncate">{displayName}</h3>
                    <span className="text-xs font-semibold text-ink shrink-0">{formatPrice(lineTotal)}</span>
                  </div>
                  <p className="text-[0.6875rem] font-mono text-muted">{product.productCode}</p>

                  {/* Selected Color breakdown */}
                  {colorList.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {colorList.map(([cName, qty]) => (
                        <span key={cName} className="inline-block rounded-xs bg-canvas-deep px-1 py-0.5 text-[0.625rem] text-subtle border border-line">
                          {cName}: <strong className="text-ink">{qty} {t.products.pieces}</strong>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[0.6875rem] text-subtle mt-0.5">{item.quantity} {t.products.pieces} × {formatPrice(product.price)}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Totals Summary */}
      <dl className="flex flex-col gap-2.5 border-t border-line pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{t.checkout.totalDesigns}</dt>
          <dd className="font-semibold text-ink">{summary.designCount} {language === "en" ? "Varieties" : "प्रकार"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{t.checkout.totalQuantity}</dt>
          <dd className="font-semibold text-ink">{summary.totalPieces} {t.products.pieces}</dd>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-3">
          <dt className="field-label">{t.checkout.totalAmount}</dt>
          <dd className="type-price text-2xl text-ink">{formatPrice(summary.estimatedValue)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-subtle">
        {t.checkout.noPaymentNotice}
      </p>

      <p className="mt-5 flex items-start gap-2.5 border-t border-line pt-5 text-xs text-subtle">
        <ShieldCheckIcon size={18} className="shrink-0 text-accent" />
        {language === "en"
          ? "No online payment required now. Your order will be confirmed directly on WhatsApp."
          : "ऑनलाइन पेमेंट की तुरंत जरूरत नहीं। आपका ऑर्डर सीधे WhatsApp पर कन्फर्म होगा।"}
      </p>
    </div>
  );
}
