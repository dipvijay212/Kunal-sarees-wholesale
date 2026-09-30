import type {
  Product,
  Category,
  Collection,
  PlacedOrder,
  Fabric,
  DesignType,
  ProductColor,
  ProductImage,
  ProductSpecifications,
} from '@/types';
import type {
  BackendProduct,
  BackendCategory,
  BackendCollection,
  BackendOrder,
} from './api';

const DEFAULT_IMAGE: ProductImage = {
  url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
  alt: 'Wholesale Saree',
  width: 1200,
  height: 1600,
};

const COLOR_MAP: Record<string, string> = {
  Wine: '#5b1a2a',
  'Deep Wine': '#5b1a2a',
  Maroon: '#5a1621',
  'Sindoor Red': '#8e1f24',
  Red: '#8e1f24',
  'Rani Pink': '#a11d5c',
  Pink: '#a11d5c',
  Emerald: '#1f4d3f',
  Green: '#1f4d3f',
  'Peacock Teal': '#1d5560',
  Teal: '#1d5560',
  'Midnight Navy': '#1b2440',
  Navy: '#1b2440',
  Blue: '#1b2440',
  Indigo: '#2e3d5c',
  'Antique Ochre': '#9a6b1f',
  Ochre: '#9a6b1f',
  Mustard: '#b8860b',
  Yellow: '#b8860b',
  Ivory: '#ede6d6',
  'Champagne Gold': '#cdb58a',
  Gold: '#cdb58a',
  Blush: '#d9b8b0',
  Mauve: '#9c6f7c',
  Sage: '#a8b5a0',
  Pistachio: '#b7be9a',
  'Powder Blue': '#b9cad6',
  'Onyx Black': '#17181b',
  Black: '#17181b',
  Plum: '#4a2440',
  'Silver Grey': '#9aa3aa',
  Silver: '#9aa3aa',
  Rust: '#9c4a25',
  Lavender: '#9a8cc0',
};

function parseColors(colorStr: string | null): ProductColor[] {
  if (!colorStr || !colorStr.trim()) {
    return [{ name: 'Standard Red', hex: '#8e1f24' }];
  }
  return colorStr.split(',').map((c) => {
    const name = c.trim();
    const hex = COLOR_MAP[name] || '#6e1f2a';
    return { name, hex };
  });
}

function deriveSpecifications(product: BackendProduct): ProductSpecifications {
  const fabric = product.fabric || 'Banarasi Silk';
  const isSilk = fabric.toLowerCase().includes('silk');
  const isCotton = fabric.toLowerCase().includes('cotton');

  const desc = product.description_en || product.description || '';
  const sareeCutMatch = desc.match(/Saree Cut:\s*([^|\n]+)/i);
  const blouseMatch = desc.match(/Blouse:\s*([^|\n]+)/i);

  return {
    sareeLength: sareeCutMatch ? sareeCutMatch[1].trim() : (isSilk ? '5.5 m + 0.8 m blouse piece' : '5.50 Meters'),
    blousePiece: blouseMatch ? blouseMatch[1].trim() : '0.80 Mtr Unstitched',
    weight: isSilk ? 'Approx. 750 g' : isCotton ? 'Approx. 500 g' : 'Approx. 450 g',
    washCare: isSilk ? 'Dry clean only' : isCotton ? 'Gentle hand wash in cold water' : 'Dry clean recommended',
    origin: isSilk ? 'Varanasi / Kanchipuram' : 'Surat, Gujarat',
  };
}

/**
 * Admin uploads store the photo's file name as alt text (e.g. "IMG_20240512_101522"
 * or "WhatsApp Image 2024-05-12 at 10.15.22"). Those are replaced with a descriptive
 * "<product name> - view N" so screen readers and image search get meaningful text.
 */
function productImageAlt(altText: string | null | undefined, productName: string, index: number): string {
  const alt = altText?.trim();
  const looksLikeFileName =
    !alt ||
    /^(img|dsc|pxl|image|photo|screenshot|whatsapp image|wa\d)[\s_-]*\d/i.test(alt) ||
    /\d{8}|\d{4}-\d{2}-\d{2}|_/.test(alt) ||
    /^[\d\s._-]+$/.test(alt);
  if (!looksLikeFileName) return alt;
  const label = /saree|साड़ी/i.test(productName) ? productName : `${productName} saree`;
  return index === 0 ? label : `${label} - view ${index + 1}`;
}

