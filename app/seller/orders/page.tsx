import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { ProductVisual } from "@/components/product-visual";
import { products } from "@/lib/mock-data";
import { formatMoney } from "@/lib/money";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Seller orders" };

const orderRows = [
  { id: "PL-10482", product: products[0], destination: "Dubai Marina", buyer: "Omar A.", status: "Pack by 4:30pm", tone: "amber", payout: 805, action: "Pack order" },
  { id: "PL-10479", product: products[2], destination: "Al Reem Island", buyer: "Sara M.", status: "Courier booked", tone: "blue", payout: 1130, action: "Shipping label" },
  { id: "PL-10463", product: products[3], destination: "Mirdif", buyer: "Yousef K.", status: "Inspection • 31h", tone: "mint", payout: 4670, action: "Track" },
  { id: "PL-10451", product: products[5], destination: "Ajman", buyer: "Noura H.", status: "Paid out", tone: "neutral", payout: 397, action: "Receipt" },
];

export default async function SellerOrdersPage() {
  await requireRole(["seller", "admin"], "/seller/orders");
  return (
    <PortalShell role="seller" active="Orders">
      <div className="portal-header"><div><span className="eyebrow">FULFILMENT</span><h1>Orders</h1><p>Four orders need attention across packing, delivery, and inspection.</p></div><button className="button button-light">Export orders</button></div>
      <section className="order-board-summary">
        <article><strong>3</strong><span>To confirm</span><small>Within 55 min</small></article>
        <article><strong>7</strong><span>To dispatch</span><small>3 pickup slots today</small></article>
        <article><strong>6</strong><span>In inspection</span><small>AED 4,250 protected</small></article>
        <article><strong>94%</strong><span>On-time dispatch</span><small>Last 30 days</small></article>
      </section>
      <section className="portal-panel seller-orders-table">
        <div className="panel-heading"><div><h2>Active orders</h2><p>Payment is secured before any shipment is released.</p></div><label className="table-select">Status <select><option>All active</option><option>To pack</option><option>In transit</option><option>Inspection</option></select></label></div>
        <div className="seller-orders-head"><span>Order & part</span><span>Buyer</span><span>Status</span><span>Payout</span><span /></div>
        {orderRows.map((row) => (
          <article className="seller-orders-line" key={row.id}>
            <div className="inventory-product"><ProductVisual visual={row.product.visual} compact imageUrl={row.product.imageUrl} alt={row.product.imageAlt} /><div><strong>{row.product.title}</strong><small>{row.id} • {row.destination}</small></div></div>
            <div><strong>{row.buyer}</strong><small>Verified buyer</small></div>
            <span className={`status-chip ${row.tone}`}>{row.status}</span>
            <div><strong>{formatMoney({ amount: row.payout, currency: "AED" })}</strong><small>After commission</small></div>
            <Link className="button button-light" href="/orders/ord_1">{row.action}</Link>
          </article>
        ))}
      </section>
    </PortalShell>
  );
}
