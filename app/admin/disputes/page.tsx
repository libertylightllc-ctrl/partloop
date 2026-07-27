import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";
import { requireRole } from "@/lib/auth";
import { disputes, orders } from "@/lib/mock-data";
import { DisputeReview } from "./dispute-review";

export const metadata: Metadata = { title: "Admin dispute review" };

export default async function DisputesPage() {
  await requireRole(["admin"], "/admin/disputes");
  return (
    <PortalShell role="admin" active="Disputes">
      <div className="portal-header compact"><div><span className="eyebrow">PROTECTED PAYMENT REVIEW</span><h1>Dispute {disputes[0].id.toUpperCase()}</h1><p>Order {disputes[0].orderId} • Payment remains held pending a decision.</p></div><span className="large-status warning">Under review</span></div>
      <DisputeReview dispute={disputes[0]} order={orders[0]} />
    </PortalShell>
  );
}
