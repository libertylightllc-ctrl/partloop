import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin operations" };

export default async function AdminDashboard() {
  await requireRole(["admin"], "/admin");
  return (
    <PortalShell role="admin" active="Operations">
      <div className="portal-header"><div><span className="eyebrow">MARKETPLACE OPERATIONS</span><h1>Risk & operations</h1><p>Live signals across payments, listings, sellers, and deliveries.</p></div><span className="live-indicator"><i /> All systems operational</span></div>
      <section className="metric-grid admin-metrics">
        <article><span className="metric-icon red">!</span><small>Open disputes</small><strong>8</strong><em>2 high value</em></article>
        <article><span className="metric-icon amber">⌕</span><small>Listings to review</small><strong>23</strong><em>7 AI-risk flagged</em></article>
        <article><span className="metric-icon blue">○</span><small>Seller applications</small><strong>11</strong><em>Oldest: 18 hours</em></article>
        <article><span className="metric-icon purple">♢</span><small>Protected funds</small><strong>AED 286k</strong><em>Across 319 orders</em></article>
      </section>
      <section className="admin-grid">
        <div className="portal-panel">
          <div className="panel-heading"><div><h2>Priority queue</h2><p>Items ordered by customer and financial risk.</p></div><Link href="/admin/disputes">Open queue →</Link></div>
          <div className="queue-row"><span className="risk high">HIGH</span><div><strong>Fitment dispute • PL-10482</strong><small>AED 905 • Buyer inspection ends in 31h</small></div><span>Under review</span><Link href="/admin/disputes">Review</Link></div>
          <div className="queue-row"><span className="risk medium">MED</span><div><strong>Duplicate image signal • Listing 8872</strong><small>AED 12,800 • Engine listing</small></div><span>AI flagged</span><Link href="/admin/moderation">Review</Link></div>
          <div className="queue-row"><span className="risk low">LOW</span><div><strong>Seller verification • Gulf Parts LLC</strong><small>Trade licence and bank account matched</small></div><span>Ready</span><Link href="/admin/sellers">Review</Link></div>
        </div>
        <aside className="portal-panel">
          <div className="panel-heading"><div><h2>Marketplace health</h2><p>Last 24 hours</p></div></div>
          <div className="ops-health"><div><span>Payment authorization</span><strong>98.7%</strong></div><div><span>On-time courier pickup</span><strong>94.2%</strong></div><div><span>Confirmed-fit listings</span><strong>81.6%</strong></div><div><span>Dispute rate</span><strong>1.8%</strong></div></div>
        </aside>
      </section>
    </PortalShell>
  );
}
