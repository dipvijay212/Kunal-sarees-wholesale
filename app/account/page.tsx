"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input, Select } from "@/components/ui/FormField";
import {
  BagIcon,
  ChevronRightIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  UserIcon,
} from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCustomer } from "@/hooks/use-customer";
import { customerOrdersApi, type BackendOrder } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
  "Other State",
];

export default function AccountPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const isHi = language === "hi";
  const { isAuthenticated, customer, token, logout, updateProfile, refreshSession } = useCustomer();

  const [activeTab, setActiveTab] = useState<"overview" | "profile">("overview");
  const [recentOrders, setRecentOrders] = useState<BackendOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Edit Form State
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/account");
      return;
    }

    if (customer) {
      setFormData({
        name: customer.name || "",
        businessName: customer.businessName || "",
        phone: customer.phone || "",
        whatsappNumber: customer.whatsappNumber || customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        pincode: customer.pincode || "",
      });
    }

    // Fetch recent orders
    async function loadRecentOrders() {
      try {
        setLoadingOrders(true);
        const res = await customerOrdersApi.getAll({ limit: 3 }, token || undefined);
        if (res && res.orders) {
          setRecentOrders(res.orders);
        }
      } catch (err) {
        console.error("Failed to load recent orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadRecentOrders();
  }, [isAuthenticated, customer, token, router]);

  if (!isAuthenticated || !customer) {
    return (
      <Container className="py-12">
        <LoadingState variant="lines" count={4} label={t.loading.default} />
      </Container>
    );
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const res = await updateProfile({
        name: formData.name,
        businessName: formData.businessName,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });

      if (res.success) {
        setSaveSuccess(true);
        refreshSession();
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(res.error || (isHi ? "अपडेट करने में त्रुटि हुई।" : "Failed to update profile."));
      }
    } catch {
      setSaveError(isHi ? "अपडेट करने में त्रुटि हुई।" : "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

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
        title={t.account.title}
        description={t.account.subtitle}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.account.title },
        ]}
      />

      <section className="section-y-sm">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4">
              <div className="rounded-xs border border-line bg-canvas p-6">
                {/* Greeting Card */}
                <div className="flex items-center gap-3 border-b border-line/60 pb-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-lg">
                    {customer.name?.charAt(0) || "K"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">
                      {isHi ? "नमस्ते," : "Welcome,"}
                    </p>
                    <h3 className="type-h4 truncate text-ink font-semibold">
                      {customer.name}
                    </h3>
                    {customer.businessName ? (
                      <p className="truncate text-xs text-muted">
                        {customer.businessName}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="mt-5 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center justify-between rounded-xs px-3 py-2.5 text-xs font-medium transition-colors ${
                      activeTab === "overview"
                        ? "bg-accent text-white"
                        : "text-ink hover:bg-canvas-subtle"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <UserIcon size={16} />
                      {t.account.overview}
                    </span>
                    <ChevronRightIcon size={14} />
                  </button>

                  <Link
                    href="/account/orders"
                    className="flex items-center justify-between rounded-xs px-3 py-2.5 text-xs font-medium text-ink hover:bg-canvas-subtle transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <BagIcon size={16} />
                      {t.account.myOrders}
                    </span>
                    <ChevronRightIcon size={14} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center justify-between rounded-xs px-3 py-2.5 text-xs font-medium transition-colors ${
                      activeTab === "profile"
                        ? "bg-accent text-white"
                        : "text-ink hover:bg-canvas-subtle"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <MapPinIcon size={16} />
                      {t.account.myInformation}
                    </span>
                    <ChevronRightIcon size={14} />
                  </button>

                  <div className="mt-4 border-t border-line/60 pt-4">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-between rounded-xs px-3 py-2.5 text-xs font-medium text-danger hover:bg-danger/5 transition-colors"
                    >
                      <span>{t.account.logout}</span>
                      <span className="text-xs">→</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-8">
              {activeTab === "overview" ? (
                <div className="flex flex-col gap-6">
                  {/* Customer Information Snapshot */}
                  <div className="rounded-xs border border-line bg-canvas p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-line/60 pb-4">
                      <div>
                        <h2 className="type-h4 text-ink">{t.account.personalDetails}</h2>
                        <p className="text-xs text-muted">{customer.phone}</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveTab("profile")}
                      >
                        {t.account.editProfile}
                      </Button>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted">{t.account.businessName}</p>
                        <p className="mt-0.5 text-sm font-medium text-ink">
                          {customer.businessName || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">{t.account.phone}</p>
                        <p className="mt-0.5 text-sm font-medium text-ink">
                          {customer.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">{t.account.whatsapp}</p>
                        <p className="mt-0.5 text-sm font-medium text-ink">
                          {customer.whatsappNumber || customer.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">{t.account.email}</p>
                        <p className="mt-0.5 text-sm font-medium text-ink">
                          {customer.email || "—"}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted">{t.account.address}</p>
                        <p className="mt-0.5 text-sm font-medium text-ink">
                          {customer.address}
                          {customer.city ? `, ${customer.city}` : ""}
                          {customer.state ? `, ${customer.state}` : ""}
                          {customer.pincode ? ` - ${customer.pincode}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Section */}
                  <div className="rounded-xs border border-line bg-canvas p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-line/60 pb-4">
                      <div>
                        <h2 className="type-h4 text-ink">{t.account.recentOrders}</h2>
                        <p className="text-xs text-muted">
                          {isHi ? "आपके हाल ही में दिए गए ऑर्डर" : "Your recent order activity"}
                        </p>
                      </div>
                      <Button href="/account/orders" variant="secondary" size="sm">
                        {t.account.viewAllOrders} →
                      </Button>
                    </div>

                    <div className="mt-6">
                      {loadingOrders ? (
                        <LoadingState variant="lines" count={2} label={t.loading.default} />
                      ) : recentOrders.length === 0 ? (
                        <div className="py-8 text-center">
                          <PackageIcon size={32} className="mx-auto text-muted/50 mb-2" />
                          <p className="text-xs text-muted">{t.account.noOrdersFound}</p>
                          <div className="mt-4">
                            <Button href="/products" size="sm">
                              {t.account.browseCatalog}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {recentOrders.map((ord) => (
                            <div
                              key={ord.id}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xs border border-line/70 p-4 hover:border-accent/40 transition-colors bg-canvas-subtle/30"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm font-bold text-ink">
                                    {ord.orderNumber}
                                  </span>
                                  <span
                                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusColor(
                                      ord.status
                                    )}`}
                                  >
                                    {getStatusLabel(ord.status)}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-muted">
                                  {new Date(ord.createdAt).toLocaleDateString(
                                    isHi ? "hi-IN" : "en-IN",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}{" "}
                                  • {ord.totalItems} {isHi ? "पीस" : "items"}
                                </p>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-4">
                                <span className="text-sm font-bold text-ink">
                                  {formatPrice(ord.totalAmount)}
                                </span>
                                <Button
                                  href={`/account/orders/${ord.id}`}
                                  variant="secondary"
                                  size="sm"
                                >
                                  {t.account.viewOrder}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Profile Edit Tab */
                <div className="rounded-xs border border-line bg-canvas p-6 sm:p-8">
                  <div className="border-b border-line/60 pb-4">
                    <h2 className="type-h4 text-ink">{t.account.myInformation}</h2>
                    <p className="text-xs text-muted">
                      {isHi
                        ? "अपनी संपर्क और डिलीवरी जानकारी अपडेट करें।"
                        : "Update your contact and billing/shipping information."}
                    </p>
                  </div>

                  {saveSuccess ? (
                    <div className="mt-4 rounded-xs border border-success/30 bg-success/10 p-3 text-xs text-success">
                      {t.account.profileUpdatedSuccess}
                    </div>
                  ) : null}

                  {saveError ? (
                    <div className="mt-4 rounded-xs border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                      {saveError}
                    </div>
                  ) : null}

                  <form onSubmit={handleProfileSubmit} className="mt-6 flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="edit-name" className="field-label">
                          {t.account.name} <span className="text-accent">*</span>
                        </label>
                        <Input
                          id="edit-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, name: e.target.value }))
                          }
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="edit-business" className="field-label">
                          {t.account.businessName} <span className="text-accent">*</span>
                        </label>
                        <Input
                          id="edit-business"
                          type="text"
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, businessName: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="edit-phone" className="field-label">
                          {t.account.phone} (स्थिर)
                        </label>
                        <Input
                          id="edit-phone"
                          type="text"
                          value={formData.phone}
                          disabled
                          className="bg-canvas-subtle cursor-not-allowed opacity-75"
                        />
                        <p className="mt-1 text-[11px] text-muted">
                          {isHi
                            ? "मोबाइल नंबर खाता पहचानकर्ता है और बदला नहीं जा सकता।"
                            : "Mobile number is your account ID and cannot be changed."}
                        </p>
                      </div>

                      <div>
                        <label htmlFor="edit-whatsapp" className="field-label">
                          {t.account.whatsapp} <span className="text-accent">*</span>
                        </label>
                        <Input
                          id="edit-whatsapp"
                          type="tel"
                          value={formData.whatsappNumber}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, whatsappNumber: e.target.value }))
                          }
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="edit-email" className="field-label">
                        {t.account.email}
                      </label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-address" className="field-label">
                        {t.account.address} <span className="text-accent">*</span>
                      </label>
                      <Input
                        id="edit-address"
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, address: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                      <div>
                        <label htmlFor="edit-city" className="field-label">
                          {t.account.city} <span className="text-accent">*</span>
                        </label>
                        <Input
                          id="edit-city"
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, city: e.target.value }))
                          }
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="edit-state" className="field-label">
                          {t.account.state} <span className="text-accent">*</span>
                        </label>
                        <Select
                          id="edit-state"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, state: e.target.value }))
                          }
                        >
                          <option value="">{isHi ? "राज्य चुनें" : "Select State"}</option>
                          {STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label htmlFor="edit-pincode" className="field-label">
                          {t.account.pincode} <span className="text-accent">*</span>
                        </label>
                        <Input
                          id="edit-pincode"
                          type="text"
                          value={formData.pincode}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              pincode: e.target.value.replace(/\D/g, ""),
                            }))
                          }
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex gap-3">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving
                          ? (isHi ? "सहेज रहे हैं..." : "Saving...")
                          : t.account.saveChanges}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setActiveTab("overview")}
                      >
                        {isHi ? "रद्द करें" : "Cancel"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </main>
          </div>
        </Container>
      </section>
    </>
  );
}
