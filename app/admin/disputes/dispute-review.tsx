"use client";

import { useState } from "react";
import type { Dispute, Order } from "@partsloop/contracts";
import { ProductVisual } from "@/components/product-visual";
import { formatMoney } from "@/lib/money";

export function DisputeReview({ dispute, order }: { dispute: Dispute; order: Order }) {
  const [decision, setDecision] = useState<"refund" | "partial_refund" | "release">(dispute.recommendedResolution);
  const [resolved, setResolved] = useState(false);
  const [loading, setLoading] = useState(false);
  async function resolve() {
    setLoading(true);
    const response = await fetch(`/api/disputes/${dispute.id}/resolve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision, note: "Decision made from listing, OEM, and submitted evidence." }) });
    setLoading(false);
    if (response.ok) setResolved(true);
  }
  if (resolved) return <section className="publish-success"><span>✓</span><h2>Decision recorded</h2><p>The payment adapter and both parties have been notified. The audit entry is immutable.</p><a href="/admin" className="button button-primary">Return to operations</a></section>;
  return (
    <div className="dispute-layout">
      <div>
        <section className="portal-panel dispute-summary">
          <div className="summary-product"><ProductVisual visual={order.product.visual} compact imageUrl={order.product.imageUrl} alt={order.product.imageAlt} /><div><small>ORDER {order.publicId}</small><strong>{order.product.title}</strong><span>OEM {order.product.oemNumber}</span></div><b>{formatMoney(dispute.amount)}</b></div>
          <div className="dispute-facts"><div><small>Reason</small><strong>Part does not fit</strong></div><div><small>Compatibility claim</small><strong>Confirmed fit</strong></div><div><small>Protected amount</small><strong>{formatMoney(dispute.amount)}</strong></div><div><small>Inspection remaining</small><strong>31h 42m</strong></div></div>
        </section>
        <section className="portal-panel">
          <div className="panel-heading"><div><h2>Buyer statement</h2><p>Submitted 27 Jul, 13:04</p></div></div><blockquote>{dispute.buyerStatement}</blockquote>
          <div className="evidence-grid">{dispute.evidence.map((item, index) => <button key={item.label}><span>{item.type === "photo" ? (index === 0 ? "▥" : "OEM") : "PDF"}</span><strong>{item.label}</strong><small>{item.type}</small></button>)}</div>
        </section>
        <section className="portal-panel">
          <div className="panel-heading"><div><h2>Seller response</h2><p>Submitted 27 Jul, 15:19</p></div></div><blockquote>{dispute.sellerStatement}</blockquote>
        </section>
      </div>
      <aside>
        <section className="portal-panel recommendation">
          <span className="ai-spark">✦</span><span className="eyebrow">REVIEW ASSISTANT</span><h2>Refund recommended</h2><p>Buyer evidence shows an 8-pin vehicle harness and a 6-pin supplied part. The listing stated “confirmed fit” without a trim exception.</p>
          <div className="confidence-bar"><span style={{ width: "91%" }} /><small>91% evidence confidence</small></div>
          <ul><li>OEM photo matches shipped item</li><li>Connector mismatch visible</li><li>Courier confirms delivery</li><li>No evidence of buyer damage</li></ul>
        </section>
        <section className="portal-panel decision-card">
          <h2>Resolution</h2>
          <label className={decision === "refund" ? "selected" : ""}><input type="radio" name="decision" checked={decision === "refund"} onChange={() => setDecision("refund")} /><span><strong>Full refund</strong><small>Return part; refund buyer AED 905</small></span></label>
          <label className={decision === "partial_refund" ? "selected" : ""}><input type="radio" name="decision" checked={decision === "partial_refund"} onChange={() => setDecision("partial_refund")} /><span><strong>Partial refund</strong><small>Buyer keeps part; set amount later</small></span></label>
          <label className={decision === "release" ? "selected" : ""}><input type="radio" name="decision" checked={decision === "release"} onChange={() => setDecision("release")} /><span><strong>Release to seller</strong><small>Reject claim and release payout</small></span></label>
          <textarea placeholder="Internal decision note" rows={3} defaultValue="Connector mismatch makes the confirmed-fit claim inaccurate. Approve return with seller-funded shipping." />
          <button className="button button-danger" onClick={resolve} disabled={loading}>{loading ? "Recording decision…" : "Resolve dispute"}</button>
          <small>This action writes an audit event and triggers the configured payment adapter.</small>
        </section>
      </aside>
    </div>
  );
}
