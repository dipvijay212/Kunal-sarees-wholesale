import type { Metadata } from "next";
import { businessSettings } from "@/data/business";
import { siteConfig } from "@/data/site";
import { formatPrice } from "@/lib/format";
import type { Category, Product } from "@/types";

/*
 * Shared SEO building blocks. Next.js merges metadata shallowly, so a page that sets
 * `openGraph` or `twitter` replaces the root object entirely — pageMetadata() always
 * returns the complete objects so no page loses its site name, locale or image.
 */

export const SITE_URL = siteConfig.url;
export const SITE_NAME = siteConfig.name;

export const DEFAULT_TITLE = "Kunal Sarees | Premium Wholesale Sarees in Surat";
/** Brand-level copy only. Anything naming products or categories is generated from live data below. */
export const DEFAULT_DESCRIPTION =
  "Kunal Sarees is a Surat-based wholesale saree supplier offering the latest saree designs at per-piece wholesale prices for boutiques, retailers and resellers across India.";

export const DEFAULT_OG_IMAGE = {
  url: siteConfig.brand.ogImage,
  width: 1200,
  height: 630,
  alt: "Kunal Sarees - Premium Wholesale Sarees",
};

export interface SeoImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

interface PageMetadataOptions {
  /** Page title; the root template appends " | Kunal Sarees" unless `absoluteTitle` is set. */
  title: string;
  description: string;
  /** Canonical path, e.g. `/products/some-saree`. */
  path: string;
  absoluteTitle?: boolean;
  images?: SeoImage[];
}

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Trims to a meta-description length at a word boundary. */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : cut.length).replace(/[,.;:\s]+$/, "")}…`;
}

export function pageMetadata({ title, description, path, absoluteTitle, images }: PageMetadataOptions): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      alternateLocale: ["hi_IN"],
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImages.map((image) => ({ url: image.url, alt: image.alt })),
    },
  };
}

/** For account, cart, checkout and admin screens. */
export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false },
};

/* -------------------------------------------------------------------------- */
/* Catalogue SEO — generated from backend product/category data               */
/* -------------------------------------------------------------------------- */

/** True for stock placeholder photos the adapters substitute when real media is missing. */
export function isPlaceholderImage(url: string | undefined): boolean {
  return !url || url.includes("images.unsplash.com");
}

export function productPath(product: Pick<Product, "slug">): string {
  return `/products/${product.slug}`;
}

/** Category listings live at /products?category=<slug> (see app/products/page.tsx). */
export function categoryPath(category: Pick<Category, "slug">): string {
  return `/products?category=${encodeURIComponent(category.slug)}`;
}

export function categoryDisplayName(category: Category): string {
  return category.name_en || category.name;
}

/** "Georgette" -> "Georgette Sarees"; names that already say saree are kept. */
function categoryHeading(category: Category): string {
  const name = categoryDisplayName(category);
  return /saree|साड़ी/i.test(name) ? name : `${name} Sarees`;
}

interface ResolvedSeo {
  title: string;
  absoluteTitle: boolean;
  description: string;
  path: string;
  images?: SeoImage[];
}

/**
 * Category page SEO. An admin-set SEO title/description wins; otherwise both are built
 * from the category and its live products (design count, starting price, MOQ).
 */
export function categorySeo(category: Category, products: Product[]): ResolvedSeo {
  const heading = categoryHeading(category);
  const inCategory = products.filter((product) => product.categoryId === category.id);

  let description = category.seoDescription;
  if (!description) {
    const facts: string[] = [];
    if (inCategory.length > 0) {
      const minPrice = Math.min(...inCategory.map((product) => product.price));
      const minMoq = Math.min(...inCategory.map((product) => product.moq));
      facts.push(
        `${inCategory.length} ${inCategory.length === 1 ? "design" : "designs"} from ${formatPrice(minPrice)} per piece, MOQ from ${minMoq} pieces.`,
      );
    }
    // Live facts first so they survive truncation; the category's own description follows.
    const intro = category.description_en && category.description_en !== category.name ? category.description_en : "";
    description = [`Wholesale ${heading.toLowerCase()} from ${SITE_NAME}, Surat.`, ...facts, intro].filter(Boolean).join(" ");
  }

  const seoTitle = category.seoTitle?.trim();
  const imageUrl = [category.image?.url, ...inCategory.map((product) => product.images[0]?.url)].find(
    (url) => !isPlaceholderImage(url),
  );

  return {
    title: seoTitle || `${heading} Wholesale`,
    // Admin titles that already include the brand are used as-is.
    absoluteTitle: Boolean(seoTitle && seoTitle.toLowerCase().includes(SITE_NAME.toLowerCase())),
    description: truncate(description),
    path: categoryPath(category),
    images: imageUrl ? [{ url: imageUrl, alt: `${heading} by ${SITE_NAME}` }] : undefined,
  };
}

/**
 * "georgette, satin and jacquard" from the live categories that currently have products,
 * or null when there are none. Names ending in "Sarees" are shortened so the caller can
 * write "... sarees" once.
 */
export function categoryListPhrase(categories: Category[], products: Product[], limit = 4): string | null {
  const names = categories
    .filter((category) => products.some((product) => product.categoryId === category.id))
    .map((category) => categoryDisplayName(category).toLowerCase().replace(/\s*sarees?$/, "").trim())
    .filter((name, index, all) => name && all.indexOf(name) === index)
    .slice(0, limit);
  if (names.length === 0) return null;
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];
}

/** Home page description naming the live categories that currently have products. */
export function homeDescription(categories: Category[], products: Product[]): string {
  const list = categoryListPhrase(categories, products);
  if (!list) return DEFAULT_DESCRIPTION;
  return truncate(
    `${SITE_NAME} is a Surat-based wholesale saree supplier offering ${list} sarees at per-piece wholesale prices for boutiques, retailers and resellers across India.`,
  );
}

/** Product page SEO, built entirely from the product record. */
export function productSeo(product: Product): ResolvedSeo {
  const name = product.name_en || product.name;
  const summary = product.shortDescription_en || product.shortDescription || product.description_en || product.description;
  const facts = `Wholesale ${formatPrice(product.price)} per piece, MOQ ${product.moq} pieces. Design code ${product.productCode}.`;
  const lead = summary && summary !== name ? `${truncate(summary, 150 - facts.length)} ` : "";
  const image = product.images.find((candidate) => !isPlaceholderImage(candidate.url));

  return {
    // The design code keeps titles unique when two designs share a name.
    title: `${name} (${product.productCode}) | Wholesale Saree`,
    absoluteTitle: false,
    description: `${lead}${facts}`,
    path: productPath(product),
    images: image
      ? [{ url: image.url, alt: image.alt || `${name} - wholesale saree by ${SITE_NAME}`, width: image.width, height: image.height }]
      : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                    */
/* -------------------------------------------------------------------------- */

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Business entity. Only confirmed details are published: data/business.ts marks the
 * street address, email, hours, GSTIN and social URLs as placeholders, so they are omitted.
 */
export function organizationJsonLd() {
  const { address, whatsappNumber } = businessSettings.contact;
  return {
    "@type": "WholesaleStore",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(siteConfig.brand.logo.src),
    image: absoluteUrl(siteConfig.brand.ogImage),
    description: DEFAULT_DESCRIPTION,
    telephone: `+${whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["hi-IN", "en-IN"],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Wraps one or more nodes in a single JSON-LD document. */
export function jsonLdGraph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Serialises JSON-LD for a <script> tag, escaping `<` to prevent script injection. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
