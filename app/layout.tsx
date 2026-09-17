import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { OrderListDrawer } from "@/components/order-list/OrderListDrawer";
import { UIProvider } from "@/components/providers/UIProvider";
import { SearchDialog } from "@/components/search/SearchDialog";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import "@/styles/globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-ks-display",
  display: "swap",
});

const sansFont = Manrope({
  subsets: ["latin"],
  variable: "--font-ks-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.positioning}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "wholesale sarees",
    "saree wholesaler",
    "Banarasi silk sarees wholesale",
    "Kanjivaram sarees wholesale",
    "bridal sarees wholesale",
    "Surat saree wholesale",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.positioning}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.brand.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.positioning}`,
    description: siteConfig.description,
    images: [siteConfig.brand.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#111416",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="flex min-h-dvh flex-col">
        {/* Hidden until focused with the keyboard. Styling sits on the inner span because
            `not-sr-only` resets padding on the element it is applied to. */}
        <a href="#main-content" className="sr-only fixed top-3 left-3 z-50 focus-visible:not-sr-only focus-visible:fixed">
          <span className="btn btn--primary btn--sm">Skip to content</span>
        </a>
        <UIProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <OrderListDrawer />
          <SearchDialog />
          {/* Desktop has WhatsApp in the header; this shortcut is for smaller screens. */}
          <WhatsAppButton variant="floating" label={`Chat with ${siteConfig.name} on WhatsApp`} className="lg:hidden" />
        </UIProvider>
      </body>
    </html>
  );
}
