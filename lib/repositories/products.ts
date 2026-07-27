import type { CompatibilityStatus, Product } from "@partsloop/contracts";
import { products as mockProducts } from "../mock-data.ts";
import { isSupabaseConfigured, supabasePublicAsset, supabaseQuery } from "../supabase-rest.ts";

export interface ProductSearch {
  q?: string;
  category?: string;
  condition?: string;
  compatibility?: string;
  verified?: boolean;
  sort?: string;
  make?: string;
  model?: string;
  year?: string;
  engineSize?: string;
  fuelType?: string;
  engineType?: string;
  trim?: string;
  vin?: string;
}

interface ProductRow {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  oem_number: string;
  condition: Product["condition"];
  grade: Product["grade"];
  price_minor: number;
  currency: Product["price"]["currency"];
  warranty_days: number;
  defects: string[];
  categories?: { name_en: string } | null;
  seller_profiles?: {
    id: string;
    display_name: string;
    city: string;
    verification_status: string;
    rating: number | string;
    completed_orders: number;
    stripe_account_id?: string | null;
  } | null;
  product_fitments?: Array<{
    make: string;
    model: string;
    year_from: number;
    year_to: number;
    engine?: string | null;
    trim?: string | null;
    status: CompatibilityStatus;
  }>;
  product_images?: Array<{ storage_path: string; sort_order: number }>;
}

const visualByCategory: Record<string, Product["visual"]> = {
  lights: "headlight",
  engines: "engine",
  body: "bumper",
  "body parts": "bumper",
  transmission: "gearbox",
  wheels: "wheel",
  suspension: "suspension",
  electrical: "electronics",
  "electrical & electronics": "electronics",
  brakes: "brakes",
};

const productSelect = "id,slug,title_en,title_ar,description_en,description_ar,oem_number,condition,grade,price_minor,currency,warranty_days,defects,categories(name_en),seller_profiles(id,display_name,city,verification_status,rating,completed_orders,stripe_account_id),product_fitments(make,model,year_from,year_to,engine,trim,status),product_images(storage_path,sort_order)";

function includesDetail(haystack: string, value: string | undefined, knownValues: RegExp) {
  if (!value) return true;
  const normalized = value.toLowerCase();
  if (haystack.includes(normalized)) return true;
  return !knownValues.test(haystack);
}

function includesYear(haystack: string, value: string | undefined) {
  if (!value) return true;
  const selectedYear = Number(value);
  if (!Number.isFinite(selectedYear)) return true;
  const ranges = [...haystack.matchAll(/(\d{4})\s*[–-]\s*(\d{4})/g)];
  if (!ranges.length) return !/\b(19|20)\d{2}\b/.test(haystack) || haystack.includes(value);
  return ranges.some((range) => selectedYear >= Number(range[1]) && selectedYear <= Number(range[2]));
}

function filterAndSort(source: Product[], filters: ProductSearch) {
  const query = filters.q?.trim().toLowerCase() ?? "";
  const category = filters.category?.toLowerCase() ?? "";
  return source.filter((product) => {
    const haystack = `${product.title} ${product.titleAr} ${product.oemNumber} ${product.category} ${product.compatibleVehicles.join(" ")}`.toLowerCase();
    return (!query || haystack.includes(query))
      && (!category || product.category.toLowerCase().includes(category))
      && (!filters.condition || product.condition === filters.condition)
      && (!filters.compatibility || product.compatibility === filters.compatibility)
      && (!filters.verified || product.seller.verified)
      && (!filters.make || haystack.includes(filters.make.toLowerCase()))
      && (!filters.model || haystack.includes(filters.model.toLowerCase()))
      && includesYear(haystack, filters.year)
      && includesDetail(haystack, filters.engineSize, /\b\d(?:\.\d)?l\b/)
      && includesDetail(haystack, filters.fuelType, /\b(petrol|diesel|hybrid|electric)\b/)
      && includesDetail(haystack, filters.engineType, /\b(i3|i4|i6|v6|v8|electric)\b/)
      && includesDetail(haystack, filters.trim, /\b(exr|gxr|vxr|xe|se|le|nismo|platinum|premier|xlt|lariat|raptor|amg|sport|limited)\b/);
  }).sort((a, b) => {
    if (filters.sort === "price-low") return a.price.amount - b.price.amount;
    if (filters.sort === "price-high") return b.price.amount - a.price.amount;
    if (filters.sort === "rating") return b.seller.rating - a.seller.rating;
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });
}

