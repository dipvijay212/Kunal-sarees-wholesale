/** Kind of wholesale buyer. */
export type CustomerType = "boutique" | "retail-store" | "online-reseller" | "stylist";

export type CustomerTypeOption = "Retailer" | "Boutique" | "Distributor" | "Reseller" | "Other";

export interface Customer {
  id: string;
  businessName: string;
  contactName: string;
  type: CustomerType;
  phone: string;
  email?: string;
  city: string;
  state: string;
  gstin?: string;
  /** ISO date of the first order. */
  since: string;
  notes?: string;
}

export interface CheckoutFormData {
  fullName: string;
  businessName: string;
  customerType: CustomerTypeOption;
  whatsappNumber: string;
  mobileNumber: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  notes?: string;
}
