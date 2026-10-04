"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Footer, type FooterCategory } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { OrderListDrawer } from "@/components/order-list/OrderListDrawer";
import { SearchDialog } from "@/components/search/SearchDialog";
import { IntroAnimation } from "@/components/ui/IntroAnimation";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import { categoryRepository, productRepository } from "@/lib/repositories";

import { SmartAdminLauncher } from "@/components/layout/SmartAdminLauncher";

export function SiteShell({ children, footerCategories }: { children: React.ReactNode; footerCategories?: FooterCategory[] }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Load the live catalogue into the client stores once per visit. The order list,
  // header search and saved sarees resolve product ids against them.
  useEffect(() => {
    if (isAdmin) return;
    void productRepository.fetchAll();
    void categoryRepository.fetchAll();
  }, [isAdmin]);

  if (isAdmin) {
    return <main id="main-content" className="min-h-dvh flex-1">{children}</main>;
  }

  return (
    <>
      <SmartAdminLauncher />
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
