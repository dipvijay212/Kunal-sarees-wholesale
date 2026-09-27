import type { NavItem } from "@/types";
import type { TranslationDictionary } from "@/lib/translations";

export const getMainNavigation = (t?: TranslationDictionary): NavItem[] => [
  { label: t ? t.nav.home : "होम", href: "/" },
  { label: t ? t.nav.sarees : "साड़ियां", href: "/products" },
  { label: t ? t.nav.categories : "कलेक्शन", href: "/collections" },
  { label: t ? t.nav.about : "हमारे बारे में", href: "/about" },
  { label: t ? t.nav.contact : "संपर्क", href: "/contact" },
];

export const getFooterQuickLinks = (t?: TranslationDictionary): NavItem[] => [
  { label: t ? t.nav.home : "होम", href: "/" },
  { label: t ? t.nav.sarees : "साड़ियां", href: "/products" },
  { label: t ? t.nav.categories : "कलेक्शन", href: "/collections" },
  { label: t ? t.wholesale.title : "होलसेल नियम", href: "/wholesale" },
  { label: t ? t.nav.about : "हमारे बारे में", href: "/about" },
  { label: t ? t.nav.contact : "संपर्क", href: "/contact" },
  { label: t ? t.nav.orderList : "ऑर्डर लिस्ट", href: "/order" },
  { label: t ? t.nav.wishlist : "पसंद की साड़ियां", href: "/wishlist" },
];

export const mainNavigation: NavItem[] = getMainNavigation();
export const footerQuickLinks: NavItem[] = getFooterQuickLinks();
