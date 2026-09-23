/**
 * Static configuration, brand identity, and marketing copy.
 * Catalogue entities (products, categories, collections, orders) are served dynamically
 * by the backend REST API via lib/api.ts and lib/catalog.ts.
 */

export { banners } from "./banners";
export { businessSettings } from "./business";
export { FALLBACK_IMAGE_URL, LANDSCAPE, PORTRAIT, unsplashImage } from "./images";
export { formatAddress, getDirectionsUrl, siteConfig } from "./site";
export { footerQuickLinks, mainNavigation } from "./navigation";
export { orderingSteps, wholesaleHighlights } from "./home";
export { aboutStory, aboutValues } from "./about";
export { wholesaleAudiences, wholesaleFaqs, wholesaleTerms } from "./wholesale";
