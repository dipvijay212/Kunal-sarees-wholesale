"use client";

import { Input, Select } from "@/components/ui/FormField";
import type { CheckoutFormData, CustomerTypeOption } from "@/types";

interface CheckoutFormProps {
  formData: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
}

const CUSTOMER_TYPES: CustomerTypeOption[] = [
  "Retailer",
  "Boutique",
  "Distributor",
  "Reseller",
  "Other",
];

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

export function CheckoutForm({ formData, onChange, errors }: CheckoutFormProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xs border border-line bg-canvas p-6 sm:p-8">
      <div>
        <h2 className="type-h3 text-ink">Boutique & Retailer Details</h2>
        <p className="mt-1 text-xs text-muted">
          Please provide your wholesale store details so our team can process your enquiry and issue accurate pricing.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="field-label">
            Full Name <span className="text-accent">*</span>
          </label>
          <Input
            id="fullName"
            type="text"
            placeholder="e.g. Rahul Patel"
            value={formData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className={errors.fullName ? "border-danger" : ""}
          />
          {errors.fullName ? <p className="mt-1 text-xs text-danger">{errors.fullName}</p> : null}
        </div>

        {/* Business / Shop Name */}
        <div>
          <label htmlFor="businessName" className="field-label">
            Business / Shop Name <span className="text-accent">*</span>
          </label>
          <Input
            id="businessName"
            type="text"
            placeholder="e.g. Rahul Sarees & Fashions"
            value={formData.businessName}
            onChange={(e) => onChange("businessName", e.target.value)}
            className={errors.businessName ? "border-danger" : ""}
          />
          {errors.businessName ? <p className="mt-1 text-xs text-danger">{errors.businessName}</p> : null}
        </div>
      </div>

      {/* Customer Type */}
      <div>
        <label htmlFor="customerType" className="field-label">
          Customer Type <span className="text-accent">*</span>
        </label>
        <Select
          id="customerType"
          value={formData.customerType}
          onChange={(e) => onChange("customerType", e.target.value as CustomerTypeOption)}
          className={errors.customerType ? "border-danger" : ""}
        >
          {CUSTOMER_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        {errors.customerType ? <p className="mt-1 text-xs text-danger">{errors.customerType}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* WhatsApp Number */}
        <div>
          <label htmlFor="whatsappNumber" className="field-label">
            WhatsApp Number <span className="text-accent">*</span>
          </label>
          <Input
            id="whatsappNumber"
            type="tel"
            placeholder="e.g. 9876543210"
            value={formData.whatsappNumber}
            onChange={(e) => onChange("whatsappNumber", e.target.value)}
            className={errors.whatsappNumber ? "border-danger" : ""}
          />
          {errors.whatsappNumber ? <p className="mt-1 text-xs text-danger">{errors.whatsappNumber}</p> : null}
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobileNumber" className="field-label">
            Mobile Number <span className="text-accent">*</span>
          </label>
          <Input
            id="mobileNumber"
            type="tel"
            placeholder="e.g. 9876543210"
            value={formData.mobileNumber}
            onChange={(e) => onChange("mobileNumber", e.target.value)}
            className={errors.mobileNumber ? "border-danger" : ""}
          />
          {errors.mobileNumber ? <p className="mt-1 text-xs text-danger">{errors.mobileNumber}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {/* City */}
        <div>
          <label htmlFor="city" className="field-label">
            City <span className="text-accent">*</span>
          </label>
          <Input
            id="city"
            type="text"
            placeholder="e.g. Ahmedabad"
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            className={errors.city ? "border-danger" : ""}
          />
          {errors.city ? <p className="mt-1 text-xs text-danger">{errors.city}</p> : null}
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="field-label">
            State <span className="text-accent">*</span>
          </label>
          <Select
            id="state"
            value={formData.state}
            onChange={(e) => onChange("state", e.target.value)}
            className={errors.state ? "border-danger" : ""}
          >
            <option value="">Select State</option>
            {STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
          {errors.state ? <p className="mt-1 text-xs text-danger">{errors.state}</p> : null}
        </div>

        {/* Pincode */}
        <div>
          <label htmlFor="pincode" className="field-label">
            Pincode <span className="text-accent">*</span>
          </label>
          <Input
            id="pincode"
            type="text"
            maxLength={6}
            placeholder="e.g. 380001"
            value={formData.pincode}
            onChange={(e) => onChange("pincode", e.target.value)}
            className={errors.pincode ? "border-danger" : ""}
          />
          {errors.pincode ? <p className="mt-1 text-xs text-danger">{errors.pincode}</p> : null}
        </div>
      </div>

      {/* Full Address */}
      <div>
        <label htmlFor="fullAddress" className="field-label">
          Full Address <span className="text-accent">*</span>
        </label>
        <textarea
          id="fullAddress"
          rows={3}
          placeholder="Shop / Building No., Street, Landmark, Area..."
          value={formData.fullAddress}
          onChange={(e) => onChange("fullAddress", e.target.value)}
          className={`input w-full py-2.5 ${errors.fullAddress ? "border-danger" : ""}`}
        />
        {errors.fullAddress ? <p className="mt-1 text-xs text-danger">{errors.fullAddress}</p> : null}
      </div>

      {/* Order Notes */}
      <div>
        <label htmlFor="notes" className="field-label">
          Order Notes <span className="text-subtle">(Optional)</span>
        </label>
        <textarea
          id="notes"
          rows={2}
          placeholder="Please confirm availability and final pricing."
          value={formData.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          className="input w-full py-2"
        />
      </div>
    </div>
  );
}
