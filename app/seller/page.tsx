import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { ProductVisual } from "@/components/product-visual";
import { requireRole } from "@/lib/auth";
import { products } from "@/lib/mock-data";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Seller dashboard" };

export default async function SellerDashboard() {
  await requireRole(["seller", "admin"], "/seller");
  return (
    <PortalShell role="seller" active="Overview">
      <div className="portal-header"><div><span className="eyebrow">SUNDAY, 26 JULY</span><h1>Good evening, Khalid</h1><p>Here’s what needs your attention today.</p></div><Link href="/seller/listings/new" className="button button-primary">＋ Sell a part</Link></div>
      <section className="metric-grid">
        <article><span className="metric-icon mint">□</span><small>Orders today</small><strong>12</strong><em>↑ 18% vs yesterday</em></article>
        <article><span className="metric-icon amber">⇢</span><small>Awaiting dispatch</small><strong>7</strong><em>3 due before 5pm</em></article>
        <article><span className="metric-icon blue">♢</span><small>Protected balance</small><strong>AED 4,250</strong><em>Across 6 orders</em></article>
        <article><span className="metric-icon purple">↗</span><small>Available payout</small><strong>AED 2,800</strong><em>Next payout tomorrow</em></article>
      </section>
      <section className="portal-grid">
        <div className="portal-panel">
          <div className="panel-heading"><div><h2>Orders to action</h2><p>Confirm and pack within the service window.</p></div><Link href="/seller/orders">View all →</Link></div>
          <div className="seller-order-row">
            <ProductVisual visual={products[0].visual} compact imageUrl={products[0].imageUrl} alt={products[0].imageAlt} />
            <div><strong>{products[0].title}</strong><small>PL-10482 • Dubai</small></div>
            <span className="status-chip amber">Pack by 4:30pm</span>
            <strong>{formatMoney(products[0].price)}</strong>
            <Link href="/seller/orders">Open</Link>
          </div>
          <div className="seller-order-row">
            <ProductVisual visual={products[2].visual} compact imageUrl={products[2].imageUrl} alt={products[2].imageAlt} />
            <div><strong>{products[2].title}</strong><small>PL-10479 • Abu Dhabi</small></div>
            <span className="status-chip mint">Courier booked</span>
            <strong>{formatMoney(products[2].price)}</strong>
            <Link href="/seller/orders">Open</Link>
          </div>
        </div>
        <aside className="portal-panel ai-panel">
          <span className="ai-spark">✦</span>
          <span className="eyebrow">AI LISTING ASSISTANT</span>
          <h2>Turn photos into a complete listing</h2>
          <p>Identify the part, read the OEM number, describe condition, and create Arabic + English copy.</p>
          <Link href="/seller/listings/new" className="button button-accent">Start with photos</Link>
          <small>Average draft time: 47 seconds</small>
        </aside>
      </section>
      <section className="portal-panel">
        <div className="panel-heading"><div><h2>Inventory health</h2><p>312 live listings • 18 need attention</p></div><Link href="/seller/inventory">Manage inventory →</Link></div>
        <div className="health-grid"><div><span style={{ width: "82%" }} /><strong>82%</strong><small>Listings with confirmed fitment</small></div><div><span style={{ width: "94%" }} /><strong>94%</strong><small>Listings with 4+ photos</small></div><div><span style={{ width: "67%" }} /><strong>67%</strong><small>Listings priced competitively</small></div></div>
      </section>
    </PortalShell>
  );
}
