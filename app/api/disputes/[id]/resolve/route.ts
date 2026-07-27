import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/marketplace/payments";

const validDecisions = ["refund", "partial_refund", "release"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({})) as { decision?: string; note?: string };
  if (!body.decision || !validDecisions.includes(body.decision) || !body.note?.trim()) return NextResponse.json({ error: "Decision and audit note are required." }, { status: 422 });
  const provider = getPaymentProvider();
  if (body.decision === "release") await provider.capture("mock_pi_10482", { amount: 850, currency: "AED" });
  else if (body.decision === "refund") await provider.refund("mock_pi_10482", { amount: 905, currency: "AED" });
  else await provider.refund("mock_pi_10482", { amount: 225, currency: "AED" });
  return NextResponse.json({ disputeId: id, status: "resolved", decision: body.decision, resolvedAt: new Date().toISOString() });
}
