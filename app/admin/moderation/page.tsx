import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";
import { ModerationQueue } from "@/components/moderation-queue";
import { products } from "@/lib/mock-data";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Listing moderation" };

export default async function ModerationPage() {
  await requireRole(["admin"], "/admin/moderation");
  return (
    <PortalShell role="admin" active="Moderation">
      <div className="portal-header"><div><span className="eyebrow">TRUST & SAFETY</span><h1>Listing moderation</h1><p>Review AI signals alongside seller, image, pricing, and fitment evidence.</p></div><span className="live-indicator"><i /> Risk engine live</span></div>
      <ModerationQueue products={products} />
    </PortalShell>
  );
}
