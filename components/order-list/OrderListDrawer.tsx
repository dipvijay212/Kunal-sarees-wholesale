"use client";

import { useUI } from "@/components/providers/UIProvider";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { BagIcon } from "@/components/ui/Icons";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useOrderList } from "@/hooks/use-order-list";
import { formatPieces, formatPrice, pluralize } from "@/lib/format";
import { buildOrderListMessage } from "@/lib/whatsapp";
import { OrderListLineItem } from "./OrderListLineItem";

export function OrderListDrawer() {
  const { isOrderListOpen, closeOrderList } = useUI();
  const { lines, summary, updateQuantity, removeItem, clear } = useOrderList();
  const isEmpty = lines.length === 0;

  const handleSendOrder = () => {
    clear();
    closeOrderList();
  };

  return (
    <Drawer
      open={isOrderListOpen}
      onClose={closeOrderList}
      title="Order list"
      description={
        isEmpty ? undefined : `${pluralize(summary.designCount, "design")} · ${formatPieces(summary.totalPieces)}`
      }
      footer={
        isEmpty ? undefined : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="field-label">Estimated value</span>
              <span className="type-price text-xl text-ink">{formatPrice(summary.estimatedValue)}</span>
            </div>
            <p className="-mt-2 text-xs text-subtle">Excludes GST and shipping. Final pricing is confirmed on WhatsApp.</p>
            <WhatsAppButton
              fullWidth
              label="Send order on WhatsApp"
              message={buildOrderListMessage(lines, summary)}
              onClick={handleSendOrder}
            />
            <Button href="/order" variant="secondary" fullWidth onClick={closeOrderList}>
              Review full list
            </Button>
          </div>
        )
      }
    >
      {isEmpty ? (
        <EmptyState
          icon={<BagIcon size={26} />}
          title="Your order list is empty"
          description="Add designs and quantities as you browse, then send the full list to our team on WhatsApp."
          action={
            <Button href="/products" onClick={closeOrderList}>
              Browse catalogue
            </Button>
          }
          className="px-0 py-10"
        />
      ) : (
        <ul className="-my-5 divide-y divide-line">
          {lines.map((line) => (
            <li key={line.product.id}>
              <OrderListLineItem
                line={line}
                density="compact"
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
                onNavigate={closeOrderList}
              />
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
