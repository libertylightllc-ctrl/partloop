import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";
import { requireRole } from "@/lib/auth";
import { ListingWizard } from "./listing-wizard";

export const metadata: Metadata = { title: "Create listing" };

export default async function NewListingPage() {
  await requireRole(["seller", "admin"], "/seller/listings/new");
  return (
    <PortalShell role="seller" active="Create listing">
      <div className="portal-header compact"><div><span className="eyebrow">AI LISTING ASSISTANT</span><h1>Create a trusted listing</h1><p>Start with clear photos and review every AI suggestion before publishing.</p></div></div>
      <ListingWizard />
    </PortalShell>
  );
}
