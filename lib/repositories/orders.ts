import type { CheckoutInput, Product } from "@partsloop/contracts";
import type { AuthorizedPayment } from "@/lib/marketplace/payments";
import type { Shipment } from "@/lib/marketplace/logistics";
import { isSupabaseConfigured, supabaseQuery } from "@/lib/supabase-rest";

interface PersistOrderInput {
  publicId: string;
  buyerId: string;
  product: Product;
  checkout: CheckoutInput;
  payment: AuthorizedPayment;
  shipment: Shipment;
  idempotencyKey: string;
}

export async function persistProtectedOrder(input: PersistOrderInput) {
  if (!isSupabaseConfigured() || process.env.DEMO_MODE !== "false") return null;
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(input.buyerId) || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(input.product.id)) return null;
  const subtotalMinor = Math.round(input.product.price.amount * 100);
  const result = await supabaseQuery<Array<{ order_id: string }>>("rpc/create_marketplace_order", {
    method: "POST",
    body: JSON.stringify({
      p_public_id: input.publicId,
      p_buyer_id: input.buyerId,
      p_seller_id: input.product.seller.id,
      p_product_id: input.product.id,
      p_quantity: input.checkout.quantity,
      p_subtotal_minor: subtotalMinor * input.checkout.quantity,
      p_delivery_minor: 3500,
      p_service_fee_minor: 2000,
      p_currency: input.product.price.currency,
      p_delivery_address: input.checkout.address,
      p_title_snapshot: { en: input.product.title, ar: input.product.titleAr },
      p_oem_snapshot: input.product.oemNumber,
      p_payment_provider: input.payment.provider,
      p_payment_reference: input.payment.id,
      p_idempotency_key: input.idempotencyKey,
      p_logistics_provider: input.shipment.provider,
      p_tracking_number: input.shipment.trackingNumber,
      p_label_url: input.shipment.labelUrl ?? null,
    }),
  });
  return result[0]?.order_id ?? null;
}
