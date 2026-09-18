import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { OrderListDrawer } from "@/components/order-list/OrderListDrawer";
import { UIProvider } from "@/components/providers/UIProvider";
import { SearchDialog } from "@/components/search/SearchDialog";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import "@/styles/globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-ks-display",
  display: "swap",
});

const sansFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ks-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Kunal Sarees | Premium Wholesale Sarees",
    template: "%s | Kunal Sarees",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Kunal Sarees",
    "wholesale sarees",
    "saree wholesaler Surat",
    "Banarasi silk sarees wholesale",
    "Kanjivaram sarees wholesale",
    "bridal sarees wholesale",
    "B2B saree supplier India",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: "Kunal Sarees | Premium Wholesale Sarees",
    description: siteConfig.description,
    images: [{ url: siteConfig.brand.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kunal Sarees | Premium Wholesale Sarees",
    description: siteConfig.description,
    images: [siteConfig.brand.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF5EE",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="flex min-h-dvh flex-col bg-canvas text-ink antialiased">
        {/* Hidden until focused with the keyboard */}
        <a href="#main-content" className="sr-only fixed top-3 left-3 z-50 focus-visible:not-sr-only focus-visible:fixed">
          <span className="btn btn--primary btn--sm">Skip to content</span>
        </a>
        <UIProvider>
          <TopBar />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <OrderListDrawer />
          <SearchDialog />
          {/* Mobile floating WhatsApp shortcut */}
          <WhatsAppButton variant="floating" label={`Chat with ${siteConfig.name} on WhatsApp`} className="lg:hidden" />
        </UIProvider>
      </body>
    </html>
  );
}

