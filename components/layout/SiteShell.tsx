"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { OrderListDrawer } from "@/components/order-list/OrderListDrawer";
import { SearchDialog } from "@/components/search/SearchDialog";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main id="main-content" className="min-h-dvh flex-1">{children}</main>;
  }

  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <OrderListDrawer />
      <SearchDialog />
      <WhatsAppButton variant="floating" label={`Chat with ${siteConfig.name} on WhatsApp`} className="lg:hidden" />
    </>
  );
}
