"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale, Product } from "@partsloop/contracts";
import { ProductVisual } from "@/components/product-visual";
import { formatMoney } from "@/lib/money";
import { useCart } from "@/components/cart-provider";
import Link from "next/link";

export function CheckoutClient({ locale, product }: { locale: Locale; product: Product }) {
  const ar = locale === "ar";
  const router = useRouter();
  const { clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
        address: {
          name: form.get("name"),
          phone: form.get("phone"),
          line1: form.get("line1"),
          city: form.get("city"),
          country: "AE",
        },
      }),
    });
    const result = await response.json() as { orderId?: string; error?: string };
    if (!response.ok || !result.orderId) {
      setError(result.error ?? "Checkout could not be completed.");
      setSubmitting(false);
      return;
    }
    clear();
    router.push(`/orders/${result.orderId}?created=1`);
  }

  const delivery = 35;
  const serviceFee = 20;
  return (
    <main className="page-shell checkout-shell">
      <div className="checkout-steps"><span className="complete">1 Cart</span><i /><span className="active">2 {ar ? "الدفع" : "Checkout"}</span><i /><span>3 {ar ? "التأكيد" : "Confirmation"}</span></div>
      <form className="checkout-layout" onSubmit={submit}>
        <div className="checkout-form">
          <section className="form-card">
            <div className="number-title"><span>1</span><div><h2>{ar ? "عنوان التوصيل" : "Delivery address"}</h2><p>{ar ? "سيستخدم الشاحن هذا العنوان للاستلام." : "The courier will use these details for tracked delivery."}</p></div></div>
            <div className="form-grid">
              <label>{ar ? "الاسم الكامل" : "Full name"}<input name="name" defaultValue="Omar Khalid" required minLength={2} /></label>
              <label>{ar ? "رقم الهاتف" : "Mobile number"}<input name="phone" defaultValue="+971 50 123 4567" required minLength={7} /></label>
              <label className="full-span">{ar ? "العنوان" : "Street address"}<input name="line1" defaultValue="Building 12, Al Barsha 1" required minLength={4} /></label>
              <label>{ar ? "المدينة" : "City"}<select name="city" defaultValue="Dubai"><option>Dubai</option><option>Abu Dhabi</option><option>Sharjah</option><option>Ajman</option></select></label>
              <label>{ar ? "الدولة" : "Country"}<input value="United Arab Emirates" readOnly /></label>
            </div>
          </section>
          <section className="form-card">
            <div className="number-title"><span>2</span><div><h2>{ar ? "طريقة الدفع" : "Payment method"}</h2><p>{ar ? "هذه تجربة دفع محمية باستخدام مزود وهمي." : "This demo uses the local protected-payment adapter."}</p></div></div>
            <label className="payment-option selected"><input type="radio" defaultChecked name="payment" /><span className="mock-card">VISA</span><div><strong>{ar ? "بطاقة تجريبية" : "Demo card"}</strong><small>•••• 4242 • {ar ? "لا توجد رسوم حقيقية" : "No real charge"}</small></div><b>✓</b></label>
            <div className="escrow-explainer"><span>♢</span><div><strong>{ar ? "دفعك محمي" : "Your payment is protected"}</strong><p>{ar ? "يتم حجز المبلغ ولا يحول للبائع حتى الاستلام وانتهاء فترة الفحص." : "Funds are authorized and held from seller payout until delivery and the 48-hour inspection period."}</p></div></div>
          </section>
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
        <aside className="order-summary checkout-summary">
          <h2>{ar ? "طلبك" : "Your order"}</h2>
          <div className="summary-product"><ProductVisual visual={product.visual} compact imageUrl={product.imageUrl} alt={product.imageAlt} /><div><strong>{ar ? product.titleAr : product.title}</strong><small>OEM {product.oemNumber}</small><span>Qty 1</span></div></div>
          <div><span>{ar ? "القطعة" : "Part"}</span><strong>{formatMoney(product.price, locale)}</strong></div>
          <div><span>{ar ? "التوصيل" : "Delivery"}</span><strong>{formatMoney({ amount: delivery, currency: "AED" }, locale)}</strong></div>
          <div><span>{ar ? "رسوم الحماية" : "Protection fee"}</span><strong>{formatMoney({ amount: serviceFee, currency: "AED" }, locale)}</strong></div>
          <div className="summary-total"><span>{ar ? "الإجمالي" : "Total"}</span><strong>{formatMoney({ amount: product.price.amount + delivery + serviceFee, currency: "AED" }, locale)}</strong></div>
          <label className="legal-consent">
            <input type="checkbox" name="legalConsent" required />
            <span>{ar ? <>أوافق على <Link href="/terms">الشروط</Link> و<Link href="/returns">سياسة الإرجاع</Link> و<Link href="/buyer-protection">حماية المشتري</Link>.</> : <>I agree to the <Link href="/terms">Terms</Link>, <Link href="/returns">Returns Policy</Link> and <Link href="/buyer-protection">Buyer Protection</Link>.</>}</span>
          </label>
          <button className="button button-primary" disabled={submitting}>{submitting ? (ar ? "جارٍ التأمين…" : "Securing payment…") : (ar ? "ادفع بأمان" : "Pay securely")}</button>
          <p className="summary-protection">🔒 {ar ? "تشفير آمن • إلغاء مجاني قبل الشحن" : "Secure checkout • Cancel before dispatch"}</p>
        </aside>
      </form>
    </main>
  );
}
