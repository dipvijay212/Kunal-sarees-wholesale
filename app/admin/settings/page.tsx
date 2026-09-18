"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import { adminSettingsStore, updateAdminSettings } from "@/lib/admin-stores";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const settings = useLocalStore(adminSettingsStore);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    businessName: settings.businessName,
    whatsappNumber: settings.contact.whatsappNumber,
    phoneDisplay: settings.contact.phoneDisplay,
    email: settings.contact.email,
    lines: settings.contact.address.lines.join("\n"),
    city: settings.contact.address.city,
    region: settings.contact.address.region,
    postalCode: settings.contact.address.postalCode,
    hoursWeekday: settings.contact.hours[0]?.hours || "10:00 AM – 7:30 PM",
    hoursSunday: settings.contact.hours[1]?.hours || "By appointment",
    instagram: settings.social.find((s) => s.platform === "instagram")?.href || "",
    facebook: settings.social.find((s) => s.platform === "facebook")?.href || "",
    youtube: settings.social.find((s) => s.platform === "youtube")?.href || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateAdminSettings({
      businessName: form.businessName,
      contact: {
        whatsappNumber: form.whatsappNumber,
        phoneDisplay: form.phoneDisplay,
        email: form.email,
        phoneHref: `tel:+${form.whatsappNumber}`,
        address: {
          lines: form.lines.split("\n").filter(Boolean),
          city: form.city,
          region: form.region,
          postalCode: form.postalCode,
          country: "India",
        },
        hours: [
          { days: "Monday – Saturday", hours: form.hoursWeekday },
          { days: "Sunday", hours: form.hoursSunday },
        ],
      },
      social: [
        { platform: "instagram", label: "Instagram", href: form.instagram },
        { platform: "facebook", label: "Facebook", href: form.facebook },
        { platform: "youtube", label: "YouTube", href: form.youtube },
      ],
    });

    setSuccessMessage("Business & Store settings saved successfully!");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <AdminLayout title="Business Settings">
      <div className="border-b border-line pb-5">
        <h2 className="type-h4 text-ink font-serif">Store Configuration & Identity</h2>
        <p className="text-xs text-muted">Manage contact channels, WhatsApp enquiry routing, store address and hours.</p>
      </div>

      {successMessage ? (
        <div className="mt-4 rounded-xs border border-success/30 bg-success/10 p-3 text-xs font-semibold text-success">
          ✓ {successMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-w-3xl">
        {/* Business Identity */}
        <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs">
          <h3 className="type-h4 text-ink font-serif border-b border-line pb-3">Business Identity</h3>
          <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
            <div>
              <label className="font-semibold text-ink block">Business Name</label>
              <input
                type="text"
                required
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-ink block">Support Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs">
          <h3 className="type-h4 text-ink font-serif border-b border-line pb-3">WhatsApp & Phone Setup</h3>
          <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
            <div>
              <label className="font-semibold text-ink block">WhatsApp Number (with Country Code) *</label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm font-mono text-ink focus:border-accent focus:outline-none"
              />
              <span className="text-[0.625rem] text-muted">All checkout orders hand off to this wa.me number.</span>
            </div>

            <div>
              <label className="font-semibold text-ink block">Display Phone Number</label>
              <input
                type="text"
                required
                value={form.phoneDisplay}
                onChange={(e) => setForm({ ...form, phoneDisplay: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Store Address */}
        <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs">
          <h3 className="type-h4 text-ink font-serif border-b border-line pb-3">Showroom Address</h3>
          <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="font-semibold text-ink block">Address Lines (one per line)</label>
              <textarea
                rows={2}
                value={form.lines}
                onChange={(e) => setForm({ ...form, lines: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-ink block">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-ink block">State / Region</label>
              <input
                type="text"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-ink block">Postal Code</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Business Hours & Social */}
        <div className="rounded-xs border border-line bg-canvas p-6 shadow-xs">
          <h3 className="type-h4 text-ink font-serif border-b border-line pb-3">Business Hours & Social Links</h3>
          <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
            <div>
              <label className="font-semibold text-ink block">Monday – Saturday Hours</label>
              <input
                type="text"
                value={form.hoursWeekday}
                onChange={(e) => setForm({ ...form, hoursWeekday: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-ink block">Sunday Hours</label>
              <input
                type="text"
                value={form.hoursSunday}
                onChange={(e) => setForm({ ...form, hoursSunday: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-ink block">Instagram URL</label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-ink block">Facebook URL</label>
              <input
                type="text"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Save Admin Settings
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
