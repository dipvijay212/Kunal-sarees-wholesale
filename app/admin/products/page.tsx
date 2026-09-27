"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocalStore } from "@/hooks/use-local-store";
import {
  adminCategoriesStore,
  adminProductsStore,
  deleteAdminProduct,
  saveAdminProduct,
  toggleAdminProductStatus,
} from "@/lib/admin-stores";
import { adminApi } from "@/lib/api";
import { formatPieces, formatPrice } from "@/lib/format";
import type { Product, Fabric, DesignType, ProductStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { PlusIcon, SearchIcon, CloseIcon } from "@/components/ui/Icons";
import type { Language } from "@/lib/translations";

interface SpecsHistory {
  fabrics: string[];
  works: string[];
  sareeCuts: string[];
  blouseCuts: string[];
  colorSets: string[];
}

const LOCAL_STORAGE_SPECS_KEY = "admin_saree_specs_history_v1";

function loadSpecsHistory(): SpecsHistory {
  if (typeof window === "undefined") {
    return { fabrics: [], works: [], sareeCuts: [], blouseCuts: [], colorSets: [] };
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SPECS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { fabrics: [], works: [], sareeCuts: [], blouseCuts: [], colorSets: [] };
}

function saveSpecsHistory(history: SpecsHistory) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_SPECS_KEY, JSON.stringify(history));
  } catch {}
}

function getEmbedVideoUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

/**
 * Smart WhatsApp broadcast parser for Indian wholesale saree messages
 */
function parseWhatsAppSareeText(rawText: string) {
  if (!rawText || !rawText.trim()) return {};

  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const result: Partial<Product> & {
    sareeCut?: string;
    blouseCut?: string;
    colorsText?: string;
  } = {};

  // 1. Rate / Price Extraction (e.g., "360 ret", "500 Ret", "630", "Rate: 450", "Price - 550")
  const rateMatch =
    rawText.match(/(?:(?:rate|ret|rs|inr|price|₹)\s*[:=-]?\s*(\d{2,5})|(\d{2,5})\s*(?:ret|rate|rs|inr|₹))/i) ||
    rawText.match(/^(\d{3,4})$/m);
  if (rateMatch) {
    const priceVal = Number(rateMatch[1] || rateMatch[2]);
    if (priceVal && priceVal >= 100 && priceVal <= 90000) {
      result.price = priceVal;
    }
  }

  // 2. Fabric extraction (e.g., "Fabric-fandy satin", "Fabric -Jenny nylon jeqard", "Star Georgette cloth")
  const fabricMatch = rawText.match(/(?:fabric|cloth|कपड़ा)\s*[:=-]?\s*([^\n\r,]+)/i);
  if (fabricMatch && fabricMatch[1]) {
    result.fabric = fabricMatch[1].replace(/[-_]/g, " ").trim();
  }

  // 3. Saree Cut / Length extraction (e.g. "Saree cut 5.50", "cut 5.40", "saree length 5.5 Mtr")
  const sareeCutMatch = rawText.match(/(?:saree\s*cut|cut|saree\s*length|लंबाई)\s*[:=-]?\s*(\d+(?:\.\d+)?(?:\s*(?:mtr|meter|m))?)/i);
  let parsedSareeCut = "";
  if (sareeCutMatch && sareeCutMatch[1]) {
    const cutNum = sareeCutMatch[1].trim();
    parsedSareeCut = cutNum.toLowerCase().includes("m") ? cutNum : `${cutNum} Meters`;
  }

  // 4. Blouse Cut / Fabric extraction (e.g. "Blouse cut .80", "Blouse cut 0.85", "Blouse fabric fendy Sattan")
  const blouseCutMatch = rawText.match(/(?:blouse\s*cut|blouse\s*piece|ब्लाउज)\s*[:=-]?\s*(\d*(?:\.\d+)?(?:\s*(?:mtr|meter|m))?)/i);
  const blouseFabricMatch = rawText.match(/(?:blouse\s*fabric|blouse\s*details)\s*[:=-]?\s*([^\n\r]+)/i);
  let parsedBlouse = "";
  if (blouseCutMatch && blouseCutMatch[1]) {
    let cut = blouseCutMatch[1].trim();
    if (cut.startsWith(".")) cut = `0${cut}`;
    parsedBlouse += `${cut}${cut.toLowerCase().includes("m") ? "" : " Mtr"}`;
  }
  if (blouseFabricMatch && blouseFabricMatch[1]) {
    parsedBlouse += (parsedBlouse ? " " : "") + blouseFabricMatch[1].trim();
  }

  if (parsedSareeCut || parsedBlouse) {
    result.specifications = {
      sareeLength: parsedSareeCut || "5.50 Meters",
      blousePiece: parsedBlouse || "0.80 Mtr Unstitched",
      weight: "",
      washCare: "Dry Clean / Gentle Wash",
      origin: "Surat / Varanasi",
    };
  }

  // 5. Work / Design details (e.g. "Full saree ton tu ton embroidery sequence work", "Zari Border Ajrakh Print")
  const workMatch =
    rawText.match(/(?:work|embroidery|print|design|काम|जरी)\s*[:=-]?\s*([^\n\r]+)/i) ||
    rawText.match(/([^\n\r]*(?:sequence|zari|embroidery|ajrakh|print|handwork|machine\s*work)[^\n\r]*)/i);
  if (workMatch && workMatch[1]) {
    result.design = workMatch[1].trim() as DesignType;
  }

  // 6. Colors / Matching Set (e.g. "6 Color machine", "6 Color set", "8 Matching colors")
  const colorMatch =
    rawText.match(/(\d+)\s*(?:color|colour|matching|रंग)/i) ||
    rawText.match(/(?:color|colors|colours)\s*[:=-]?\s*([^\n\r]+)/i);
  if (colorMatch) {
    if (colorMatch[1] && !isNaN(Number(colorMatch[1]))) {
      result.color_en = `${colorMatch[1]} Colors Matching Set`;
      result.color_hi = `${colorMatch[1]} कलर्स मैचिंग सेट`;
    } else if (colorMatch[1]) {
      result.color_en = colorMatch[1].trim();
      result.color_hi = colorMatch[1].trim();
    }
  }

  // 7. Title / Name extraction (Usually first line or line with Saree / Brand name)
  const titleLine =
    lines.find(
      (l) =>
        !l.toLowerCase().startsWith("rate") &&
        !l.toLowerCase().startsWith("ret") &&
        !l.match(/^\d+$/) &&
        !l.toLowerCase().startsWith("fabric-") &&
        !l.toLowerCase().startsWith("saree cut") &&
        !l.toLowerCase().startsWith("blouse cut")
    ) ||
    lines[0] ||
    "";

  if (titleLine) {
    result.name = titleLine.replace(/^Forwarded\s*/i, "").trim();
  }

  result.description = rawText.trim();

  return result;
}