export function adaptProduct(backend: BackendProduct): Product {
  const colorString = backend.color_en || backend.color || 'Red';
  const colors = parseColors(colorString);

  // Sort images strictly by displayOrder so the primary cover image is guaranteed to be at index 0
  const images: ProductImage[] =
    backend.images && backend.images.length > 0
      ? backend.images
          .slice()
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((img, index) => ({
            url: img.imageUrl,
            alt: productImageAlt(img.altText, backend.name_en || backend.nameEn || backend.name, index),
            width: 1200,
            height: 1600,
          }))
      : [DEFAULT_IMAGE];

  // Parse multiple video URLs (supports JSON array string, array, or comma/newline separated URLs)
  let videoUrls: string[] = [];
  const rawVideo = backend.videoUrls || backend.videoUrl || backend.video_url;
  if (Array.isArray(rawVideo)) {
    videoUrls = rawVideo.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
  } else if (rawVideo && typeof rawVideo === 'string') {
    const trimmed = rawVideo.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          videoUrls = parsed.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
        }
      } catch {
        videoUrls = [trimmed];
      }
    } else if (trimmed.includes('\n')) {
      videoUrls = trimmed.split('\n').map((u) => u.trim()).filter(Boolean);
    } else if (trimmed.includes(',')) {
      videoUrls = trimmed.split(',').map((u) => u.trim()).filter(Boolean);
    } else {
      videoUrls = [trimmed];
    }
  }
  const primaryVideoUrl = videoUrls[0] || (typeof rawVideo === 'string' ? rawVideo : undefined);

  const categoryId = backend.categoryId ? `cat-${backend.categoryId}` : 'cat-silk';
  const collectionId = categoryId;

  const price = typeof backend.price === 'string' ? parseFloat(backend.price) : backend.price;

  // Database content is English only. The *_hi fields mirror the English values, so
  // Hindi mode shows the same product data; only the site's built-in text is translated.
  const displayName = backend.name_en || backend.nameEn || backend.name || 'Saree';
  const nameEn = displayName;
  const nameHi = displayName;

  const displayDesc = backend.description_en || backend.descriptionEn || backend.description || displayName;
  const descEn = displayDesc;
  const descHi = displayDesc;

  const displayShort = backend.short_description_en || backend.shortDescriptionEn || backend.shortDescription || displayDesc;
  const shortEn = displayShort;
  const shortHi = displayShort;

  const displayFabric = backend.fabric_en || backend.fabricEn || backend.fabric || '';
  const fabricEn = displayFabric;
  const fabricHi = displayFabric;

  const colorEn = backend.color_en || backend.colorEn || backend.color || '';
  const colorHi = colorEn;

  // Extract design if noted in description or fallback
  const designMatch = displayDesc.match(/(?:Work|Design|काम):\s*([^|\n]+)/i);
  const designVal = designMatch ? designMatch[1].trim() : 'Zari Weave';

  return {
    id: `prd-${backend.id}`,
    productCode: backend.productCode,
    name: displayName,
    name_en: nameEn,
    name_hi: nameHi,
    slug: backend.slug,
    description: displayDesc,
    description_en: descEn,
    description_hi: descHi,
    shortDescription: displayShort,
    shortDescription_en: shortEn,
    shortDescription_hi: shortHi,
    categoryId,
    collectionId,
    fabric: displayFabric,
    fabric_en: fabricEn,
    fabric_hi: fabricHi,
    color_en: colorEn,
    color_hi: colorHi,
    design: designVal as DesignType,
    price,
    moq: backend.minimumOrderQuantity || 2,
    orderMultiple: backend.minimumOrderQuantity || 1,
    stock: backend.stockQuantity ?? 50,
    colors,
    images,
    videoUrl: primaryVideoUrl,
    videoUrls,
    variants: colors.map((col, idx) => ({
      id: `var-${backend.id}-${idx}`,
      productId: `prd-${backend.id}`,
      variantCode: `${backend.productCode}-${col.name.slice(0, 3).toUpperCase()}`,
      color: col,
      stock: Math.floor((backend.stockQuantity || 50) / colors.length),
      price,
    })),
    specifications: deriveSpecifications(backend),
    // Built on the product page from real fields, in the visitor's site language.
    highlights: [],
    featured: Boolean(backend.isFeatured),
    newArrival: Boolean(backend.isNew),
    status: backend.isAvailable ? 'active' : 'draft',
    createdAt: backend.createdAt || new Date().toISOString(),
  };
}

