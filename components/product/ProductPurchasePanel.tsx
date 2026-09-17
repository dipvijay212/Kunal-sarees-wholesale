"use client";

import Link from "next/link";
import { useState } from "react";
import { useUI } from "@/components/providers/UIProvider";
import { Button } from "@/components/ui/Button";
import { BagIcon } from "@/components/ui/Icons";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useOrderList } from "@/hooks/use-order-list";
import { formatPieces, formatPrice } from "@/lib/format";
import { getQuantityRules } from "@/lib/quantity";
import { buildProductEnquiryMessage } from "@/lib/whatsapp";
import type { Product } from "@/types";
import { WishlistButton } from "./WishlistButton";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const rules = getQuantityRules(product.pricing);
  const [quantity, setQuantity] = useState(rules.min);
  const { lines, addItem } = useOrderList();
  const { openOrderList } = useUI();

  const existingLine = lines.find((line) => line.product.id === product.id);
  const estimatedTotal = quantity * product.pricing.pricePerPiece;

  const handleAddToOrderList = () => {
    addItem(product.id, quantity);
    openOrderList();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          min={rules.min}
          max={rules.max}
          step={rules.step}
          label="Quantity (pieces)"
          showLabel
        />
        <div className="text-right">
          <p className="field-label">Estimated value</p>
          <p className="type-price mt-2 text-2xl text-ink" aria-live="polite">
            {formatPrice(estimatedTotal)}
          </p>
        </div>
      </div>

      <p className="-mt-2 text-xs leading-relaxed text-subtle">
        Minimum order {formatPieces(rules.min)}
        {rules.step > 1 ? `, in sets of ${rules.step}` : ""}. Excludes GST and shipping.
      </p>

      <div className="flex flex-col gap-3">
        <Button onClick={handleAddToOrderList} size="lg" fullWidth leadingIcon={<BagIcon size={18} />}>
          Add to order list
        </Button>
        <WhatsAppButton
          variant="secondary"
          size="lg"
          fullWidth
          label="Enquire on WhatsApp"
          message={buildProductEnquiryMessage(product, quantity)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <WishlistButton productId={product.id} productName={product.name} variant="inline" className="-ml-3" />
        {existingLine ? (
          <p className="text-sm text-muted">
            {formatPieces(existingLine.item.quantity)} in your{" "}
            <Link href="/order-list" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              order list
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
