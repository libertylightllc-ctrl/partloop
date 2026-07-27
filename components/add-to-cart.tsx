"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useCart } from "./cart-provider";

export function AddToCart({
  productId,
  locale,
  sellerName,
  sellerResponseMinutes,
  oemNumber,
}: {
  productId: string;
  locale: "en" | "ar";
  sellerName: string;
  sellerResponseMinutes: number;
  oemNumber: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [messages, setMessages] = useState([
    { from: "seller", text: locale === "ar" ? "مرحباً، القطعة متوفرة وتم اختبارها اليوم." : "Hi, the part is available and was tested today." },
  ]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = String(form.get("message") ?? "").trim();
    if (!text) return;
    setMessages((current) => [...current, { from: "buyer", text }]);
    event.currentTarget.reset();
  }

  return (
    <>
      <div className="purchase-actions">
        <button
          className="button button-primary"
          type="button"
          onClick={() => {
            add(productId);
            setAdded(true);
          }}
        >
          {added ? (locale === "ar" ? "أضيفت للسلة ✓" : "Added to cart ✓") : (locale === "ar" ? "أضف إلى السلة" : "Add to cart")}
        </button>
        <Link className="button button-dark" href={`/checkout?product=${productId}`}>
          {locale === "ar" ? "اشتر الآن" : "Buy now"}
        </Link>
      </div>
      <div className="secondary-purchase-actions">
        <button type="button" onClick={() => setOfferOpen(true)}>↘ {locale === "ar" ? "قدم عرضاً" : "Make an offer"}</button>
        <button type="button" onClick={() => setChatOpen(true)}>◌ {locale === "ar" ? "اسأل البائع" : "Ask the seller"}</button>
      </div>

      {offerOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setOfferOpen(false);
        }}>
          <section className="offer-modal" role="dialog" aria-modal="true" aria-labelledby="offer-title">
            <div className="modal-heading"><div><span className="eyebrow">{locale === "ar" ? "تفاوض آمن" : "PROTECTED NEGOTIATION"}</span><h2 id="offer-title">{locale === "ar" ? "قدم عرض سعر" : "Make your offer"}</h2></div><button onClick={() => setOfferOpen(false)} aria-label="Close">×</button></div>
            {offerSent ? (
              <div className="offer-success"><span>✓</span><h3>{locale === "ar" ? "تم إرسال عرضك" : "Your offer is with the seller"}</h3><p>{locale === "ar" ? "إذا قبله البائع، سيكون السعر صالحاً لمدة ساعتين." : "If accepted, the price will be reserved for two hours."}</p><button className="button button-primary" onClick={() => setOfferOpen(false)}>{locale === "ar" ? "تم" : "Done"}</button></div>
            ) : (
              <>
                <label className="offer-field">{locale === "ar" ? "سعر العرض" : "Offer amount"}<div><span>AED</span><input type="number" min="650" max="849" defaultValue="790" /></div></label>
                <div className="offer-guide"><div><span style={{ width: "72%" }} /></div><small>{locale === "ar" ? "عرض قوي — قريب من الأسعار المقبولة" : "Strong offer — close to commonly accepted prices"}</small></div>
                <p className="offer-note">{locale === "ar" ? "لن يتم خصم أي مبلغ حتى تقبل العرض وتكمل الدفع المحمي." : "Nothing is charged until the seller accepts and you complete protected checkout."}</p>
                <button className="button button-primary modal-full" onClick={() => setOfferSent(true)}>{locale === "ar" ? "إرسال العرض" : "Send offer"}</button>
              </>
            )}
          </section>
        </div>
      )}

      {chatOpen && (
        <aside className="chat-drawer" aria-label="Seller chat">
          <div className="chat-header"><div><span className="chat-online" /><div><strong>{sellerName}</strong><small>{locale === "ar" ? `متصل • يرد خلال ${sellerResponseMinutes} دقيقة` : `Online • replies in about ${sellerResponseMinutes} min`}</small></div></div><button onClick={() => setChatOpen(false)} aria-label="Close chat">×</button></div>
          <div className="chat-product"><span>OEM</span><div><strong>{oemNumber}</strong><small>{locale === "ar" ? "الدفع والاتصال محميان" : "Payment and contact stay protected"}</small></div></div>
          <div className="chat-messages">
            <time>{locale === "ar" ? "اليوم" : "Today"}</time>
            {messages.map((message, index) => <p key={`${message.from}-${index}`} className={message.from}>{message.text}</p>)}
          </div>
          <div className="quick-questions">
            <button onClick={() => setMessages((current) => [...current, { from: "buyer", text: "Can you confirm all mounting tabs are intact?" }])}>{locale === "ar" ? "هل القواعد سليمة؟" : "Mounting tabs intact?"}</button>
            <button onClick={() => setMessages((current) => [...current, { from: "buyer", text: "Can you verify this against my VIN?" }])}>{locale === "ar" ? "تحقق من VIN" : "Verify my VIN"}</button>
          </div>
          <form className="chat-compose" onSubmit={sendMessage}><input name="message" placeholder={locale === "ar" ? "اكتب رسالتك…" : "Write a message…"} /><button aria-label="Send message">➤</button></form>
        </aside>
      )}
    </>
  );
}
