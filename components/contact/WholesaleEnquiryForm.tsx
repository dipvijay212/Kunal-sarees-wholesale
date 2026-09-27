"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, fieldAria } from "@/components/ui/FormField";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getCollections } from "@/lib/catalog";
import { buildWhatsAppUrl, buildWholesaleEnquiryMessage, type WholesaleEnquiryDetails } from "@/lib/whatsapp";
import { useLanguage } from "@/components/providers/LanguageProvider";

type FormValues = Required<WholesaleEnquiryDetails>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  businessName: "",
  city: "",
  phone: "",
  gstin: "",
  interest: "सभी कलेक्शन",
  message: "",
};

const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/**
 * Collects stockist details and opens WhatsApp with them pre-filled.
 * Nothing is submitted to a server.
 */
export function WholesaleEnquiryForm() {
  const { language } = useLanguage();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const isHi = language === "hi";

  const validate = (vals: FormValues): FormErrors => {
    const errs: FormErrors = {};
    if (vals.name.trim().length < 2) {
      errs.name = isHi ? "कृपया अपना नाम डालें।" : "Please enter your name.";
    }
    if (vals.businessName.trim().length < 2) {
      errs.businessName = isHi ? "कृपया अपनी दुकान या बिज़नेस का नाम डालें।" : "Please enter your shop or business name.";
    }
    if (vals.city.trim().length < 2) {
      errs.city = isHi ? "कृपया अपना शहर डालें।" : "Please enter your city.";
    }

    const phoneDigits = vals.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      errs.phone = isHi ? "कृपया 10 अंकों का सही मोबाइल नंबर डालें।" : "Please enter a valid 10-digit mobile number.";
    }

    if (vals.gstin.trim() && !GSTIN_PATTERN.test(vals.gstin.trim().toUpperCase())) {
      errs.gstin = isHi ? "कृपया सही 15 अक्षरों का GSTIN डालें या खाली छोड़ दें।" : "Please enter a valid 15-character GSTIN or leave empty.";
    }
    return errs;
  };

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const toWhatsAppUrl = (vals: FormValues): string => {
    return buildWhatsAppUrl(
      buildWholesaleEnquiryMessage({
        ...vals,
        gstin: vals.gstin.trim().toUpperCase() || undefined,
        message: vals.message.trim() || undefined,
      }),
    );
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
        <h3 className="type-h3 text-ink">
          {isHi ? "आपकी जानकारी WhatsApp पर भेजने के लिए तैयार है" : "Your Enquiry is Ready on WhatsApp"}
        </h3>
        <p className="text-muted">
          {isHi
            ? "WhatsApp नए टैब में खुल गया है। वहां भेजें बटन दबाएं और हमारी टीम आपको तुरंत कैटलॉग और होलसेल रेट्स भेजेगी।"
            : "WhatsApp opened in a new tab. Tap Send and our wholesale team will immediately send current catalog and wholesale pricing."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            href={toWhatsAppUrl(values)}
            external
            leadingIcon={<WhatsAppIcon size={18} />}
          >
            {isHi ? "WhatsApp दोबारा खोलें" : "Re-open WhatsApp"}
          </Button>
          <Button variant="secondary" onClick={() => setSubmitted(false)}>
            {isHi ? "जानकारी बदलें" : "Edit Details"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="card card__body flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="enquiry-name" label={isHi ? "आपका नाम" : "Your Name"} required error={errors.name}>
          <Input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            required
            placeholder={isHi ? "जैसे: रमेश पटेल" : "e.g. Ramesh Patel"}
            {...fieldAria("enquiry-name", { error: errors.name })}
          />
        </Field>
        <Field id="enquiry-businessName" label={isHi ? "दुकान / बिज़नेस का नाम" : "Shop / Business Name"} required error={errors.businessName}>
          <Input
            id="enquiry-businessName"
            name="businessName"
            autoComplete="organization"
            value={values.businessName}
            onChange={(event) => update("businessName", event.target.value)}
            required
            placeholder={isHi ? "जैसे: संगम साड़ी बुटीक" : "e.g. Sangam Saree Boutique"}
            {...fieldAria("enquiry-businessName", { error: errors.businessName })}
          />
        </Field>
        <Field id="enquiry-city" label={isHi ? "शहर" : "City"} required error={errors.city}>
          <Input
            id="enquiry-city"
            name="city"
            autoComplete="address-level2"
            value={values.city}
            onChange={(event) => update("city", event.target.value)}
            required
            placeholder={isHi ? "जैसे: अहमदाबाद, सूरत" : "e.g. Ahmedabad, Surat"}
            {...fieldAria("enquiry-city", { error: errors.city })}
          />
        </Field>
        <Field id="enquiry-phone" label={isHi ? "मोबाइल नंबर" : "Mobile / WhatsApp"} required error={errors.phone} hint={isHi ? "10 अंकों का WhatsApp नंबर" : "10-digit WhatsApp number"}>
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
            {...fieldAria("enquiry-phone", { error: errors.phone, hint: isHi ? "10 अंकों का WhatsApp नंबर" : "10-digit WhatsApp number" })}
          />
        </Field>
        <Field id="enquiry-gstin" label="GSTIN" error={errors.gstin} hint={isHi ? "वैकल्पिक" : "Optional"}>
          <Input
            id="enquiry-gstin"
            name="gstin"
            autoCapitalize="characters"
            maxLength={15}
            value={values.gstin}
            onChange={(event) => update("gstin", event.target.value)}
            placeholder="e.g. 24AAAAA0000A1Z5"
            {...fieldAria("enquiry-gstin", { error: errors.gstin, hint: isHi ? "वैकल्पिक" : "Optional" })}
          />
        </Field>
        <Field id="enquiry-interest" label={isHi ? "पसंदीदा कलेक्शन" : "Preferred Saree Type"}>
          <Select
            id="enquiry-interest"
            name="interest"
            value={values.interest}
            onChange={(event) => update("interest", event.target.value)}
          >
            <option>{isHi ? "सभी कलेक्शन" : "All Collections"}</option>
            {getCollections().map((collection) => (
              <option key={collection.slug}>{collection.name}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field id="enquiry-message" label={isHi ? "आपका मैसेज" : "Your Message / Query"} hint={isHi ? "अपनी दुकान, ग्राहकों या अनुमानित ऑर्डर के बारे में बताएं।" : "Tell us about your boutique, requirements or order volume."}>
        <Textarea
          id="enquiry-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder={isHi ? "जैसे: हमें अपनी दुकान के लिए नई सिल्क और बनारसी साड़ियों का कलेक्शन चाहिए..." : "e.g. Looking for Banarasi & Silk sarees for wedding season..."}
          {...fieldAria("enquiry-message", {
            hint: isHi ? "अपनी दुकान, ग्राहकों या अनुमानित ऑर्डर के बारे में बताएं।" : "Tell us about your boutique, requirements or order volume.",
          })}
        />
      </Field>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-subtle sm:max-w-xs">
          {isHi ? "क्लिक करने पर यह जानकारी सीधे WhatsApp पर खुल जाएगी।" : "Clicking will open this enquiry pre-filled on WhatsApp."}
        </p>
        <Button type="submit" size="lg" leadingIcon={<WhatsAppIcon size={18} />}>
          {isHi ? "WhatsApp पर भेजें" : "Send on WhatsApp"}
        </Button>
      </div>
    </form>
  );
}

