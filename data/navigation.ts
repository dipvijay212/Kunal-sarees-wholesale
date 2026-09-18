import type { NavItem } from "@/types";

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Wholesale", href: "/wholesale" },
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
