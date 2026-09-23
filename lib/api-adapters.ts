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

  return {
    sareeLength: '5.5 m + 0.8 m blouse piece',
    blousePiece: '0.8 m, unstitched',
    weight: isSilk ? 'Approx. 750 g' : isCotton ? 'Approx. 500 g' : 'Approx. 450 g',
    washCare: isSilk ? 'Dry clean only' : isCotton ? 'Gentle hand wash in cold water' : 'Dry clean recommended',
    origin: isSilk ? 'Varanasi / Kanchipuram' : 'Surat, Gujarat',
  };
}

export function adaptProduct(backend: BackendProduct): Product {
  const colors = parseColors(backend.color);
  const images: ProductImage[] =
    backend.images && backend.images.length > 0
      ? backend.images.map((img) => ({
          url: img.imageUrl,
          alt: img.altText || backend.name,
          width: 1200,
          height: 1600,
        }))
      : [DEFAULT_IMAGE];

  const primaryCollection = backend.collections && backend.collections[0];
  const collectionId = primaryCollection ? `col-${primaryCollection.id}` : 'col-silk';
  const categoryId = backend.categoryId ? `cat-${backend.categoryId}` : 'cat-silk';

  const price = typeof backend.price === 'string' ? parseFloat(backend.price) : backend.price;

  return {
    id: `prd-${backend.id}`,
    productCode: backend.productCode,
    name: backend.name,
    slug: backend.slug,
    description: backend.description || backend.shortDescription || backend.name,
    shortDescription: backend.shortDescription || backend.description || backend.name,
    categoryId,
    collectionId,
    fabric: (backend.fabric as Fabric) || 'Banarasi Silk',
    design: 'Zari Weave' as DesignType,
    price,
    moq: backend.minimumOrderQuantity || 2,
    orderMultiple: backend.minimumOrderQuantity || 1,
    stock: backend.stockQuantity ?? 50,
    colors,
    images,
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
      backend.fabric ? `Premium ${backend.fabric}` : 'Premium Handloom',
      'Authentic Zari border with fine finish',
      `Direct Surat Wholesale MOQ: ${backend.minimumOrderQuantity} pieces`,
    ],
    featured: Boolean(backend.isFeatured),
    newArrival: Boolean(backend.isNew),
    status: backend.isAvailable ? 'active' : 'draft',
    createdAt: backend.createdAt || new Date().toISOString(),
  };
}

export function adaptCategory(backend: BackendCategory, index = 0): Category {
  return {
    id: `cat-${backend.id}`,
    name: backend.name,
    slug: backend.slug,
    description: backend.description || `Explore our premium wholesale ${backend.name} collection.`,
    image: {
      url: 'https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=1200&q=85',
      alt: backend.name,
      width: 1200,
      height: 800,
    },
    featured: index < 5,
    order: index + 1,
  };
}

export function adaptCollection(backend: BackendCollection, index = 0): Collection {
  return {
    id: `col-${backend.id}`,
    name: backend.name,
    slug: backend.slug,
    tagline: backend.description ? backend.description.slice(0, 45) : 'Direct Surat Wholesale',
    description: backend.description || `Curated ${backend.name} wholesale sarees.`,
    image: {
      url: backend.image || 'https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=1200&q=85',
      alt: backend.name,
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
      fullName: backend.customerName,
      businessName: backend.businessName || '',
      customerType: 'Retailer',
      whatsappNumber: backend.whatsappNumber,
      mobileNumber: backend.phone,
      city: backend.city,
      state: backend.state,
      pincode: backend.pincode,
      fullAddress: backend.address,
      notes: backend.notes || '',
    },
    items: (backend.items || []).map((item) => {
      const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
      const itemSubtotal = typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal;
      return {
        productId: `prd-${item.productId}`,
        productCode: item.productCode,
        productName: item.productName,
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
