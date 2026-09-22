import type { NavItem } from "@/types";

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "All Sarees", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerQuickLinks: NavItem[] = [
  { label: "Full catalogue", href: "/products" },
  { label: "New arrivals", href: "/new-arrivals" },
  { label: "Wholesale terms", href: "/wholesale" },
  { label: "Become a stockist", href: "/wholesale#enquiry" },
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Order list", href: "/order" },
  { label: "Saved designs", href: "/wishlist" },
];
