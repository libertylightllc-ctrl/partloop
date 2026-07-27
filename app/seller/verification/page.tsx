import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Seller verification" };

export default async function VerificationPage() {
  await requireRole(["seller", "admin"], "/seller/verification");
  return (
    <PortalShell role="seller" active="Verification">
      <div className="portal-header compact"><div><span className="eyebrow">TRUST & COMPLIANCE</span><h1>Seller verification</h1><p>Your business is verified. Keep documents current to retain your badge and payouts.</p></div><span className="large-status success">✓ Verified seller</span></div>
      <section className="verification-grid"><article className="verification-item complete"><span>✓</span><div><strong>Trade licence</strong><small>Expires 18 May 2027</small></div><button>View</button></article><article className="verification-item complete"><span>✓</span><div><strong>Identity check</strong><small>Owner verified 12 May 2026</small></div><button>View</button></article><article className="verification-item complete"><span>✓</span><div><strong>Bank account</strong><small>Account ending 8842 matched</small></div><button>View</button></article><article className="verification-item pending"><span>!</span><div><strong>Warehouse address</strong><small>Annual re-check due in 18 days</small></div><button>Update</button></article></section>
    </PortalShell>
  );
}
