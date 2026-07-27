import { NextResponse } from "next/server";
import { validateCheckout } from "@partsloop/contracts";
import { findMarketplaceProduct } from "@/lib/repositories/products";
import { persistProtectedOrder } from "@/lib/repositories/orders";
import { getPaymentProvider } from "@/lib/marketplace/payments";
import { getLogisticsProvider } from "@/lib/marketplace/logistics";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (!idempotencyKey) return NextResponse.json({ error: "Idempotency-Key header is required." }, { status: 400 });
  const body = await request.json().catch(() => null);
  const validation = validateCheckout(body);
  if (!validation.success || !validation.data) return NextResponse.json({ error: "Please check the delivery information.", fields: validation.errors }, { status: 422 });
  const product = await findMarketplaceProduct(validation.data.productId);
  if (!product) return NextResponse.json({ error: "Product is no longer available." }, { status: 404 });
  const orderId = `PL-${Math.floor(10000 + Math.random() * 89999)}`;
  try {
    const payment = await getPaymentProvider().authorize({
      orderId,
      amount: { amount: product.price.amount + 55, currency: "AED" },
      sellerAccountId: product.seller.marketplaceAccountId ?? product.seller.id,
      idempotencyKey,
    });
    const shipment = await getLogisticsProvider().createShipment({
      orderId,
      pickup: { name: product.seller.name, phone: "+971000000000", city: product.seller.city, address: "Verified seller warehouse" },
      delivery: { name: validation.data.address.name, phone: validation.data.address.phone, city: validation.data.address.city, address: validation.data.address.line1 },
      weightKg: product.category === "Engines" ? 180 : 8,
      description: `${product.title} / ${product.oemNumber}`,
    });
    const session = await getSession();
    const persistedId = session ? await persistProtectedOrder({
      publicId: orderId,
      buyerId: session.id,
      product,
      checkout: validation.data,
      payment,
      shipment,
      idempotencyKey,
    }) : null;
    return NextResponse.json({ orderId, persistedId, paymentStatus: payment.status, paymentProvider: payment.provider, trackingNumber: shipment.trackingNumber, logisticsProvider: shipment.provider }, { status: 201 });
  } catch (error) {
    console.error("checkout_failed", { orderId, error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "We could not secure this order. No payment was captured." }, { status: 502 });
  }
}