const CATEGORY_IMAGES: Record<string, string> = {
  'banarasi-sarees': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
  'silk-sarees': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
  'georgette-sarees': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85',
  'organza-sarees': 'https://images.unsplash.com/photo-1610030469850-8b0d2a8ec490?auto=format&fit=crop&w=1200&q=85',
  'cotton-sarees': 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=1200&q=85',
  'bridal-sarees': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
  'chiffon-sarees': 'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=1200&q=85',
  'embroidered-sarees': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=85',
  'party-wear': 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=85',
  'printed-sarees': 'https://images.unsplash.com/photo-1610030469668-93530c27b5ae?auto=format&fit=crop&w=1200&q=85',
};

export function adaptCategory(backend: BackendCategory, index = 0): Category {
  const imageUrl =
    backend.imageUrl ||
    backend.image ||
    CATEGORY_IMAGES[backend.slug] ||
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85';

  // English only (see adaptProduct); *_hi mirrors the English value.
  const displayName = backend.name_en || backend.nameEn || backend.name || 'Sarees';
  const nameEn = displayName;
  const nameHi = displayName;

  // No generated fallback: cards hide the description line when the admin hasn't written one.
  const displayDesc = backend.description_en || backend.descriptionEn || backend.description || "";
  const descEn = displayDesc || undefined;
  const descHi = descEn;

  return {
    id: `cat-${backend.id}`,
    name: displayName,
    name_en: nameEn ?? undefined,
    name_hi: nameHi ?? undefined,
    slug: backend.slug,
    description: displayDesc,
    description_en: descEn,
    description_hi: descHi,
    image: {
      url: imageUrl,
      alt: displayName,
      width: 1200,
      height: 800,
    },
    seoTitle: backend.seoTitle?.trim() || undefined,
    seoDescription: backend.seoDescription?.trim() || undefined,
    featured: (backend.productCount ?? 0) > 0 || index < 6,
    order: index + 1,
  };
}

export function adaptCollection(backend: BackendCollection, index = 0): Collection {
  const displayName = backend.name_en || backend.nameEn || backend.name || 'Collection';
  const nameEn = displayName;
  const nameHi = displayName;

  const displayDesc = backend.description_en || backend.descriptionEn || backend.description || "";
  const descEn = displayDesc || undefined;
  const descHi = descEn;

  return {
    id: `col-${backend.id}`,
    name: displayName,
    name_en: nameEn ?? undefined,
    name_hi: nameHi ?? undefined,
    slug: backend.slug,
    tagline: displayDesc ? displayDesc.slice(0, 45) : '',
    description: displayDesc,
    description_en: descEn,
    description_hi: descHi,
    image: {
      url: backend.image || 'https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=1200&q=85',
      alt: displayName,
      width: 1200,
      height: 800,
    },
    featured: index < 6,
    order: index + 1,
  };
}

export function adaptOrder(backend: BackendOrder): PlacedOrder {
  const subtotal = typeof backend.subtotal === 'string' ? parseFloat(backend.subtotal) : backend.subtotal;
  const totalAmount = typeof backend.totalAmount === 'string' ? parseFloat(backend.totalAmount) : backend.totalAmount;

  return {
    id: `ord-${backend.id}`,
    orderNumber: backend.orderNumber,
    customerDetails: {
      fullName: backend.customerNameSnapshot || backend.customerName || '',
      businessName: backend.businessNameSnapshot || backend.businessName || '',
      customerType: 'Retailer',
      whatsappNumber: backend.whatsappNumberSnapshot || backend.whatsappNumber || '',
      mobileNumber: backend.phoneSnapshot || backend.phone || '',
      city: backend.citySnapshot || backend.city || '',
      state: backend.stateSnapshot || backend.state || '',
      pincode: backend.pincodeSnapshot || backend.pincode || '',
      fullAddress: backend.addressSnapshot || backend.address || '',
      notes: backend.notes || '',
    },

    items: (backend.items || []).map((item) => {
      const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
      const itemSubtotal = typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal;
      const displayName = item.productNameEn || item.productName || 'Saree';
      return {
        productId: `prd-${item.productId}`,
        productCode: item.productCode,
        productName: displayName,
        productNameEn: item.productNameEn || undefined,
        productNameHi: item.productNameHi || undefined,
        quantity: item.quantity,
        price: unitPrice,
        lineTotal: itemSubtotal,
      };
    }),
    summary: {
      designCount: backend.items ? backend.items.length : 1,
      totalPieces: backend.totalItems,
      estimatedValue: totalAmount || subtotal,
    },
    placedAt: backend.createdAt,
    whatsappUrl: '',
  };
}
