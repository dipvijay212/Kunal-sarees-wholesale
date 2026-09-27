"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { BagIcon, ChevronLeftIcon, ChevronRightIcon, PackageIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCustomer } from "@/hooks/use-customer";
import { customerOrdersApi, type BackendOrder, type PaginationMeta } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const isHi = language === "hi";
  const { isAuthenticated, token } = useCustomer();

  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/account/orders");
      return;
    }

    async function loadOrders() {
      try {
        setIsLoading(true);
        const res = await customerOrdersApi.getAll(
          { page: currentPage, limit: 10 },
          token || undefined
        );
        if (res && res.orders) {
          setOrders(res.orders);
          setPagination(res.pagination || null);
        }
      } catch (err) {
        console.error("Failed to load customer orders:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [isAuthenticated, token, currentPage, router]);

  const getStatusLabel = (status: string) => {
    const s = status.toLowerCase() as keyof typeof t.orderStatus;
    return t.orderStatus[s] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "confirmed":
      case "packed":
      case "shipped":
        return "bg-accent/10 text-accent border-accent/20";
      case "cancelled":
        return "bg-danger/10 text-danger border-danger/20";
      default:
        return "bg-muted/10 text-muted border-muted/20";
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={isHi ? "ग्राहक खाता" : "Customer Portal"}
        title={t.myOrders.title}
        description={t.myOrders.subtitle}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.account.title, href: "/account" },
          { label: t.myOrders.title },
        ]}
      />

      <section className="section-y-sm">
        <Container>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="type-h3 text-ink">{t.myOrders.title}</h2>
                <p className="mt-1 text-xs text-muted">
                  {pagination
                    ? isHi
                      ? `कुल ${pagination.totalItems} ऑर्डर मिले`
                      : `Total ${pagination.totalItems} orders found`
                    : null}
                </p>
              </div>
              <Button href="/account" variant="secondary" size="sm">
                ← {t.myOrders.backToAccount}
              </Button>
            </div>

            {isLoading ? (
              <LoadingState variant="lines" count={4} label={t.loading.default} />
            ) : orders.length === 0 ? (
              <EmptyState
                icon={<PackageIcon size={32} />}
                title={t.myOrders.emptyTitle}
                description={t.myOrders.emptySubtitle}
                action={
                  <Button href="/products" leadingIcon={<BagIcon size={16} />}>
                    {t.account.browseCatalog}
                  </Button>
                }
              />
            ) : (
              <>
                {/* Orders List Cards / Table */}
                <div className="overflow-hidden rounded-xs border border-line bg-canvas shadow-sm">
                  <div className="divide-y divide-line/60">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 sm:p-6 transition-colors hover:bg-canvas-subtle/40"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="font-mono text-sm font-bold text-ink">
                                {order.orderNumber}
                              </span>
                              <span
                                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                              <span>
                                {t.myOrders.orderDate}:{" "}
                                <strong className="text-ink font-medium">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    isHi ? "hi-IN" : "en-IN",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </strong>
                              </span>
                              <span>
                                {t.myOrders.totalItems}:{" "}
                                <strong className="text-ink font-medium">
                                  {order.totalItems} {isHi ? "पीस" : "pcs"}
                                </strong>
                              </span>
                              <span>
                                {t.myOrders.totalAmount}:{" "}
                                <strong className="text-ink font-bold">
                                  {formatPrice(order.totalAmount)}
                                </strong>
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-3">
                            <Button
                              href={`/account/orders/${order.id}`}
                              variant="secondary"
                              size="sm"
                            >
                              {t.myOrders.viewDetails} →
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 ? (
                  <div className="flex items-center justify-between border-t border-line/60 pt-4">
                    <p className="text-xs text-muted">
                      {isHi
                        ? `पेज ${pagination.currentPage} / ${pagination.totalPages}`
                        : `Page ${pagination.currentPage} of ${pagination.totalPages}`}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        leadingIcon={<ChevronLeftIcon size={14} />}
                      >
                        {isHi ? "पिछला" : "Previous"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={!pagination.hasNextPage}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        trailingIcon={<ChevronRightIcon size={14} />}
                      >
                        {isHi ? "अगला" : "Next"}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
