"use client";

import { usePathname } from "next/navigation";
import { Footer, type FooterCategory } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { OrderListDrawer } from "@/components/order-list/OrderListDrawer";
import { SearchDialog } from "@/components/search/SearchDialog";
import { IntroAnimation } from "@/components/ui/IntroAnimation";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";

export function SiteShell({ children, footerCategories }: { children: React.ReactNode; footerCategories?: FooterCategory[] }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main id="main-content" className="min-h-dvh flex-1">{children}</main>;
  }

  return (
    <>
      <IntroAnimation />
      <TopBar />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer categories={footerCategories} />
      <OrderListDrawer />
      <SearchDialog />
      <WhatsAppButton variant="floating" label={`Chat with ${siteConfig.name} on WhatsApp`} className="lg:hidden" />
    </>
  );
}
