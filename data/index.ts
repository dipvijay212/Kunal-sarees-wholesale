/**
 * Mock data layer. UI components never hardcode catalogue data — they read it
 * through the query helpers in lib/catalog.ts (products, categories,
 * collections, banners) and lib/crm.ts (customers, orders), which import the
 * raw arrays exported here.
 */

export { banners } from "./banners";
export { businessSettings } from "./business";
export { categories } from "./categories";
export { collections } from "./collections";
export { customers } from "./customers";
export { orders } from "./orders";
export { products } from "./products";
export { FALLBACK_IMAGE_URL, LANDSCAPE, PORTRAIT, unsplashImage } from "./images";
export { formatAddress, getDirectionsUrl, siteConfig } from "./site";
export { footerQuickLinks, mainNavigation } from "./navigation";
export { orderingSteps, wholesaleHighlights } from "./home";
export { aboutStory, aboutValues } from "./about";
export { wholesaleAudiences, wholesaleFaqs, wholesaleTerms } from "./wholesale";
