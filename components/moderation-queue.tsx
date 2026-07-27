"use client";

import { useState } from "react";
import type { Product } from "@partsloop/contracts";
import { ProductVisual } from "./product-visual";
import { formatMoney } from "@/lib/money";

type Decision = "pending" | "approved" | "rejected";

export function ModerationQueue({ products }: { products: Product[] }) {
  const reviewProducts = [products[1], products[4], products[5]];
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [focused, setFocused] = useState(reviewProducts[0].id);
  const current = reviewProducts.find((product) => product.id === focused) ?? reviewProducts[0];

  return (
    <div className="moderation-layout">
      <section className="portal-panel moderation-list">
        <div className="panel-heading"><div><h2>Review queue</h2><p>{reviewProducts.filter((product) => !decisions[product.id]).length} pending risk decisions</p></div><select><option>Risk: highest first</option><option>Newest first</option><option>Value: highest first</option></select></div>
        {reviewProducts.map((product, index) => (
          <button type="button" className={`moderation-item ${focused === product.id ? "active" : ""}`} onClick={() => setFocused(product.id)} key={product.id}>
            <ProductVisual visual={product.visual} compact imageUrl={product.imageUrl} alt={product.imageAlt} />
            <div><span className={`risk ${index === 0 ? "high" : index === 1 ? "medium" : "low"}`}>{index === 0 ? "HIGH" : index === 1 ? "MED" : "LOW"}</span><strong>{product.title}</strong><small>{index === 0 ? "Duplicate image + price anomaly" : index === 1 ? "OEM fitment unverified" : "New seller first listing"}</small></div>
            <b>{decisions[product.id] === "approved" ? "✓" : decisions[product.id] === "rejected" ? "×" : "›"}</b>
          </button>
        ))}
      </section>
      <section className="portal-panel moderation-review">
        <div className="review-product-hero"><ProductVisual visual={current.visual} imageUrl={current.imageUrl} alt={current.imageAlt} /><div><span className="risk high">AI RISK 86</span><h2>{current.title}</h2><p>OEM {current.oemNumber} • {formatMoney(current.price)} • {current.seller.name}</p></div></div>
        <div className="risk-signals">
          <h3>Automated risk signals</h3>
          <div><span>Image reuse</span><strong className="risk high">High</strong><p>Image fingerprint appears on two other seller accounts.</p></div>
          <div><span>Price variance</span><strong className="risk medium">Medium</strong><p>Listed 37% below the median for the same OEM reference.</p></div>
          <div><span>Fitment evidence</span><strong className="risk low">Low</strong><p>OEM cross-reference matches one supplied compatible vehicle.</p></div>
        </div>
        <div className="moderation-facts"><div><small>Seller status</small><strong>{current.seller.verified ? "Verified business" : "Identity only"}</strong></div><div><small>Previous flags</small><strong>1 cleared</strong></div><div><small>Listing value</small><strong>{formatMoney(current.price)}</strong></div></div>
        <label className="review-note">Internal review note<textarea placeholder="Record the evidence behind your decision…" /></label>
        <div className="decision-actions">
          <button type="button" className="button button-danger" onClick={() => setDecisions((value) => ({ ...value, [current.id]: "rejected" }))}>Reject listing</button>
          <button type="button" className="button button-light">Request evidence</button>
          <button type="button" className="button button-primary" onClick={() => setDecisions((value) => ({ ...value, [current.id]: "approved" }))}>Approve listing</button>
        </div>
        {decisions[current.id] && <div className={`moderation-result ${decisions[current.id]}`}>{decisions[current.id] === "approved" ? "Listing approved and queued for publication." : "Listing rejected and seller notified."}</div>}
      </section>
    </div>
  );
}
