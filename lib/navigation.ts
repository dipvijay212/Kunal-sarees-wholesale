import type { NavItem } from "@/types";

/**
 * Returns the href of the navigation item that best matches the current path.
 * The longest matching prefix wins, so `/collections/bridal-couture` activates
 * "Bridal" rather than "Collections".
 */
export function getActiveHref(pathname: string, items: NavItem[]): string | null {
  let active: string | null = null;
  let bestLength = -1;

  for (const item of items) {
    const path = item.href.split("?")[0];
    const matches = pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
    if (matches && path.length > bestLength) {
      active = item.href;
      bestLength = path.length;
    }
  }

  return active;
}
