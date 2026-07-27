export type Locale = "en" | "ar";
export type UserRole = "buyer" | "seller" | "admin";
export type ListingCondition = "new" | "used" | "refurbished";
export type ConditionGrade = "new" | "a" | "b" | "c" | "repair" | "untested";
export type CompatibilityStatus = "confirmed" | "possible" | "unverified";
export type OrderStatus =
  | "payment_secured"
  | "seller_confirmed"
  | "packed"
  | "collected"
  | "out_for_delivery"
  | "delivered"
  | "inspection"
  | "released"
  | "disputed"
  | "refunded";

export interface Money {
  amount: number;
  currency: "AED" | "SAR" | "QAR" | "BHD" | "KWD" | "OMR";
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  trim?: string;
  vin?: string;
}

export interface SellerSummary {
  id: string;
  marketplaceAccountId?: string;
  name: string;
  city: string;
  verified: boolean;
  rating: number;
  completedOrders: number;
  responseMinutes: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  oemNumber: string;
  price: Money;
  condition: ListingCondition;
  grade: ConditionGrade;
  compatibility: CompatibilityStatus;
  compatibleVehicles: string[];
  seller: SellerSummary;
  deliveryLabel: string;
  warrantyDays: number;
  visual: "headlight" | "engine" | "mirror" | "gearbox" | "wheel" | "bumper" | "suspension" | "electronics" | "brakes" | "turbo";
  imageUrl: string;
  imageAlt: string;
  defects: string[];
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderEvent {
  status: OrderStatus;
  label: string;
  labelAr: string;
  at?: string;
  complete: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  publicId: string;
  product: Product;
  quantity: number;
  subtotal: Money;
  delivery: Money;
  serviceFee: Money;
  total: Money;
  status: OrderStatus;
  paymentIntentId: string;
  trackingNumber: string;
  inspectionEndsAt?: string;
  events: OrderEvent[];
}

export interface Dispute {
  id: string;
  orderId: string;
  reason: "wrong_part" | "does_not_fit" | "damage" | "missing_component" | "not_working";
  buyerStatement: string;
  sellerStatement: string;
  status: "open" | "awaiting_seller" | "under_review" | "resolved";
  amount: Money;
  evidence: Array<{ label: string; type: "photo" | "video" | "document" }>;
  recommendedResolution: "refund" | "partial_refund" | "release";
}

export interface CheckoutInput {
  productId: string;
  quantity: number;
  address: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    country: string;
  };
}

export interface ListingDraftInput {
  partName: string;
  oemNumber: string;
  donorVehicle: string;
  condition: ListingCondition;
  notes: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function validateCheckout(input: unknown): ValidationResult<CheckoutInput> {
  if (!input || typeof input !== "object") {
    return { success: false, errors: { form: "Invalid checkout request." } };
  }
  const value = input as Record<string, unknown>;
  const address = (value.address ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  if (typeof value.productId !== "string" || value.productId.length < 2) errors.productId = "Product is required.";
  if (!Number.isInteger(value.quantity) || Number(value.quantity) < 1 || Number(value.quantity) > 10) errors.quantity = "Quantity must be between 1 and 10.";
  for (const field of ["name", "phone", "line1", "city", "country"]) {
    if (typeof address[field] !== "string" || String(address[field]).trim().length < 2) errors[`address.${field}`] = `${field} is required.`;
  }
  return Object.keys(errors).length
    ? { success: false, errors }
    : { success: true, data: input as CheckoutInput };
}

export function validateListingDraft(input: unknown): ValidationResult<ListingDraftInput> {
  if (!input || typeof input !== "object") return { success: false, errors: { form: "Invalid listing." } };
  const value = input as Record<string, unknown>;
  const errors: Record<string, string> = {};
  if (typeof value.partName !== "string" || value.partName.trim().length < 3) errors.partName = "Enter a recognizable part name.";
  if (typeof value.oemNumber !== "string" || value.oemNumber.trim().length < 4) errors.oemNumber = "Enter at least four OEM characters.";
  if (typeof value.donorVehicle !== "string" || value.donorVehicle.trim().length < 3) errors.donorVehicle = "Donor vehicle is required.";
  if (!["new", "used", "refurbished"].includes(String(value.condition))) errors.condition = "Choose a valid condition.";
  return Object.keys(errors).length
    ? { success: false, errors }
    : { success: true, data: input as ListingDraftInput };
}