function mapRow(row: ProductRow): Product {
  const category = row.categories?.name_en ?? "Auto parts";
  const fitments = row.product_fitments ?? [];
  const sortedImages = [...(row.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const compatibility = fitments.some((item) => item.status === "confirmed")
    ? "confirmed"
    : fitments.some((item) => item.status === "possible") ? "possible" : "unverified";
  const fallback = mockProducts.find((product) => product.category.toLowerCase().includes(category.toLowerCase()))
    ?? mockProducts[0];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title_en,
    titleAr: row.title_ar,
    description: row.description_en,
    descriptionAr: row.description_ar,
    category,
    oemNumber: row.oem_number,
    price: { amount: row.price_minor / 100, currency: row.currency },
    condition: row.condition,
    grade: row.grade,
    compatibility,
    compatibleVehicles: fitments.map((item) => `${item.make} ${item.model} ${item.year_from}–${item.year_to}${item.engine ? ` ${item.engine}` : ""}${item.trim ? ` ${item.trim}` : ""}`),
    seller: {
      id: row.seller_profiles?.id ?? "unknown",
      marketplaceAccountId: row.seller_profiles?.stripe_account_id ?? undefined,
      name: row.seller_profiles?.display_name ?? "PartsLoop seller",
      city: row.seller_profiles?.city ?? "UAE",
      verified: row.seller_profiles?.verification_status === "verified",
      rating: Number(row.seller_profiles?.rating ?? 0),
      completedOrders: row.seller_profiles?.completed_orders ?? 0,
      responseMinutes: 15,
    },
    deliveryLabel: "Delivery estimate at checkout",
    warrantyDays: row.warranty_days,
    visual: visualByCategory[category.toLowerCase()] ?? fallback.visual,
    imageUrl: sortedImages[0]?.storage_path ? supabasePublicAsset("product-images", sortedImages[0].storage_path) : fallback.imageUrl,
    imageAlt: `${row.title_en} marketplace listing`,
    defects: Array.isArray(row.defects) ? row.defects : [],
  };
}

export async function searchMarketplaceProducts(filters: ProductSearch = {}): Promise<Product[]> {
  if (!isSupabaseConfigured() || process.env.DEMO_MODE !== "false") return filterAndSort(mockProducts, filters);
  try {
    const rows = await supabaseQuery<ProductRow[]>(`products?select=${encodeURIComponent(productSelect)}&status=eq.active&order=created_at.desc`);
    return filterAndSort(rows.map(mapRow), filters);
  } catch (error) {
    console.error("product_repository_fallback", error instanceof Error ? error.message : "unknown");
    return filterAndSort(mockProducts, filters);
  }
}

export async function findMarketplaceProduct(idOrSlug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured() || process.env.DEMO_MODE !== "false") {
    return mockProducts.find((product) => product.id === idOrSlug || product.slug === idOrSlug);
  }
  try {
    const key = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(idOrSlug) ? "id" : "slug";
    const rows = await supabaseQuery<ProductRow[]>(`products?select=${encodeURIComponent(productSelect)}&${key}=eq.${encodeURIComponent(idOrSlug)}&status=eq.active&limit=1`);
    return rows[0] ? mapRow(rows[0]) : undefined;
  } catch (error) {
    console.error("product_lookup_fallback", error instanceof Error ? error.message : "unknown");
    return mockProducts.find((product) => product.id === idOrSlug || product.slug === idOrSlug);
  }
}
