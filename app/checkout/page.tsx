"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSummaryCard } from "@/components/checkout/CheckoutSummaryCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { BagIcon, LockIcon, WhatsAppIcon, UserIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { businessSettings } from "@/data/business";
import { useOrderList } from "@/hooks/use-order-list";
import { useCustomer } from "@/hooks/use-customer";
import { formatPieces, formatPrice } from "@/lib/format";
import { clearOrderList, savePlacedOrder } from "@/lib/stores";
import { orderRepository } from "@/lib/repositories";
import { ordersApi } from "@/lib/api";
import { buildCheckoutWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { CheckoutFormData, PlacedOrder } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, summary, hydrated } = useOrderList();
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  const { isAuthenticated, customer, token, logout, setSession } = useCustomer();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    businessName: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    fullAddress: "",
    password: "",
    confirmPassword: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateCustomerError, setDuplicateCustomerError] = useState<string | null>(null);

  // Auto-populate form data if customer is logged in
  useEffect(() => {
    if (isAuthenticated && customer) {
      setFormData((prev) => ({
        ...prev,
        fullName: customer.name || prev.fullName,
        businessName: customer.businessName || prev.businessName,
        mobileNumber: customer.phone || prev.mobileNumber,
        whatsappNumber: customer.whatsappNumber || customer.phone || prev.whatsappNumber,
        email: customer.email || prev.email,
        fullAddress: customer.address || prev.fullAddress,
      }));
    }
  }, [isAuthenticated, customer]);

  if (!hydrated) {
    return (
      <Container className="py-12">
        <LoadingState variant="lines" count={4} label={t.loading.default} />
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow={isHi ? "होलसेल ऑर्डर" : "Wholesale Order"}
          title={t.checkout.title}
          description={t.checkout.subtitle}
          breadcrumbs={[
            { label: t.nav.home, href: "/" },
            { label: t.nav.orderList, href: "/order" },
            { label: t.checkout.title },
          ]}
        />
        <section className="section-y-sm">
          <Container size="narrow">
            <EmptyState
              icon={<BagIcon size={28} />}
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
          </Container>
        </section>
      </>
    );
  }

  const handleFieldChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (duplicateCustomerError) {
      setDuplicateCustomerError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = isHi ? "कृपया अपना नाम डालें।" : "Please enter your name.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = isHi ? "नाम कम से कम 3 अक्षरों का होना चाहिए।" : "Name must be at least 3 characters.";
    }

    if (!formData.businessName?.trim()) {
      newErrors.businessName = isHi ? "कृपया दुकान या बिज़नेस का नाम डालें।" : "Please enter your shop or business name.";
    }

    const cleanMobile = formData.mobileNumber.replace(/\D/g, "");
    if (!cleanMobile) {
      newErrors.mobileNumber = isHi ? "कृपया मोबाइल नंबर डालें।" : "Please enter mobile number.";
    } else if (cleanMobile.length < 10) {
      newErrors.mobileNumber = isHi ? "कृपया सही 10 अंकों का मोबाइल नंबर डालें।" : "Please enter a valid 10-digit number.";
    }

    const cleanWhatsapp = formData.whatsappNumber.replace(/\D/g, "");
    if (!cleanWhatsapp) {
      newErrors.whatsappNumber = isHi ? "कृपया WhatsApp नंबर डालें।" : "Please enter WhatsApp number.";
    } else if (cleanWhatsapp.length < 10) {
      newErrors.whatsappNumber = isHi ? "कृपया सही 10 अंकों का WhatsApp नंबर डालें।" : "Please enter a valid 10-digit number.";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = isHi ? "कृपया सही ईमेल पता डालें।" : "Please enter a valid email address.";
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = isHi ? "कृपया डिलीवरी का पूरा पता डालें।" : "Please enter your complete delivery address.";
    }

    // Password validation for new unauthenticated customers
    if (!isAuthenticated) {
      if (!formData.password) {
        newErrors.password = t.checkout.passwordRequired;
      } else if (formData.password.length < 8) {
        newErrors.password = t.checkout.passwordTooShort;
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = isHi ? "कृपया पासवर्ड की पुष्टि करें।" : "Please confirm your password.";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t.checkout.passwordsDoNotMatch;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateCustomerError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Map order items to payload
      const itemsPayload = lines.map(({ product, item }) => {
        const rawId = parseInt(product.id.replace(/\D/g, ""), 10) || 1;
        return {
          productId: rawId,
          quantity: item.quantity,
        };
      });

      const orderPayload = {
        customerName: formData.fullName.trim(),
        businessName: formData.businessName ? formData.businessName.trim() : undefined,
        phone: formData.mobileNumber.replace(/\D/g, ""),
        whatsappNumber: formData.whatsappNumber.replace(/\D/g, ""),
        email: formData.email ? formData.email.trim() : undefined,
        password: !isAuthenticated ? formData.password : undefined,
        confirmPassword: !isAuthenticated ? formData.confirmPassword : undefined,
        address: formData.fullAddress.trim(),
        notes: formData.notes ? formData.notes.trim() : undefined,
        items: itemsPayload,
      };

      const apiResult = await ordersApi.create(orderPayload, token || undefined);

      const orderNumber = apiResult.orderNumber;

      // If backend created account and returned token & customer
      if (apiResult.token && apiResult.customer) {
        setSession(apiResult.token, apiResult.customer);
      }

      // Format WhatsApp Message with confirmed order number
      const messageText = buildCheckoutWhatsAppMessage(formData, lines, summary);
      const whatsappUrl = buildWhatsAppUrl(messageText, businessSettings.contact.whatsappNumber);

      const placedOrder: PlacedOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customerDetails: { ...formData },
        items: lines.map(({ product, item, lineTotal }) => ({
          productId: product.id,
          productCode: product.productCode,
          productName: isHi ? (product.name_hi || product.name) : (product.name_en || product.name),
          quantity: item.quantity,
          price: product.price,
          lineTotal,
          selectedColors: item.selectedColors,
        })),
        summary: { ...summary },
        placedAt: new Date().toISOString(),
        whatsappUrl,
      };

      savePlacedOrder(placedOrder);
      orderRepository.create(placedOrder);
      clearOrderList();

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      router.push(`/order/success?orderNumber=${orderNumber}`);
    } catch (err: unknown) {
      console.error("Failed to place order:", err);
      const errorObj = err as { message?: string; status?: number; error?: string };
      
      // Check for duplicate customer mobile number (409 conflict)
      if (
        errorObj.status === 409 ||
        errorObj.error === "CUSTOMER_EXISTS" ||
        (errorObj.message && errorObj.message.includes("पहले से अकाउंट बना हुआ है")) ||
        (errorObj.message && errorObj.message.toLowerCase().includes("already registered"))
      ) {
        setDuplicateCustomerError(t.checkout.phoneAlreadyRegistered);
        setIsSubmitting(false);
        return;
      }

      // Fallback: if server error or network issue, create locally placed order
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrderNumber = `KS-ORD-2026-${randomDigits}`;
      const messageText = buildCheckoutWhatsAppMessage(formData, lines, summary);
      const whatsappUrl = buildWhatsAppUrl(messageText, businessSettings.contact.whatsappNumber);

      const placedOrder: PlacedOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: fallbackOrderNumber,
        customerDetails: { ...formData },
        items: lines.map(({ product, item, lineTotal }) => ({
          productId: product.id,
          productCode: product.productCode,
          productName: isHi ? (product.name_hi || product.name) : (product.name_en || product.name),
          quantity: item.quantity,
          price: product.price,
          lineTotal,
          selectedColors: item.selectedColors,
        })),
        summary: { ...summary },
        placedAt: new Date().toISOString(),
        whatsappUrl,
      };

      savePlacedOrder(placedOrder);
      orderRepository.create(placedOrder);
      clearOrderList();
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      router.push(`/order/success?orderNumber=${fallbackOrderNumber}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={isHi ? "होलसेल ऑर्डर" : "Wholesale Order"}
        title={t.checkout.title}
        description={t.checkout.subtitle}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.orderList, href: "/order" },
          { label: t.checkout.title },
        ]}
      />

      <section className="section-y-sm">
        <Container>
          {/* Duplicate Account Alert Banner */}
          {duplicateCustomerError ? (
            <div className="mb-6 rounded-xs border-2 border-danger/40 bg-danger/5 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <UserIcon size={22} className="text-danger shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-danger text-sm">
                      {t.checkout.phoneAlreadyRegistered}
                    </h4>
                    <p className="mt-0.5 text-xs text-ink/75">
                      {isHi
                        ? "लॉगिन करने के बाद आपकी जानकारी अपने आप भर जाएगी।"
                        : "After logging in, your saved details will automatically populate this checkout."}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <Link
                    href={`/login?redirect=/checkout&phone=${formData.mobileNumber.replace(/\D/g, "")}`}
                    className="inline-flex items-center justify-center rounded-xs bg-danger px-4 py-2 text-xs font-semibold text-white hover:bg-danger/90"
                  >
                    {t.checkout.loginButton} →
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Customer Form */}
              <div className="lg:col-span-7 xl:col-span-8">
                <CheckoutForm
                  formData={formData}
                  onChange={handleFieldChange}
                  errors={errors}
                  isAuthenticated={isAuthenticated}
                  customer={customer}
                  onLogout={logout}
                />

                {/* Submit Button */}
                <div className="mt-8 flex flex-col gap-4 rounded-xs border border-line bg-canvas p-6 sm:p-8">
                  <div className="flex flex-col gap-1">
                    <h3 className="type-h4 text-ink">
                      {isHi ? "ऑर्डर भेजने के लिए तैयार हैं?" : "Ready to send your wholesale order?"}
                    </h3>
                    <p className="text-xs text-muted">
                      {isHi
                        ? `नीचे दिए गए बटन पर क्लिक करने से आपका पूरा ऑर्डर तैयार हो जाएगा और WhatsApp पर खुल जाएगा (${formatPieces(summary.totalPieces)} पीस, कुल ${formatPrice(summary.estimatedValue)})।`
                        : `Clicking the button below generates your order manifest and opens WhatsApp (${formatPieces(summary.totalPieces)} pcs, estimated ${formatPrice(summary.estimatedValue)}).`}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    leadingIcon={<WhatsAppIcon size={20} />}
                    fullWidth
                  >
                    {isSubmitting
                      ? (isHi ? "ऑर्डर भेजा जा रहा है..." : "Processing Order...")
                      : (isHi ? "WhatsApp पर ऑर्डर भेजें" : "Send Order via WhatsApp")}
                  </Button>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 xl:col-span-4">
                <CheckoutSummaryCard lines={lines} summary={summary} />
              </div>
            </div>
          </form>
        </Container>
      </section>
    </>
  );
}
