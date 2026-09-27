"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MapPinIcon, PackageIcon, PhoneIcon, UserIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCustomer } from "@/hooks/use-customer";
import { customerOrdersApi, type BackendOrder } from "@/lib/api";
import { formatPieces, formatPrice } from "@/lib/format";
import { businessSettings } from "@/data/business";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { t, language } = useLanguage();
  const isHi = language === "hi";
  const { isAuthenticated, token } = useCustomer();

  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=/account/orders/${id}`);
      return;
    }

    async function loadOrder() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await customerOrdersApi.getById(id, token || undefined);
        if (res && res.order) {
          setOrder(res.order);
        } else {
          setError(isHi ? "ऑर्डर नहीं मिला।" : "Order not found.");
        }
      } catch (err: unknown) {
        console.error("Failed to load order:", err);
        const status = (err as { status?: number })?.status;
        if (status === 403 || status === 404) {
          setError(
            isHi
              ? "यह ऑर्डर आपके अकाउंट से संबद्ध नहीं है या नहीं मिला।"
              : "This order does not belong to your account or was not found."
          );
        } else {
          setError(isHi ? "ऑर्डर लोड करने में त्रुटि हुई।" : "Failed to load order details.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [id, isAuthenticated, token, isHi, router]);

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

  const getWhatsAppShareUrl = () => {
    if (!order) return "#";
    const itemsLines = (order.items || [])
      .map(
        (it, idx) =>
          `${idx + 1}. ${isHi ? (it.productNameHi || it.productName) : (it.productNameEn || it.productName)} (${it.productCode || "KS"}) - ${it.quantity} pcs @ ₹${it.unitPrice} = ₹${it.subtotal}`
      )
      .join("\n");

    const message = `*Kunal Sarees - Wholesale Order Share*\n\n` +
      `*Order Number:* ${order.orderNumber}\n` +
      `*Customer:* ${order.customerNameSnapshot}\n` +
      (order.businessNameSnapshot ? `*Business:* ${order.businessNameSnapshot}\n` : "") +
      `*Phone:* ${order.phoneSnapshot}\n` +
      `*Status:* ${getStatusLabel(order.status)}\n\n` +
      `*Items:*\n${itemsLines}\n\n` +
      `*Total Pieces:* ${order.totalItems}\n` +
      `*Total Amount:* ₹${order.totalAmount}\n\n` +
      `Delivery Address: ${order.addressSnapshot}, ${order.citySnapshot}, ${order.stateSnapshot} - ${order.pincodeSnapshot}`;

    return buildWhatsAppUrl(message, businessSettings.contact.whatsappNumber);
  };

  return (
    <>
      <PageHeader
        eyebrow={isHi ? "ग्राहक खाता" : "Customer Portal"}
        title={order ? `${t.myOrders.title}: ${order.orderNumber}` : t.myOrders.title}
        description={isHi ? "ऑर्डर और डिलीवरी का पूरा विवरण" : "Full order and delivery details"}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.account.title, href: "/account" },
          { label: t.myOrders.title, href: "/account/orders" },
          { label: order?.orderNumber || id },
        ]}
      />

      <section className="section-y-sm">
        <Container>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Link
                href="/account/orders"
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                ← {t.myOrders.backToOrders}
              </Link>
            </div>

            {isLoading ? (
              <LoadingState variant="lines" count={5} label={t.loading.default} />
            ) : error || !order ? (
              <div className="rounded-xs border border-danger/30 bg-danger/5 p-6 text-center">
                <p className="text-sm font-medium text-danger">{error}</p>
                <div className="mt-4">
                  <Button href="/account/orders" variant="secondary" size="sm">
                    {t.myOrders.backToOrders}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-12">
                {/* Left: Order Info & Items */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Order Top Bar */}
                  <div className="rounded-xs border border-line bg-canvas p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/60 pb-4">
                      <div>
                        <span className="text-xs text-muted">{t.myOrders.orderNumber}</span>
                        <h2 className="font-mono text-xl font-bold text-ink">
                          {order.orderNumber}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                      <div>
                        <span className="text-muted">{t.myOrders.orderDate}</span>
                        <p className="font-medium text-ink mt-0.5">
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
                        </p>
                      </div>
                      <div>
                        <span className="text-muted">{t.myOrders.totalItems}</span>
                        <p className="font-medium text-ink mt-0.5">
                          {formatPieces(order.totalItems)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted">{t.myOrders.totalAmount}</span>
                        <p className="font-bold text-ink mt-0.5 text-sm">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="rounded-xs border border-line bg-canvas p-6 shadow-sm">
                    <h3 className="type-h4 text-ink border-b border-line/60 pb-3">
                      {t.myOrders.orderItems}
                    </h3>

                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-line text-muted">
                            <th className="pb-3 font-semibold">{t.myOrders.item}</th>
                            <th className="pb-3 text-right font-semibold">{t.myOrders.unitPrice}</th>
                            <th className="pb-3 text-center font-semibold">{t.myOrders.qty}</th>
                            <th className="pb-3 text-right font-semibold">{t.myOrders.subtotal}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/60">
                          {order.items?.map((item) => (
                            <tr key={item.id} className="text-ink">
                              <td className="py-3">
                                <div className="font-medium">
                                  {isHi
                                    ? (item.productNameHi || item.productName)
                                    : (item.productNameEn || item.productName)}
                                </div>
                                {item.productCode ? (
                                  <div className="font-mono text-[11px] text-muted">
                                    {item.productCode}
                                  </div>
                                ) : null}
                              </td>
                              <td className="py-3 text-right">
                                {formatPrice(item.unitPrice)}
                              </td>
                              <td className="py-3 text-center font-medium">
                                {item.quantity}
                              </td>
                              <td className="py-3 text-right font-bold">
                                {formatPrice(item.subtotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-line font-bold text-ink">
                            <td colSpan={2} className="pt-4 text-sm">
                              {t.myOrders.totalAmount}
                            </td>
                            <td className="pt-4 text-center text-sm font-semibold">
                              {order.totalItems}
                            </td>
                            <td className="pt-4 text-right text-base text-accent">
                              {formatPrice(order.totalAmount)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right: Customer & Shipping Details Snapshot & Actions */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="rounded-xs border border-line bg-canvas p-6 shadow-sm">
                    <h3 className="type-h4 text-ink border-b border-line/60 pb-3 flex items-center gap-2">
                      <UserIcon size={16} className="text-accent" />
                      {t.myOrders.customerDetails}
                    </h3>

                    <div className="mt-4 flex flex-col gap-3 text-xs">
                      <div>
                        <span className="text-muted">{t.account.name}</span>
                        <p className="font-semibold text-ink">{order.customerNameSnapshot}</p>
                      </div>

                      {order.businessNameSnapshot ? (
                        <div>
                          <span className="text-muted">{t.account.businessName}</span>
                          <p className="font-medium text-ink">{order.businessNameSnapshot}</p>
                        </div>
                      ) : null}

                      <div>
                        <span className="text-muted">{t.account.phone}</span>
                        <p className="font-medium text-ink">{order.phoneSnapshot}</p>
                      </div>

                      {order.whatsappNumberSnapshot ? (
                        <div>
                          <span className="text-muted">{t.account.whatsapp}</span>
                          <p className="font-medium text-ink">{order.whatsappNumberSnapshot}</p>
                        </div>
                      ) : null}

                      {order.emailSnapshot ? (
                        <div>
                          <span className="text-muted">{t.account.email}</span>
                          <p className="font-medium text-ink">{order.emailSnapshot}</p>
                        </div>
                      ) : null}

                      <div className="border-t border-line/60 pt-3">
                        <span className="text-muted">{t.account.address}</span>
                        <p className="font-medium text-ink mt-0.5">
                          {order.addressSnapshot}
                          {order.citySnapshot ? `, ${order.citySnapshot}` : ""}
                          {order.stateSnapshot ? `, ${order.stateSnapshot}` : ""}
                          {order.pincodeSnapshot ? ` - ${order.pincodeSnapshot}` : ""}
                        </p>
                      </div>

                      {order.notes ? (
                        <div className="border-t border-line/60 pt-3">
                          <span className="text-muted">{t.checkout.notes}</span>
                          <p className="text-ink mt-0.5 italic">{order.notes}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions & WhatsApp Sharing */}
                  <div className="rounded-xs border border-line bg-canvas p-6 shadow-sm flex flex-col gap-3">
                    <h4 className="font-semibold text-ink text-sm">
                      {isHi ? "ऑर्डर सहायता और शेयर" : "Order Actions & Support"}
                    </h4>
                    <p className="text-xs text-muted">
                      {isHi
                        ? "ऑर्डर की पुष्टि या अपडेट के लिए Kunal Sarees के साथ WhatsApp पर शेयर करें।"
                        : "Share or inquire about this confirmed order with Kunal Sarees on WhatsApp."}
                    </p>
                    <a
                      href={getWhatsAppShareUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center justify-center gap-2 rounded-xs bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#20bd5a] transition-colors shadow-sm"
                    >
                      <WhatsAppIcon size={18} />
                      {t.myOrders.shareOnWhatsapp}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
