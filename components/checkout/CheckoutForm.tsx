"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Input } from "@/components/ui/FormField";
import { LockIcon, UserIcon } from "@/components/ui/Icons";
import type { CheckoutFormData } from "@/types";
import type { BackendCustomer } from "@/lib/api";

interface CheckoutFormProps {
  formData: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  isAuthenticated?: boolean;
  customer?: BackendCustomer | null;
  onLogout?: () => void;
}

export function CheckoutForm({
  formData,
  onChange,
  errors,
  isAuthenticated = false,
  customer = null,
  onLogout,
}: CheckoutFormProps) {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  const handleCopyMobileToWhatsapp = () => {
    if (formData.mobileNumber) {
      onChange("whatsappNumber", formData.mobileNumber);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-xs border border-line bg-canvas p-6 sm:p-8">
      {/* Header & Login Status Banner */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="type-h3 text-ink">{t.checkout.title}</h2>

          {isAuthenticated && customer ? (
            <div className="flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs text-ink">
              <span className="flex h-2 w-2 rounded-full bg-success"></span>
              <span>
                {isHi ? "लॉगिन:" : "Logged in:"}{" "}
                <strong>{customer.name}</strong>
              </span>
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="ml-1 text-muted hover:text-danger hover:underline text-[11px]"
                >
                  ({isHi ? "लॉगआउट" : "Logout"})
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <p className="mt-1 text-xs text-muted">
          {isHi
            ? "ऑर्डर पूरा करने के लिए नीचे अपनी जानकारी भरें।"
            : "Enter your personal details below to submit your order."}
        </p>

        {!isAuthenticated ? (
          <div className="mt-4 flex items-center justify-between rounded-xs border border-accent/20 bg-accent/5 p-3 text-xs text-ink">
            <div className="flex items-center gap-2">
              <UserIcon size={16} className="text-accent shrink-0" />
              <span>{t.checkout.alreadyHaveAccount}</span>
            </div>
            <Link
              href={`/login?redirect=/checkout${formData.mobileNumber ? `&phone=${formData.mobileNumber.replace(/\D/g, "")}` : ""}`}
              className="font-medium text-accent hover:underline ml-2 shrink-0"
            >
              {t.checkout.loginHere} →
            </Link>
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="field-label">
            {t.checkout.name} <span className="text-accent">*</span>
          </label>
          <Input
            id="fullName"
            type="text"
            placeholder={t.checkout.namePlaceholder}
            value={formData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className={errors.fullName ? "border-danger" : ""}
          />
          {errors.fullName ? <p className="mt-1 text-xs text-danger">{errors.fullName}</p> : null}
        </div>

        {/* Business / Shop Name */}
        <div>
          <label htmlFor="businessName" className="field-label">
            {t.checkout.businessName} <span className="text-accent">*</span>
          </label>
          <Input
            id="businessName"
            type="text"
            placeholder={t.checkout.businessNamePlaceholder}
            value={formData.businessName || ""}
            onChange={(e) => onChange("businessName", e.target.value)}
            className={errors.businessName ? "border-danger" : ""}
          />
          {errors.businessName ? <p className="mt-1 text-xs text-danger">{errors.businessName}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Mobile Number */}
        <div>
          <label htmlFor="mobileNumber" className="field-label">
            {t.checkout.phone} <span className="text-accent">*</span>
          </label>
          <Input
            id="mobileNumber"
            type="tel"
            placeholder={t.checkout.phonePlaceholder}
            value={formData.mobileNumber}
            onChange={(e) => {
              const val = e.target.value;
              onChange("mobileNumber", val);
              // If whatsapp was empty or matching previous mobile, keep in sync
              if (!formData.whatsappNumber || formData.whatsappNumber === formData.mobileNumber) {
                onChange("whatsappNumber", val);
              }
            }}
            maxLength={10}
            className={errors.mobileNumber ? "border-danger" : ""}
          />
          {errors.mobileNumber ? <p className="mt-1 text-xs text-danger">{errors.mobileNumber}</p> : null}
        </div>

        {/* WhatsApp Number */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="whatsappNumber" className="field-label">
              {t.checkout.whatsappNumber} <span className="text-accent">*</span>
            </label>
            {formData.mobileNumber && formData.whatsappNumber !== formData.mobileNumber ? (
              <button
                type="button"
                onClick={handleCopyMobileToWhatsapp}
                className="text-[11px] text-accent hover:underline pb-1"
              >
                {isHi ? "मोबाइल जैसा ही" : "Same as mobile"}
              </button>
            ) : null}
          </div>
          <Input
            id="whatsappNumber"
            type="tel"
            placeholder={t.checkout.whatsappPlaceholder}
            value={formData.whatsappNumber}
            onChange={(e) => onChange("whatsappNumber", e.target.value)}
            maxLength={10}
            className={errors.whatsappNumber ? "border-danger" : ""}
          />
          {errors.whatsappNumber ? (
            <p className="mt-1 text-xs text-danger">{errors.whatsappNumber}</p>
          ) : null}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="field-label">
          {t.checkout.email}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={t.checkout.emailPlaceholder}
          value={formData.email || ""}
          onChange={(e) => onChange("email", e.target.value)}
          className={errors.email ? "border-danger" : ""}
        />
        {errors.email ? <p className="mt-1 text-xs text-danger">{errors.email}</p> : null}
      </div>

      {/* Account Password Creation (For First-Time Unauthenticated Customer Only) */}
      {!isAuthenticated ? (
        <div className="rounded-xs border border-line/80 bg-canvas-subtle/50 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <LockIcon size={16} className="text-accent" />
            <h3 className="text-sm font-semibold text-ink">
              {isHi ? "खाता पासवर्ड बनाएं (भविष्य के लॉगिन के लिए)" : "Create Account Password (For Future Logins)"}
            </h3>
          </div>
          <p className="mb-4 text-xs text-muted">
            {t.checkout.passwordPolicyHint}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Password */}
            <div>
              <label htmlFor="password" className="field-label">
                {t.checkout.password} <span className="text-accent">*</span>
              </label>
              <Input
                id="password"
                type="password"
                placeholder={t.checkout.passwordPlaceholder}
                value={formData.password || ""}
                onChange={(e) => onChange("password", e.target.value)}
                className={errors.password ? "border-danger" : ""}
              />
              {errors.password ? <p className="mt-1 text-xs text-danger">{errors.password}</p> : null}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="field-label">
                {t.checkout.confirmPassword} <span className="text-accent">*</span>
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t.checkout.confirmPasswordPlaceholder}
                value={formData.confirmPassword || ""}
                onChange={(e) => onChange("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-danger" : ""}
              />
              {errors.confirmPassword ? (
                <p className="mt-1 text-xs text-danger">{errors.confirmPassword}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Full Delivery Address */}
      <div>
        <label htmlFor="fullAddress" className="field-label">
          {t.checkout.address} <span className="text-accent">*</span>
        </label>
        <textarea
          id="fullAddress"
          rows={3}
          placeholder={
            isHi
              ? "दुकान / घर का नंबर, गली / इलाका, शहर, राज्य और पिन कोड..."
              : "House/Shop number, building, street, area, city, state and PIN code..."
          }
          value={formData.fullAddress}
          onChange={(e) => onChange("fullAddress", e.target.value)}
          className={`w-full rounded-xs border bg-canvas p-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none ${
            errors.fullAddress ? "border-danger" : "border-line"
          }`}
        />
        {errors.fullAddress ? (
          <p className="mt-1 text-xs text-danger">{errors.fullAddress}</p>
        ) : null}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="field-label">
          {t.checkout.notes}
        </label>
        <textarea
          id="notes"
          rows={2}
          placeholder={t.checkout.notesPlaceholder}
          value={formData.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
          className="w-full rounded-xs border border-line bg-canvas p-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
    </div>
  );
}
