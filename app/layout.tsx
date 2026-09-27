import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { SiteShell } from "@/components/layout/SiteShell";
import { UIProvider } from "@/components/providers/UIProvider";
import { siteConfig } from "@/data/site";
import type { Language } from "@/lib/translations";
import "@/styles/globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
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
    default: "Kunal Sarees | सूरत डायरेक्ट होलसेल साड़ियां",
    template: "%s | Kunal Sarees",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Kunal Sarees",
    "होलसेल साड़ियां",
    "सूरत साड़ी होलसेलर",
    "बनारसी सिल्क साड़ी होलसेल",
    "कांजीवरम साड़ी",
    "ब्राइडल साड़ियां",
    "सूरत साड़ी थोक बाजार",
  ],
  openGraph: {
    type: "website",
    locale: "hi_IN",
    siteName: siteConfig.name,
    title: "Kunal Sarees | सूरत डायरेक्ट होलसेल साड़ियां",
    description: siteConfig.description,
    images: [{ url: siteConfig.brand.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kunal Sarees | सूरत डायरेक्ट होलसेल साड़ियां",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("kunal_lang")?.value;
  const initialLang: Language = (langCookie === "en" || langCookie === "hi") ? (langCookie as Language) : "hi";

  return (
    <html lang={initialLang} className={`${displayFont.variable} ${sansFont.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700;800&family=Noto+Serif+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-dvh w-full max-w-full flex-col overflow-x-hidden bg-canvas text-ink antialiased">
        <LanguageProvider initialLanguage={initialLang}>
          <UIProvider>
            <SiteShell>{children}</SiteShell>
          </UIProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

