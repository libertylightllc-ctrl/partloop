"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Suggestion = {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  grade: string;
  suggestedPrice: number;
  compatibility: string[];
  confidence: number;
};

export function ListingWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [published, setPublished] = useState(false);

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/listings/ai-assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const result = await response.json() as Suggestion & { error?: string };
    setLoading(false);
    if (response.ok) {
      setSuggestion(result);
      setStep(3);
    }
  }

  if (published) return (
    <section className="publish-success">
      <span>✓</span><h2>Listing published</h2><p>Your English and Arabic listing is live and ready for buyer fitment checks.</p>
      <div><Link href="/products/toyota-land-cruiser-led-headlight-81150-60r30" className="button button-primary">View listing</Link><button className="button button-light" onClick={() => { setPublished(false); setStep(1); setSuggestion(null); }}>Create another</button></div>
    </section>
  );

  return (
    <div className="wizard-shell">
      <ol className="wizard-steps">
        {["Photos", "Part details", "AI review", "Publish"].map((label, index) => <li key={label} className={step >= index + 1 ? "active" : ""}><span>{step > index + 1 ? "✓" : index + 1}</span><strong>{label}</strong></li>)}
      </ol>
      {step === 1 && (
        <section className="wizard-card">
          <div className="wizard-heading"><span className="step-icon">▧</span><div><h2>Add 4–6 clear photos</h2><p>Include the full part, OEM label, connectors, mounting points, and any defects.</p></div></div>
          <div className="upload-grid">
            <button className="upload-main" onClick={() => setStep(2)}><span>＋</span><strong>Add part photos</strong><small>Tap to use demo photos</small></button>
            {[1, 2, 3].map((item) => <div className="upload-tip" key={item}><span>{item === 1 ? "◖" : item === 2 ? "OEM" : "!"}</span><small>{item === 1 ? "Full part" : item === 2 ? "Label close-up" : "Show defects"}</small></div>)}
          </div>
          <div className="photo-guidance"><strong>Photo guidance</strong><span>✓ Use natural light</span><span>✓ Keep the whole part in frame</span><span>✓ Don’t hide scratches or damage</span></div>
        </section>
      )}
      {step === 2 && (
        <form className="wizard-card" onSubmit={analyze}>
          <div className="wizard-heading"><span className="step-icon">✦</span><div><h2>Confirm what you know</h2><p>The assistant will combine your answers with photo and OEM analysis.</p></div></div>
          <div className="form-grid listing-fields">
            <label>Part name<input name="partName" defaultValue="Front left LED headlight" required minLength={3} /></label>
            <label>OEM number<input name="oemNumber" defaultValue="81150-60R30" required minLength={4} /></label>
            <label>Donor vehicle<input name="donorVehicle" defaultValue="Toyota Land Cruiser 2021 GXR 4.0L" required /></label>
            <label>Condition<select name="condition" defaultValue="used"><option value="new">New</option><option value="used">Used</option><option value="refurbished">Refurbished</option></select></label>
            <label className="full-span">Known condition notes<textarea name="notes" defaultValue="Two faint surface marks. No cracks. All mounting tabs intact. Bench tested." rows={4} /></label>
          </div>
          <div className="wizard-actions"><button type="button" className="button button-light" onClick={() => setStep(1)}>Back</button><button className="button button-primary" disabled={loading}>{loading ? "Analysing photos & OEM…" : "Generate listing with AI ✦"}</button></div>
        </form>
      )}
      {step === 3 && suggestion && (
        <section className="wizard-card review-card">
          <div className="review-score"><span>✦</span><div><small>AI CONFIDENCE</small><strong>{suggestion.confidence}%</strong></div><p>Review before publishing. Compatibility remains seller-confirmed.</p></div>
          <div className="review-grid">
            <div className="review-preview"><span className="eyebrow">ENGLISH LISTING</span><h2 contentEditable suppressContentEditableWarning>{suggestion.title}</h2><p contentEditable suppressContentEditableWarning>{suggestion.description}</p><div className="review-tags"><span>{suggestion.category}</span><span>{suggestion.grade}</span><span>OEM 81150-60R30</span></div></div>
            <div className="review-preview" dir="rtl"><span className="eyebrow">الإعلان العربي</span><h2 contentEditable suppressContentEditableWarning>{suggestion.titleAr}</h2><p contentEditable suppressContentEditableWarning>{suggestion.descriptionAr}</p><div className="review-tags"><span>إضاءة</span><span>درجة A</span></div></div>
          </div>
          <div className="ai-facts">
            <div><small>Suggested price</small><strong>AED {suggestion.suggestedPrice}</strong><span>Market range AED 800–950</span></div>
            <div><small>Compatible vehicles</small><strong>{suggestion.compatibility[0]}</strong><span>{suggestion.compatibility.slice(1).join(" • ")}</span></div>
            <div><small>Visible condition</small><strong>No cracks detected</strong><span>Two light surface marks</span></div>
          </div>
          <label className="seller-confirm"><input type="checkbox" required defaultChecked /> I confirm the part details, defects, and compatibility information are accurate.</label>
          <div className="wizard-actions"><button className="button button-light" onClick={() => setStep(2)}>Edit details</button><button className="button button-primary" onClick={() => { setStep(4); setPublished(true); }}>Publish listing</button></div>
        </section>
      )}
    </div>
  );
}
