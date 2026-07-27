import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (process.env.PAYMENT_PROVIDER !== "stripe") return NextResponse.json({ received: true, mode: "mock" });
  const signature = request.headers.get("stripe-signature");
  if (!signature || !process.env.STRIPE_CONNECT_WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook signature missing." }, { status: 400 });
  // Production hook point: verify the raw body using Stripe's signing secret,
  // then upsert the event id before applying an idempotent order transition.
  return NextResponse.json({ received: true });
}
