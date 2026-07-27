import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";
import { SellerApprovalQueue } from "@/components/seller-approval-queue";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Seller approvals" };

export default async function SellerApprovalsPage() {
  await requireRole(["admin"], "/admin/sellers");
  return (
    <PortalShell role="admin" active="Seller approvals">
      <div className="portal-header"><div><span className="eyebrow">BUSINESS ONBOARDING</span><h1>Seller approvals</h1><p>Verify licence, identity, payout ownership, and physical inventory evidence.</p></div><span className="large-status warning">11 pending</span></div>
      <SellerApprovalQueue />
    </PortalShell>
  );
}
