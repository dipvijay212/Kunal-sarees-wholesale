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

  const desc = product.description || product.description_en || product.description_hi || '';
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

export function adaptProduct(backend: BackendProduct): Product {
  const colorString = backend.color_en || backend.color || backend.color_hi || 'Red';
  const colors = parseColors(colorString);

  // Sort images strictly by displayOrder so the primary cover image is guaranteed to be at index 0
  const images: ProductImage[] =
    backend.images && backend.images.length > 0
      ? backend.images
          .slice()
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((img) => ({
            url: img.imageUrl,
            alt: img.altText || backend.name_hi || backend.name,
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

  const displayName = backend.name_hi || backend.nameHi || backend.name || backend.name_en || backend.nameEn || 'साड़ी';
  const nameEn = backend.name_en || backend.nameEn || backend.name;
  const nameHi = backend.name_hi || backend.nameHi || backend.name;

  const displayDesc = backend.description_hi || backend.descriptionHi || backend.description || backend.description_en || backend.descriptionEn || displayName;
  const descEn = backend.description_en || backend.descriptionEn || backend.description || displayName;
  const descHi = backend.description_hi || backend.descriptionHi || backend.description || displayName;

  const displayShort = backend.short_description_hi || backend.shortDescriptionHi || backend.shortDescription || backend.short_description_en || backend.shortDescriptionEn || displayDesc;
  const shortEn = backend.short_description_en || backend.shortDescriptionEn || backend.shortDescription || displayDesc;
  const shortHi = backend.short_description_hi || backend.shortDescriptionHi || backend.shortDescription || displayDesc;

  const displayFabric = backend.fabric_hi || backend.fabricHi || backend.fabric || backend.fabric_en || backend.fabricEn || 'बनारसी सिल्क';
  const fabricEn = backend.fabric_en || backend.fabricEn || backend.fabric || 'Banarasi Silk';
  const fabricHi = backend.fabric_hi || backend.fabricHi || backend.fabric || 'बनारसी सिल्क';

  const colorEn = backend.color_en || backend.colorEn || backend.color || 'Red';
  const colorHi = backend.color_hi || backend.colorHi || backend.color || 'लाल';

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
    highlights: [
      displayFabric ? `प्रीमियम ${displayFabric}` : 'प्रीमियम हैंडलूम',
      'बारीक जरी बॉर्डर और शानदार फिनिशिंग',
      `सूरत डायरेक्ट होलसेल कम से कम ऑर्डर: ${backend.minimumOrderQuantity} पीस`,
    ],
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

  const displayName = backend.name || backend.name_en || backend.nameEn || backend.name_hi || backend.nameHi || 'साड़ी';
  const nameEn = backend.name_en || backend.nameEn || backend.name;
  const nameHi = backend.name_hi || backend.nameHi || backend.name;

  const displayDesc = backend.description || backend.description_en || backend.descriptionEn || backend.description_hi || backend.descriptionHi || `प्रीमियम होलसेल ${displayName} साड़ियों का खूबसूरत कलेक्शन।`;
  const descEn = (backend.description_en || backend.descriptionEn || backend.description) ?? undefined;
  const descHi = (backend.description_hi || backend.descriptionHi || backend.description) ?? undefined;

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
    featured: (backend.productCount ?? 0) > 0 || index < 6,
    order: index + 1,
  };
}

export function adaptCollection(backend: BackendCollection, index = 0): Collection {
  const displayName = backend.name_hi || backend.nameHi || backend.name || backend.name_en || backend.nameEn || 'कलेक्शन';
  const nameEn = backend.name_en || backend.nameEn || backend.name;
  const nameHi = backend.name_hi || backend.nameHi || backend.name;

  const displayDesc = backend.description_hi || backend.descriptionHi || backend.description || backend.description_en || backend.descriptionEn || `खास ${displayName} होलसेल साड़ियां।`;
  const descEn = (backend.description_en || backend.descriptionEn || backend.description) ?? undefined;
  const descHi = (backend.description_hi || backend.descriptionHi || backend.description) ?? undefined;

  return {
    id: `col-${backend.id}`,
    name: displayName,
    name_en: nameEn ?? undefined,
    name_hi: nameHi ?? undefined,
    slug: backend.slug,
    tagline: displayDesc ? displayDesc.slice(0, 45) : 'सूरत डायरेक्ट होलसेल',
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
      const displayName = item.productNameHi || item.productName || item.productNameEn || 'साड़ी';
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
