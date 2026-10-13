"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/** Drops admin portal page views so the dashboard reports storefront visitors only. */
function publicPagesOnly(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const { pathname } = new URL(event.url, window.location.origin);
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  } catch {
    // An unparseable URL is still a real visit; let it through.
  }
  return event;
}

/** Vercel Web Analytics for the public storefront. Sends nothing in development. */
export function VercelAnalytics() {
  return <Analytics beforeSend={publicPagesOnly} />;
}
