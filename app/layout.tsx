import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { SiteShell } from "@/components/layout/SiteShell";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { fetchBusinessSettings } from "@/lib/business-settings";
import { categoryRepository } from "@/lib/repositories";
import { UIProvider } from "@/components/providers/UIProvider";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, DEFAULT_TITLE, SITE_NAME, SITE_URL } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Kunal Sarees",
    "wholesale sarees",
    "saree wholesaler in Surat",
    "Surat saree supplier",
    "होलसेल साड़ियां",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN"],
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
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
  // Footer category links come from the backend (cached request shared with the pages).
  // Contact details, address and social links saved in Admin → Settings (database).
  const [categories, { settings, fromDatabase }] = await Promise.all([
    categoryRepository.fetchAll(),
    fetchBusinessSettings(),
  ]);
  const footerCategories = categories
    .slice(0, 6)
    .map(({ slug, name, name_en, name_hi }) => ({ slug, name, name_en, name_hi }));

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
        <SettingsProvider settings={settings} fromDatabase={fromDatabase}>
          <LanguageProvider initialLanguage={initialLang}>
            <UIProvider>
              <SiteShell footerCategories={footerCategories}>{children}</SiteShell>
            </UIProvider>
          </LanguageProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

