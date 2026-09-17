"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, fieldAria } from "@/components/ui/FormField";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { collections } from "@/data/collections";
import { buildWhatsAppUrl, buildWholesaleEnquiryMessage, type WholesaleEnquiryDetails } from "@/lib/whatsapp";

type FormValues = Required<WholesaleEnquiryDetails>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  businessName: "",
  city: "",
  phone: "",
  gstin: "",
  interest: "All collections",
  message: "",
};

const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = "Enter your full name.";
  if (values.businessName.trim().length < 2) errors.businessName = "Enter your store or business name.";
  if (values.city.trim().length < 2) errors.city = "Enter the city your store is in.";

  const phoneDigits = values.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(phoneDigits)) errors.phone = "Enter a valid 10-digit Indian mobile number.";

  if (values.gstin.trim() && !GSTIN_PATTERN.test(values.gstin.trim().toUpperCase())) {
    errors.gstin = "Enter a valid 15-character GSTIN, or leave this blank.";
  }
  return errors;
}

function toWhatsAppUrl(values: FormValues): string {
  return buildWhatsAppUrl(
    buildWholesaleEnquiryMessage({
      ...values,
      gstin: values.gstin.trim().toUpperCase() || undefined,
      message: values.message.trim() || undefined,
    }),
  );
}

/**
 * Collects stockist details and opens WhatsApp with them pre-filled.
 * Nothing is submitted to a server.
 */
export function WholesaleEnquiryForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`enquiry-${firstInvalid}`)?.focus();
      return;
    }

    window.open(toWhatsAppUrl(values), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card card__body flex flex-col items-start gap-5" role="status">
        <span className="flex size-12 items-center justify-center rounded-full border border-line-strong text-accent-strong">
          <CheckIcon size={22} />
        </span>
        <h3 className="type-h3 text-ink">Your details are ready to send</h3>
        <p className="text-muted">
          WhatsApp has opened in a new tab with your details filled in. Press send there and our team will reply with
          current catalogues and wholesale terms.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            href={toWhatsAppUrl(values)}
            external
            leadingIcon={<WhatsAppIcon size={18} />}
          >
            Open WhatsApp again
          </Button>
          <Button variant="secondary" onClick={() => setSubmitted(false)}>
            Edit details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="card card__body flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="enquiry-name" label="Your name" required error={errors.name}>
          <Input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            required
            {...fieldAria("enquiry-name", { error: errors.name })}
          />
        </Field>
        <Field id="enquiry-businessName" label="Store / business name" required error={errors.businessName}>
          <Input
            id="enquiry-businessName"
            name="businessName"
            autoComplete="organization"
            value={values.businessName}
            onChange={(event) => update("businessName", event.target.value)}
            required
            {...fieldAria("enquiry-businessName", { error: errors.businessName })}
          />
        </Field>
        <Field id="enquiry-city" label="City" required error={errors.city}>
          <Input
            id="enquiry-city"
            name="city"
            autoComplete="address-level2"
            value={values.city}
            onChange={(event) => update("city", event.target.value)}
            required
            {...fieldAria("enquiry-city", { error: errors.city })}
          />
        </Field>
        <Field id="enquiry-phone" label="Mobile number" required error={errors.phone} hint="10-digit number, used for WhatsApp">
          <Input
            id="enquiry-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="98XXXXXXXX"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            required
            {...fieldAria("enquiry-phone", { error: errors.phone, hint: "10-digit number, used for WhatsApp" })}
          />
        </Field>
        <Field id="enquiry-gstin" label="GSTIN" error={errors.gstin} hint="Optional">
          <Input
            id="enquiry-gstin"
            name="gstin"
            autoCapitalize="characters"
            maxLength={15}
            value={values.gstin}
            onChange={(event) => update("gstin", event.target.value)}
            {...fieldAria("enquiry-gstin", { error: errors.gstin, hint: "Optional" })}
          />
        </Field>
        <Field id="enquiry-interest" label="Interested in">
          <Select
            id="enquiry-interest"
            name="interest"
            value={values.interest}
            onChange={(event) => update("interest", event.target.value)}
          >
            <option>All collections</option>
            {collections.map((collection) => (
              <option key={collection.slug}>{collection.name}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field id="enquiry-message" label="Message" hint="Tell us about your store, customers or the quantities you usually order.">
        <Textarea
          id="enquiry-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          {...fieldAria("enquiry-message", {
            hint: "Tell us about your store, customers or the quantities you usually order.",
          })}
        />
      </Field>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-subtle sm:max-w-xs">
          Submitting opens WhatsApp with these details filled in. Nothing is stored on our servers.
        </p>
        <Button type="submit" size="lg" leadingIcon={<WhatsAppIcon size={18} />}>
          Continue on WhatsApp
        </Button>
      </div>
    </form>
  );
}
