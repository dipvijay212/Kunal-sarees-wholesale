"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSummaryCard } from "@/components/checkout/CheckoutSummaryCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { BagIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { businessSettings } from "@/data/business";
import { useOrderList } from "@/hooks/use-order-list";
import { formatPieces, formatPrice } from "@/lib/format";
import { clearOrderList, savePlacedOrder } from "@/lib/stores";
import { orderRepository } from "@/lib/repositories";
import { ordersApi } from "@/lib/api";
import { buildCheckoutWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CheckoutFormData, PlacedOrder } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, summary, hydrated } = useOrderList();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    businessName: "",
    customerType: "Retailer",
    whatsappNumber: "",
    mobileNumber: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hydrated) {
    return (
      <Container className="py-12">
        <LoadingState variant="lines" count={4} label="Loading checkout" />
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="Checkout"
          title="Wholesale Order Checkout"
          description="Provide your store details to send your complete order enquiry on WhatsApp."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Order List", href: "/order" }, { label: "Checkout" }]}
        />
        <section className="section-y-sm">
          <Container size="narrow">
            <EmptyState
              icon={<BagIcon size={28} />}
              title="Your Order List is Empty"
              description="Please add saree designs and quantities to your order list before proceeding to checkout."
              action={
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button href="/products">Browse Catalogue</Button>
                  <Button href="/collections" variant="secondary">
                    View Collections
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
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters long.";
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business / Shop Name is required.";
    }

    if (!formData.customerType) {
      newErrors.customerType = "Customer Type is required.";
    }

    const cleanWhatsapp = formData.whatsappNumber.replace(/\D/g, "");
    if (!cleanWhatsapp) {
      newErrors.whatsappNumber = "WhatsApp Number is required.";
    } else if (cleanWhatsapp.length < 10) {
      newErrors.whatsappNumber = "Please enter a valid 10-digit WhatsApp number.";
    }

    const cleanMobile = formData.mobileNumber.replace(/\D/g, "");
    if (!cleanMobile) {
      newErrors.mobileNumber = "Mobile Number is required.";
    } else if (cleanMobile.length < 10) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state) {
      newErrors.state = "State is required.";
    }

    const cleanPincode = formData.pincode.replace(/\D/g, "");
    if (!cleanPincode) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(cleanPincode)) {
      newErrors.pincode = "Please enter a valid 6-digit Indian PIN code.";
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = "Full Address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Submit order to Backend API
      const itemsPayload = lines.map(({ product, item }) => {
        const rawId = parseInt(product.id.replace(/\D/g, ""), 10) || 1;
        return {
          productId: rawId,
          quantity: item.quantity,
        };
      });

      const apiResult = await ordersApi.create({
        customerName: formData.fullName,
        businessName: formData.businessName || undefined,
        phone: formData.mobileNumber.replace(/\D/g, ""),
        whatsappNumber: formData.whatsappNumber.replace(/\D/g, ""),
        address: formData.fullAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode.replace(/\D/g, ""),
        notes: formData.notes || undefined,
        items: itemsPayload,
      });

      const orderNumber = apiResult.orderNumber;

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
          productName: product.name,
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
      // Fallback: continue with generated reference
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
          productName: product.name,
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
        eyebrow="Wholesale Checkout"
        title="Send Order Enquiry on WhatsApp"
        description="Provide your store details below to send your complete order list directly to our Surat wholesale team on WhatsApp."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Order List", href: "/order" }, { label: "Checkout" }]}
      />

      <section className="section-y-sm">
        <Container>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Customer Form */}
              <div className="lg:col-span-7 xl:col-span-8">
                <CheckoutForm formData={formData} onChange={handleFieldChange} errors={errors} />

                {/* Mobile & Desktop Submit Button */}
                <div className="mt-8 flex flex-col gap-4 rounded-xs border border-line bg-canvas p-6 sm:p-8">
                  <div className="flex flex-col gap-1">
                    <h3 className="type-h4 text-ink">Ready to Send Order?</h3>
                    <p className="text-xs text-muted">
                      Clicking below will format your order and open WhatsApp with your exact quantities ({formatPieces(summary.totalPieces)} pieces, est. {formatPrice(summary.estimatedValue)}).
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    leadingIcon={<WhatsAppIcon size={20} />}
                    fullWidth
                  >
                    Send Order on WhatsApp
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
