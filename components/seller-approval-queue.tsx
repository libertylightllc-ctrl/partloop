"use client";

import { useState } from "react";

const applicants = [
  { id: "gulf", mark: "GP", name: "Gulf Parts LLC", city: "Dubai", age: "18h", risk: "low", licence: "CN-4421081", owner: "Hassan Al Mansoori", score: 94 },
  { id: "rak", mark: "RA", name: "RAK Auto Dismantlers", city: "Ras Al Khaimah", age: "7h", risk: "medium", licence: "RAK-118902", owner: "Faisal Rahman", score: 76 },
  { id: "nour", mark: "NP", name: "Nour New Parts Trading", city: "Sharjah", age: "2h", risk: "low", licence: "SHJ-882104", owner: "Nour Al Ali", score: 91 },
];

export function SellerApprovalQueue() {
  const [focused, setFocused] = useState(applicants[0].id);
  const [resolved, setResolved] = useState<Record<string, "approved" | "more_info">>({});
  const current = applicants.find((applicant) => applicant.id === focused) ?? applicants[0];
  return (
    <div className="approval-layout">
      <section className="portal-panel approval-list">
        <div className="panel-heading"><div><h2>Applications</h2><p>11 awaiting review</p></div></div>
        {applicants.map((applicant) => (
          <button type="button" className={focused === applicant.id ? "active" : ""} key={applicant.id} onClick={() => setFocused(applicant.id)}>
            <span className="seller-avatar">{applicant.mark}</span><div><strong>{applicant.name}</strong><small>{applicant.city} • submitted {applicant.age} ago</small></div><i className={`risk-dot ${applicant.risk}`} />
          </button>
        ))}
      </section>
      <section className="portal-panel approval-review">
        <div className="business-heading"><span className="seller-avatar">{current.mark}</span><div><span className="eyebrow">PROFESSIONAL SELLER</span><h2>{current.name}</h2><p>{current.city}, United Arab Emirates</p></div><strong>{current.score}<small>/100 trust</small></strong></div>
        <div className="verification-checks">
          <article className="complete"><span>✓</span><div><strong>Trade licence verified</strong><small>{current.licence} • issuing authority matched</small></div></article>
          <article className="complete"><span>✓</span><div><strong>Owner identity matched</strong><small>{current.owner} • Emirates ID and licence agree</small></div></article>
          <article className="complete"><span>✓</span><div><strong>Bank beneficiary matched</strong><small>Business IBAN ownership confirmed</small></div></article>
          <article className={current.risk === "low" ? "complete" : "pending"}><span>{current.risk === "low" ? "✓" : "!"}</span><div><strong>Warehouse evidence</strong><small>{current.risk === "low" ? "Location and inventory photos verified" : "One exterior image needs manual confirmation"}</small></div></article>
        </div>
        <div className="approval-details"><div><small>Business type</small><strong>Auto parts trading</strong></div><div><small>Expected listings</small><strong>250–500</strong></div><div><small>Returns address</small><strong>Verified</strong></div><div><small>Connect payout</small><strong>Ready</strong></div></div>
        <label className="review-note">Reviewer note<textarea defaultValue={current.risk === "low" ? "Documents and ownership details are consistent." : "Request clearer exterior warehouse image before activation."} /></label>
        <div className="decision-actions"><button className="button button-light" onClick={() => setResolved((value) => ({ ...value, [current.id]: "more_info" }))}>Request more information</button><button className="button button-primary" onClick={() => setResolved((value) => ({ ...value, [current.id]: "approved" }))}>Approve seller</button></div>
        {resolved[current.id] && <div className="moderation-result approved">{resolved[current.id] === "approved" ? "Seller approved with professional marketplace access." : "Information request sent; application remains protected."}</div>}
      </section>
    </div>
  );
}