export default function AdminProductsPage() {
  const products = useLocalStore(adminProductsStore);
  const categories = useLocalStore(adminCategoriesStore);

  // Active Enabled Languages in System
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>(["hi", "en"]);

  useEffect(() => {
    adminApi.settings.getLanguage()
      .then((res) => {
        if (res && Array.isArray(res.availableLanguages)) {
          setAvailableLanguages(res.availableLanguages);
        }
      })
      .catch(() => {});
  }, []);

  // Filters & State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Dynamic suggestions extracted from all previously entered products & admin history
  const [specsHistory, setSpecsHistory] = useState<SpecsHistory>(() => loadSpecsHistory());

  useEffect(() => {
    setSpecsHistory(loadSpecsHistory());
  }, []);

  const dynamicFabrics = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.fabric?.trim()) set.add(p.fabric.trim());
      if (p.fabric_en?.trim()) set.add(p.fabric_en.trim());
      if (p.fabric_hi?.trim()) set.add(p.fabric_hi.trim());
    });
    specsHistory.fabrics.forEach((f) => { if (f?.trim()) set.add(f.trim()); });
    return Array.from(set).filter(Boolean);
  }, [products, specsHistory.fabrics]);

  const dynamicWorks = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.design?.trim()) set.add(p.design.trim());
    });
    specsHistory.works.forEach((w) => { if (w?.trim()) set.add(w.trim()); });
    return Array.from(set).filter(Boolean);
  }, [products, specsHistory.works]);

  const dynamicSareeCuts = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const cut = p.specifications?.sareeLength;
      if (cut?.trim()) set.add(cut.trim());
    });
    specsHistory.sareeCuts.forEach((c) => { if (c?.trim()) set.add(c.trim()); });
    return Array.from(set).filter(Boolean);
  }, [products, specsHistory.sareeCuts]);

  const dynamicBlouseCuts = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const b = p.specifications?.blousePiece;
      if (b?.trim()) set.add(b.trim());
    });
    specsHistory.blouseCuts.forEach((b) => { if (b?.trim()) set.add(b.trim()); });
    return Array.from(set).filter(Boolean);
  }, [products, specsHistory.blouseCuts]);

  const dynamicColorSets = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.color_en?.trim()) set.add(p.color_en.trim());
      if (p.color_hi?.trim()) set.add(p.color_hi.trim());
      if (Array.isArray(p.colors)) {
        p.colors.forEach((c) => { if (c?.name?.trim()) set.add(c.name.trim()); });
      }
    });
    specsHistory.colorSets.forEach((c) => { if (c?.trim()) set.add(c.trim()); });
    return Array.from(set).filter(Boolean);
  }, [products, specsHistory.colorSets]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // WhatsApp Quick Import state
  const [whatsAppText, setWhatsAppText] = useState("");
  const [isWhatsAppPanelOpen, setIsWhatsAppPanelOpen] = useState(false);

  // Helper to detect best matching Category from text
  const detectCategory = (text: string): string => {
    if (!text || categories.length === 0) return categories[0]?.id || "";
    const lower = text.toLowerCase();
    const keywords = [
      { keys: ["cotton", "कॉटन", "mal cotton", "ajrakh"], cat: "cotton" },
      { keys: ["satin", "साटन", "fandy satin", "sattan"], cat: "satin" },
      { keys: ["georgette", "जॉर्जेट", "star georgette"], cat: "georgette" },
      { keys: ["banarasi", "बनारसी", "zari"], cat: "banarasi" },
      { keys: ["kanjivaram", "कांचीवरम"], cat: "kanjivaram" },
      { keys: ["organza", "ओरगांजा"], cat: "organza" },
      { keys: ["chiffon", "शिफॉन"], cat: "chiffon" },
      { keys: ["jacquard", "jeqard", "जैकर्ड"], cat: "jacquard" },
      { keys: ["silk", "सिल्क", "dola", "tussar"], cat: "silk" },
    ];

    for (const item of keywords) {
      if (item.keys.some((k) => lower.includes(k))) {
        const found = categories.find((c) => {
          const cText = `${c.name} ${c.name_en || ""} ${c.name_hi || ""} ${c.slug || ""}`.toLowerCase();
          return cText.includes(item.cat) || item.keys.some((k) => cText.includes(k));
        });
        if (found) return found.id;
      }
    }
    return categories[0]?.id || "";
  };

  const handleAutoFillFromWhatsApp = () => {
    if (!whatsAppText.trim() || !editingProduct) return;
    const parsed = parseWhatsAppSareeText(whatsAppText);
    const matchedCategory = detectCategory(`${whatsAppText} ${parsed.fabric || ""} ${parsed.name || ""}`);

    setEditingProduct((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        name: parsed.name || prev.name,
        price: parsed.price || prev.price,
        fabric: parsed.fabric || prev.fabric,
        design: parsed.design || prev.design,
        color_en: parsed.color_en || prev.color_en,
        color_hi: parsed.color_hi || prev.color_hi,
        categoryId: matchedCategory || prev.categoryId,
        description: parsed.description || prev.description,
        specifications: {
          ...(prev.specifications || { sareeLength: "5.50 Meters", blousePiece: "0.80 Mtr Unstitched", weight: "", washCare: "Dry Clean", origin: "Surat" }),
          ...(parsed.specifications || {}),
        },
      };
    });

    setUploadError("✓ WhatsApp text parsed and fields filled automatically!");
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.name_hi && p.name_hi.toLowerCase().includes(search.toLowerCase())) ||
      (p.name_en && p.name_en.toLowerCase().includes(search.toLowerCase())) ||
      p.productCode.toLowerCase().includes(search.toLowerCase()) ||
      p.fabric.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setUploadError(null);
    setWhatsAppText("");
    setIsWhatsAppPanelOpen(false);
    const codeDigits = Math.floor(1000 + Math.random() * 9000);
    setEditingProduct({
      name: "",
      productCode: `KS-BNS-${codeDigits}`,
      description: "",
      fabric: "" as Fabric,
      design: "" as DesignType,
      price: "" as unknown as number,
      moq: "" as unknown as number,
      stock: "" as unknown as number,
      categoryId: categories[0]?.id || "",
      color_en: "",
      color_hi: "",
      specifications: {
        sareeLength: "",
        blousePiece: "",
        weight: "",
        washCare: "",
        origin: "",
      },
      featured: false,
      newArrival: false,
      status: "active" as ProductStatus,
      images: [],
      videoUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setUploadError(null);
    setWhatsAppText("");
    setIsWhatsAppPanelOpen(false);
    setEditingProduct({
      ...product,
      images: product.images ? [...product.images] : [],
      videoUrl: product.videoUrl || "",
      specifications: product.specifications || {
        sareeLength: "5.50 Meters",
        blousePiece: "0.80 Mtr Unstitched",
        weight: "750g",
        washCare: "Dry Clean / Gentle Wash",
        origin: "Surat",
      },
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0 || !editingProduct) return;
    const files = Array.from(fileList);
    e.target.value = "";

    setIsUploadingImages(true);
    setUploadError(null);

    try {
      // 1. Upload directly to Cloudinary via backend API
      const uploadRes = await adminApi.media.uploadImages(files);
      if (uploadRes && Array.isArray(uploadRes.urls) && uploadRes.urls.length > 0) {
        const newImages = uploadRes.urls.map((url, i) => ({
          url,
          alt: files[i]?.name.replace(/\.[^/.]+$/, "") || editingProduct.name || "Saree Photo",
          width: uploadRes.images?.[i]?.width || 1200,
          height: uploadRes.images?.[i]?.height || 1600,
        }));

        setEditingProduct((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            images: [...(prev.images || []), ...newImages],
          };
        });
        return;
      }
    } catch (err: unknown) {
      console.warn("Cloudinary upload failed, falling back to local file preview:", err);
      const errMsg = err instanceof Error ? err.message : "Media upload error";
      if (errMsg.includes("Cloudinary is not configured")) {
        setUploadError("Notice: Cloudinary is not configured in backend .env. Photo preview loaded locally.");
      } else {
        setUploadError(`${errMsg} (Loaded as local preview)`);
      }

      // 2. Client-side Data URL Fallback
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            setEditingProduct((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                images: [
                  ...(prev.images || []),
                  {
                    url: dataUrl,
                    alt: file.name.replace(/\.[^/.]+$/, "") || prev.name || "Saree Photo",
                    width: 1200,
                    height: 1600,
                  },
                ],
              };
            });
          }
        };
        reader.readAsDataURL(file);
      });
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!editingProduct) return;
    const updatedImages = (editingProduct.images || []).filter((_, i) => i !== indexToRemove);
    setEditingProduct({ ...editingProduct, images: updatedImages });
  };

  const handleMakeCoverImage = (indexToCover: number) => {
    if (!editingProduct || !editingProduct.images) return;
    const images = [...editingProduct.images];
    const [selected] = images.splice(indexToCover, 1);
    if (selected) {
      images.unshift(selected);
      setEditingProduct({ ...editingProduct, images });
    }
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    if (!editingProduct || !editingProduct.images) return;
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editingProduct.images.length) return;

    const images = [...editingProduct.images];
    const temp = images[index];
    images[index] = images[targetIndex];
    images[targetIndex] = temp;
    setEditingProduct({ ...editingProduct, images });
  };

  // Video Management Handlers
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    e.target.value = "";

    setIsUploadingVideo(true);
    setUploadError(null);

    try {
      // 1. Upload video directly to Cloudinary via backend API
      const uploadRes = await adminApi.media.uploadVideo(file);
      if (uploadRes && uploadRes.url) {
        setEditingProduct((prev) => (prev ? { ...prev, videoUrl: uploadRes.url } : prev));
        return;
      }
    } catch (err: unknown) {
      console.warn("Cloudinary video upload failed, falling back to local preview:", err);
      const errMsg = err instanceof Error ? err.message : "Video upload error";
      if (errMsg.includes("Cloudinary is not configured")) {
        setUploadError("Notice: Cloudinary is not configured in backend .env. Video preview loaded locally.");
      } else {
        setUploadError(`${errMsg} (Loaded as local preview)`);
      }

      // 2. Client-side Data URL Fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const videoDataUrl = event.target?.result as string;
        if (videoDataUrl) {
          setEditingProduct((prev) => (prev ? { ...prev, videoUrl: videoDataUrl } : prev));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleRemoveVideo = () => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, videoUrl: "" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const primaryName = (editingProduct.name || "").trim();
    if (!primaryName || !editingProduct.price) {
      setUploadError("Product Name and Wholesale Price are required.");
      return;
    }

    // Persist newly entered values to history so they automatically become dynamic suggestions next time
    const updatedHistory: SpecsHistory = {
      fabrics: Array.from(new Set([editingProduct.fabric?.trim() || "", ...specsHistory.fabrics])).filter(Boolean).slice(0, 30),
      works: Array.from(new Set([editingProduct.design?.trim() || "", ...specsHistory.works])).filter(Boolean).slice(0, 30),
      sareeCuts: Array.from(new Set([editingProduct.specifications?.sareeLength?.trim() || "", ...specsHistory.sareeCuts])).filter(Boolean).slice(0, 20),
      blouseCuts: Array.from(new Set([editingProduct.specifications?.blousePiece?.trim() || "", ...specsHistory.blouseCuts])).filter(Boolean).slice(0, 20),
      colorSets: Array.from(new Set([editingProduct.color_en?.trim() || editingProduct.color_hi?.trim() || "", ...specsHistory.colorSets])).filter(Boolean).slice(0, 20),
    };
    saveSpecsHistory(updatedHistory);
    setSpecsHistory(updatedHistory);

    await saveAdminProduct({
      ...editingProduct,
      name: primaryName,
      price: Number(editingProduct.price),
      categoryId: editingProduct.categoryId || categories[0]?.id || "",
    });
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <AdminLayout title="Product Management">
      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-5">
        <div>
          <h2 className="type-h4 text-ink font-serif">Saree Catalogue ({filteredProducts.length})</h2>
          <p className="text-xs text-muted">
            Manage saree wholesale prices, minimum order quantities (MOQ), stock levels, and media.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} leadingIcon={<PlusIcon size={18} />}>
          Add New Saree
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by saree title, code, fabric, or work..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xs border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="all">All Categories (सभी श्रेणियां)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_hi || c.name} {c.name_en ? `(${c.name_en})` : ""}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active (Available for Wholesale)</option>
          <option value="draft">Draft (Hidden)</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="mt-6 overflow-x-auto rounded-xs border border-line bg-canvas shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas-deep text-xs uppercase tracking-wider text-muted font-semibold">
            <tr>
              <th className="px-4 py-3">Code / Image</th>
              <th className="px-4 py-3">Saree Title & Category</th>
              <th className="px-4 py-3">Fabric & Work</th>
              <th className="px-4 py-3">Wholesale Rate & MOQ</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredProducts.map((product) => {
              const category = categories.find((c) => c.id === product.categoryId);

              return (
                <tr key={product.id} className="hover:bg-canvas-deep/50 transition-colors">
                  {/* Code & Image */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 rounded-xs bg-line/40 overflow-hidden shrink-0 border border-line">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center text-[10px] text-muted">No photo</div>
                        )}
                        {product.videoUrl ? (
                          <span className="absolute bottom-0 inset-x-0 bg-accent text-[8px] font-bold text-white text-center py-0.5 leading-none tracking-tighter">
                            ▶ VIDEO
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-semibold text-ink block">
                          {product.productCode}
                        </span>
                        <span className="text-[10px] text-muted">
                          {(product.images || []).length} photo{(product.images || []).length === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Name & Category */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">
                      {product.name || product.name_hi || product.name_en}
                    </div>
                    <div className="text-xs text-accent font-medium">
                      {category?.name_hi || category?.name || "No Category"}
                    </div>
                  </td>

                  {/* Fabric & Work */}
                  <td className="px-4 py-3">
                    <div className="text-ink font-medium">{product.fabric || "Saree Silk"}</div>
                    {product.design ? (
                      <div className="text-[0.6875rem] text-muted truncate max-w-[180px]">
                        {product.design}
                      </div>
                    ) : null}
                  </td>

                  {/* Price & MOQ */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-maroon">{formatPrice(product.price)}</div>
                    <div className="text-xs text-muted">MOQ: {product.moq} pcs</div>
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        product.stock <= 0
                          ? "text-alert"
                          : product.stock < 15
                            ? "text-warning"
                            : "text-ink"
                      }`}
                    >
                      {formatPieces(product.stock)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAdminProductStatus(product.id)}
                      className={`inline-flex items-center rounded-xs px-2 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        product.status === "active"
                          ? "bg-success/15 text-success hover:bg-success/25"
                          : "bg-muted/15 text-muted hover:bg-muted/25"
                      }`}
                    >
                      {product.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAdminProduct(product.id)}
                      className="text-xs font-semibold text-alert hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-xs p-3 sm:p-6 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative flex flex-col w-full max-w-3xl max-h-[92vh] rounded-xs border border-line bg-canvas shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-canvas shrink-0">
              <div>
                <h3 className="type-h4 text-ink font-serif">
                  {editingProduct.id ? "Edit Saree Product" : "Add New Saree Product (साड़ी जोड़ें)"}
                </h3>
                <p className="text-[11px] text-muted">
                  Fill in the wholesale saree details, photos, video demo, rate, and specifications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xs p-1.5 text-muted hover:text-ink hover:bg-canvas-deep transition-colors"
                aria-label="Close"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Form & Scrollable Content */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs flex-1">
                {/* 0. SMART WHATSAPP TEXT AUTO-FILL TOOL */}
                <div className="rounded-xs border border-accent/30 bg-accent/5 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsWhatsAppPanelOpen(!isWhatsAppPanelOpen)}
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5"
                    >
                      <span>⚡</span> Paste WhatsApp Supplier Text (Auto-Fill Form)
                      <span className="text-[10px] text-muted font-normal">
                        ({isWhatsAppPanelOpen ? "Hide" : "Click to Open"})
                      </span>
                    </button>
                    <span className="text-[10px] bg-accent/15 text-accent font-semibold px-2 py-0.5 rounded-xs">
                      Time Saver
                    </span>
                  </div>

                  {isWhatsAppPanelOpen && (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows={3}
                        placeholder={`Paste supplier WhatsApp message here, e.g.:\nFabric-fandy satin\nSaree cut 5.50\nBlouse cut .80\n630`}
                        value={whatsAppText}
                        onChange={(e) => setWhatsAppText(e.target.value)}
                        className="w-full rounded-xs border border-line bg-canvas p-2.5 text-xs text-ink font-mono placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted">
                          Automatically extracts Rate, Fabric, Saree Cut, Blouse Cut, Work & Category.
                        </span>
                        <button
                          type="button"
                          onClick={handleAutoFillFromWhatsApp}
                          className="rounded-xs bg-accent text-white px-3 py-1.5 text-xs font-semibold hover:bg-accent-deep transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          <span>⚡</span> Auto-Fill Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Error / Notice Banner */}
                {uploadError ? (
                  <div className="flex items-center justify-between rounded-xs bg-accent/10 border border-accent/20 px-3 py-2 text-xs text-ink">
                    <div className="flex items-center gap-2">
                      <span className="text-accent font-bold">ℹ</span>
                      <span>{uploadError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadError(null)}
                      className="text-muted hover:text-ink font-bold text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : null}

                {/* 1. MEDIA SECTION: Photos & Video */}
                <div className="rounded-xs border border-line bg-canvas-deep/40 p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-2.5">
                    <div>
                      <h4 className="font-semibold text-ink text-sm flex items-center gap-2">
                        <span>📸</span> Product Photos & Video (फोटो व वीडियो)
                        <span className="text-[9px] font-normal text-muted bg-canvas px-1.5 py-0.5 rounded-xs border border-line">
                          ☁️ Cloudinary CDN
                        </span>
                      </h4>
                      <p className="text-[11px] text-muted">
                        Select multiple saree photos and video demonstration directly from your device.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded-xs">
                      {(editingProduct.images || []).length} Photo{(editingProduct.images || []).length === 1 ? "" : "s"}
                      {editingProduct.videoUrl ? " • 1 Video" : ""}
                    </span>
                  </div>

                  {/* Photos Upload Controls */}
                  <div className="space-y-3">
                    <label className="font-semibold text-ink block text-xs">
                      Product Photos (साड़ी की तस्वीरें)
                    </label>

                    {/* Device / Camera Upload Dropzone */}
                    <label
                      className={`flex flex-col items-center justify-center gap-2 rounded-xs border-2 border-dashed border-line bg-canvas p-6 text-center transition-colors group ${
                        isUploadingImages ? "opacity-60 cursor-not-allowed border-accent" : "hover:border-accent hover:bg-canvas-deep/50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isUploadingImages}
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                      <div className="size-10 rounded-full bg-accent/10 group-hover:bg-accent group-hover:text-white text-accent flex items-center justify-center transition-colors">
                        {isUploadingImages ? (
                          <svg className="size-5 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        ) : (
                          <PlusIcon size={20} />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-ink block">
                          {isUploadingImages ? "Uploading to Cloudinary..." : "Upload Photos from Device / Camera"}
                        </span>
                        <span className="text-xs text-muted block mt-0.5">
                          {isUploadingImages ? "Optimizing & storing media..." : "Click to select or drag multiple saree photos (PNG, JPG, WebP)"}
                        </span>
                      </div>
                    </label>

                    {/* Image Thumbnails List */}
                    {editingProduct.images && editingProduct.images.length > 0 ? (
                      <div className="mt-2">
                        <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
                          Gallery Order (First photo is Primary Cover):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {editingProduct.images.map((img, idx) => (
                            <div
                              key={`${img.url}-${idx}`}
                              className={`relative rounded-xs border overflow-hidden bg-canvas group ${
                                idx === 0 ? "border-accent ring-2 ring-accent/30" : "border-line"
                              }`}
                            >
                              <div className="aspect-[3/4] w-full relative bg-line/20">
                                <img
                                  src={img.url}
                                  alt=""
                                  className="size-full object-cover"
                                />
                              </div>

                              {idx === 0 && (
                                <span className="absolute top-1 left-1 rounded-xs bg-accent px-1.5 py-0.5 text-[8px] font-bold text-white shadow-xs">
                                  ★ COVER
                                </span>
                              )}

                              {img.url.includes("cloudinary") && (
                                <span className="absolute bottom-6 left-1 rounded-xs bg-ink/75 px-1 py-0.5 text-[7px] font-medium text-white shadow-xs">
                                  ☁️ CDN
                                </span>
                              )}

                              {/* Controls Toolbar */}
                              <div className="absolute inset-x-0 bottom-0 bg-ink/85 backdrop-blur-xs p-1 flex items-center justify-between text-white text-[10px] opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                {idx !== 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => handleMakeCoverImage(idx)}
                                    className="px-1.5 py-0.5 hover:bg-white/20 rounded-xs font-semibold text-[9px]"
                                    title="Set as Primary Cover"
                                  >
                                    Cover
                                  </button>
                                ) : (
                                  <span className="px-1 text-[9px] font-semibold text-accent-light">Cover</span>
                                )}

                                <div className="flex items-center gap-1">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveImage(idx, "left")}
                                      className="p-1 hover:bg-white/20 rounded-xs"
                                      title="Move Left"
                                    >
                                      ◀
                                    </button>
                                  )}
                                  {idx < (editingProduct.images?.length || 1) - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveImage(idx, "right")}
                                      className="p-1 hover:bg-white/20 rounded-xs"
                                      title="Move Right"
                                    >
                                      ▶
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="p-1 hover:bg-alert rounded-xs text-alert hover:text-white"
                                    title="Delete Photo"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted italic">
                        No photos added yet. Click above to upload from your device.
                      </p>
                    )}
                  </div>

                  {/* Video Section */}
                  <div className="border-t border-line pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-ink block text-xs">
                        Product Video (उत्पाद वीडियो / लाइव रील / MP4)
                      </label>
                      {editingProduct.videoUrl ? (
                        <span className="text-[10px] font-semibold text-success bg-success/15 px-2 py-0.5 rounded-xs">
                          ✓ Video Attached {editingProduct.videoUrl.includes("cloudinary") ? "(Cloudinary)" : ""}
                        </span>
                      ) : null}
                    </div>

                    {/* Video File Upload Dropzone */}
                    <label
                      className={`flex items-center gap-4 rounded-xs border-2 border-dashed border-line bg-canvas p-4 transition-colors group ${
                        isUploadingVideo ? "opacity-60 cursor-not-allowed border-accent" : "hover:border-accent hover:bg-canvas-deep/50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="file"
                        accept="video/*"
                        disabled={isUploadingVideo}
                        onChange={handleVideoFileUpload}
                        className="hidden"
                      />
                      <div className="size-10 rounded-full bg-accent/10 group-hover:bg-accent group-hover:text-white text-accent flex items-center justify-center shrink-0 transition-colors">
                        {isUploadingVideo ? (
                          <svg className="size-5 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        ) : (
                          <svg className="size-5 fill-current ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-ink block truncate">
                          {isUploadingVideo ? "Uploading Video to Cloudinary..." : "Upload Saree Video"}
                        </span>
                        <span className="text-xs text-muted block truncate mt-0.5">
                          {isUploadingVideo ? "Streaming to Cloudinary CDN..." : "Click to select product video file (MP4, WebM, MOV)"}
                        </span>
                      </div>
                    </label>

                    {/* Video Player Preview */}
                    {editingProduct.videoUrl ? (
                      <div className="mt-2 rounded-xs border border-line bg-canvas p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                            <span>▶</span> Attached Video Preview
                          </span>
                          <button
                            type="button"
                            onClick={handleRemoveVideo}
                            className="text-xs font-semibold text-alert hover:underline"
                          >
                            Remove Video
                          </button>
                        </div>
                        <div className="aspect-video max-h-52 w-full rounded-xs bg-black overflow-hidden flex items-center justify-center">
                          {editingProduct.videoUrl.includes("youtube.com") || editingProduct.videoUrl.includes("youtu.be") ? (
                            <iframe
                              src={getEmbedVideoUrl(editingProduct.videoUrl) || editingProduct.videoUrl}
                              title="Video Preview"
                              className="size-full border-0"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={editingProduct.videoUrl}
                              controls
                              playsInline
                              className="size-full object-contain"
                            />
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 2. PRODUCT BASICS */}
                <div className="rounded-xs border border-line bg-canvas p-4 space-y-4">
                  <h4 className="font-semibold text-ink text-sm border-b border-line pb-2 flex items-center gap-2">
                    <span>🏷️</span> Product Basics (उत्पाद का नाम व श्रेणी)
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Saree Name / Title */}
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-ink block">
                        Saree Title / Product Name (साड़ी का नाम) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sonal Trendy Mal Cotton Saree with Zari Border"
                        value={editingProduct.name || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="font-semibold text-ink block">Category (साड़ी श्रेणी) *</label>
                      <select
                        required
                        value={editingProduct.categoryId || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name_hi || c.name} {c.name_en ? `(${c.name_en})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Product Code */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-ink block">Product Code (डिज़ाइन नंबर) *</label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              productCode: `KS-BNS-${Math.floor(1000 + Math.random() * 9000)}`,
                            })
                          }
                          className="text-[10px] text-accent font-semibold hover:underline"
                        >
                          ⚡ Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={editingProduct.productCode || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, productCode: e.target.value })}
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink font-mono focus:border-accent focus:outline-none"
                      />
                    </div>

                    {/* Wholesale Rate (Price) */}
                    <div>
                      <label className="font-semibold text-ink block">Wholesale Rate / Price (₹ दर) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 500"
                        value={editingProduct.price ?? ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink font-semibold focus:border-accent focus:outline-none"
                      />
                    </div>

                    {/* Minimum Order Quantity (MOQ) */}
                    <div>
                      <label className="font-semibold text-ink block">Minimum Order Quantity (MOQ / सेट) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 6"
                        value={editingProduct.moq ?? ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            moq: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                    </div>

                    {/* Stock Quantity */}
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-ink block">Stock Available (कुल स्टॉक pcs/sets) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 60"
                        value={editingProduct.stock ?? ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            stock: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. WHOLESALE SAREE SPECIFICATIONS */}
                <div className="rounded-xs border border-line bg-canvas p-4 space-y-4">
                  <h4 className="font-semibold text-ink text-sm border-b border-line pb-2 flex items-center gap-2">
                    <span>🧵</span> Wholesale Saree Specifications (साड़ी फैब्रिक, कट व वर्क)
                  </h4>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {/* Fabric */}
                    <div>
                      <label className="font-semibold text-ink block">Fabric / Material (कपड़ा / फैब्रिक) *</label>
                      <input
                        type="text"
                        list="datalist-fabrics"
                        placeholder="e.g. Fandy Satin / Mal Cotton / Jenny Jacquard"
                        value={editingProduct.fabric || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value as Fabric })}
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                      <datalist id="datalist-fabrics">
                        {dynamicFabrics.map((f) => (
                          <option key={f} value={f} />
                        ))}
                      </datalist>
                      {(() => {
                        const inputVal = (editingProduct.fabric || "").trim().toLowerCase();
                        if (!inputVal) return null;
                        const matches = dynamicFabrics.filter(
                          (item) => item.toLowerCase().includes(inputVal) && item.toLowerCase() !== inputVal
                        );
                        if (matches.length === 0) return null;
                        return (
                          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                            <span className="text-[10px] text-muted font-medium mr-0.5">Suggestions:</span>
                            {matches.slice(0, 6).map((pill) => (
                              <button
                                key={pill}
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, fabric: pill as Fabric })}
                                className="rounded-xs bg-accent/10 border border-accent/25 px-1.5 py-0.5 text-[10px] text-accent hover:bg-accent hover:text-white transition-colors"
                              >
                                +{pill}
                              </button>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Work / Design Details */}
                    <div>
                      <label className="font-semibold text-ink block">Work / Embroidery Details (काम / वर्क) *</label>
                      <input
                        type="text"
                        list="datalist-works"
                        placeholder="e.g. Full saree ton tu ton sequence embroidery work"
                        value={editingProduct.design || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, design: e.target.value as DesignType })}
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                      <datalist id="datalist-works">
                        {dynamicWorks.map((w) => (
                          <option key={w} value={w} />
                        ))}
                      </datalist>
                      {(() => {
                        const inputVal = (editingProduct.design || "").trim().toLowerCase();
                        if (!inputVal) return null;
                        const matches = dynamicWorks.filter(
                          (item) => item.toLowerCase().includes(inputVal) && item.toLowerCase() !== inputVal
                        );
                        if (matches.length === 0) return null;
                        return (
                          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                            <span className="text-[10px] text-muted font-medium mr-0.5">Suggestions:</span>
                            {matches.slice(0, 6).map((pill) => (
                              <button
                                key={pill}
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, design: pill as DesignType })}
                                className="rounded-xs bg-accent/10 border border-accent/25 px-1.5 py-0.5 text-[10px] text-accent hover:bg-accent hover:text-white transition-colors"
                              >
                                +{pill}
                              </button>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Saree Cut / Length */}
                    <div>
                      <label className="font-semibold text-ink block">Saree Cut / Length (साड़ी की लंबाई / कट)</label>
                      <input
                        type="text"
                        list="datalist-saree-cuts"
                        placeholder="e.g. 5.50 Meters"
                        value={editingProduct.specifications?.sareeLength || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: {
                              ...(editingProduct.specifications || { blousePiece: "", weight: "", washCare: "", origin: "" }),
                              sareeLength: e.target.value,
                            },
                          })
                        }
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                      <datalist id="datalist-saree-cuts">
                        {dynamicSareeCuts.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                      {(() => {
                        const inputVal = (editingProduct.specifications?.sareeLength || "").trim().toLowerCase();
                        if (!inputVal) return null;
                        const matches = dynamicSareeCuts.filter(
                          (item) => item.toLowerCase().includes(inputVal) && item.toLowerCase() !== inputVal
                        );
                        if (matches.length === 0) return null;
                        return (
                          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                            <span className="text-[10px] text-muted font-medium mr-0.5">Suggestions:</span>
                            {matches.slice(0, 6).map((pill) => (
                              <button
                                key={pill}
                                type="button"
                                onClick={() =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    specifications: {
                                      ...(editingProduct.specifications || { blousePiece: "", weight: "", washCare: "", origin: "" }),
                                      sareeLength: pill,
                                    },
                                  })
                                }
                                className="rounded-xs bg-accent/10 border border-accent/25 px-1.5 py-0.5 text-[10px] text-accent hover:bg-accent hover:text-white transition-colors"
                              >
                                +{pill}
                              </button>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Blouse Cut & Fabric */}
                    <div>
                      <label className="font-semibold text-ink block">Blouse Cut & Fabric (ब्लाउज कट व डिटेल)</label>
                      <input
                        type="text"
                        list="datalist-blouse-cuts"
                        placeholder="e.g. 0.80 Mtr Fandy Satin Contrast Full Work"
                        value={editingProduct.specifications?.blousePiece || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: {
                              ...(editingProduct.specifications || { sareeLength: "", weight: "", washCare: "", origin: "" }),
                              blousePiece: e.target.value,
                            },
                          })
                        }
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                      <datalist id="datalist-blouse-cuts">
                        {dynamicBlouseCuts.map((b) => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                      {(() => {
                        const inputVal = (editingProduct.specifications?.blousePiece || "").trim().toLowerCase();
                        if (!inputVal) return null;
                        const matches = dynamicBlouseCuts.filter(
                          (item) => item.toLowerCase().includes(inputVal) && item.toLowerCase() !== inputVal
                        );
                        if (matches.length === 0) return null;
                        return (
                          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                            <span className="text-[10px] text-muted font-medium mr-0.5">Suggestions:</span>
                            {matches.slice(0, 6).map((pill) => (
                              <button
                                key={pill}
                                type="button"
                                onClick={() =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    specifications: {
                                      ...(editingProduct.specifications || { sareeLength: "", weight: "", washCare: "", origin: "" }),
                                      blousePiece: pill,
                                    },
                                  })
                                }
                                className="rounded-xs bg-accent/10 border border-accent/25 px-1.5 py-0.5 text-[10px] text-accent hover:bg-accent hover:text-white transition-colors"
                              >
                                +{pill}
                              </button>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Colors Available / Matching Set */}
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-ink block">Colors / Matching Set Details (कलर्स / मैचिंग सेट)</label>
                      <input
                        type="text"
                        list="datalist-color-sets"
                        placeholder="e.g. 6 Colors Matching Set (Red, Wine, Purple, Green, Mustard, Navy)"
                        value={editingProduct.color_en || editingProduct.color_hi || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            color_en: e.target.value,
                            color_hi: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                      <datalist id="datalist-color-sets">
                        {dynamicColorSets.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                      {(() => {
                        const inputVal = (editingProduct.color_en || editingProduct.color_hi || "").trim().toLowerCase();
                        if (!inputVal) return null;
                        const matches = dynamicColorSets.filter(
                          (item) => item.toLowerCase().includes(inputVal) && item.toLowerCase() !== inputVal
                        );
                        if (matches.length === 0) return null;
                        return (
                          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                            <span className="text-[10px] text-muted font-medium mr-0.5">Suggestions:</span>
                            {matches.slice(0, 6).map((pill) => (
                              <button
                                key={pill}
                                type="button"
                                onClick={() =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    color_en: pill,
                                    color_hi: pill,
                                  })
                                }
                                className="rounded-xs bg-accent/10 border border-accent/25 px-1.5 py-0.5 text-[10px] text-accent hover:bg-accent hover:text-white transition-colors"
                              >
                                +{pill}
                              </button>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Description / Notes */}
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-ink block">Description / Wholesale Notes (विवरण व नोट्स)</label>
                      <textarea
                        rows={3}
                        placeholder="Full wholesale saree description, packaging details, and selling points..."
                        value={editingProduct.description || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="mt-1 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Highlights & Badges */}
                  <div className="flex items-center gap-6 pt-2 border-t border-line">
                    <label className="flex items-center gap-2 cursor-pointer text-ink font-semibold">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                        className="accent-accent"
                      />
                      Featured Design (विशेष डिज़ाइन)
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-ink font-semibold">
                      <input
                        type="checkbox"
                        checked={editingProduct.newArrival || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, newArrival: e.target.checked })}
                        className="accent-accent"
                      />
                      New Arrival (नया स्टॉक)
                    </label>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-line bg-canvas-deep px-5 py-3.5 shrink-0">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Saree Product</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
