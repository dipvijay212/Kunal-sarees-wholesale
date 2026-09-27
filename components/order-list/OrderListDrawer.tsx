"use client";

import { useUI } from "@/components/providers/UIProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { BagIcon } from "@/components/ui/Icons";
import { useOrderList } from "@/hooks/use-order-list";
import { formatPrice } from "@/lib/format";
import { OrderListLineItem } from "./OrderListLineItem";

export function OrderListDrawer() {
  const { isOrderListOpen, closeOrderList } = useUI();
  const { t, language } = useLanguage();
  const { lines, summary, updateQuantity, removeItem } = useOrderList();
  const isEmpty = lines.length === 0;

  const headerDescription = isEmpty
    ? undefined
    : (language === "en"
        ? `${summary.designCount} ${summary.designCount === 1 ? t.orderList.design : t.orderList.designs} · ${summary.totalPieces} ${t.products.pieces}`
        : `${summary.designCount} साड़ियां · ${summary.totalPieces} पीस`);

  return (
    <Drawer
      open={isOrderListOpen}
      onClose={closeOrderList}
      title={t.orderList.title}
      description={headerDescription}
      footer={
        isEmpty ? undefined : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="field-label">{t.orderList.subtotal}</span>
              <span className="type-price text-xl text-ink">{formatPrice(summary.estimatedValue)}</span>
            </div>
            <Button href="/checkout" size="lg" fullWidth onClick={closeOrderList}>
              {t.orderList.proceedToCheckout}
            </Button>
          </div>
        )
      }
    >
      {isEmpty ? (
        <EmptyState
          icon={<BagIcon size={26} />}
          title={t.orderList.emptyTitle}
          description={t.orderList.emptySubtitle}
          action={
            <Button href="/products" onClick={closeOrderList}>
              {t.orderList.btnBrowse}
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
