"use client";

import Link from "next/link";
import type { Locale, Product } from "@partsloop/contracts";
import { ProductVisual } from "@/components/product-visual";
import { useCart } from "@/components/cart-provider";
import { formatMoney } from "@/lib/money";

export function CartPageClient({ locale, catalog }: { locale: Locale; catalog: Product[] }) {
  const { items, remove } = useCart();
  const ar = locale === "ar";
  const lines = items.map((item) => ({ item, product: catalog.find((product) => product.id === item.productId) })).filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + (line.product?.price.amount ?? 0) * line.item.quantity, 0);
  if (!lines.length) return (
    <main className="empty-state page-shell">
      <span className="empty-icon">Bag</span><h1>{ar ? "سلة التسوق فارغة" : "Your cart is ready for the right part"}</h1>
      <p>{ar ? "أضف قطعة متوافقة من الكتالوج." : "Add a compatible part from the catalogue to get started."}</p>
      <Link href="/search" className="button button-primary">{ar ? "تصفح القطع" : "Browse parts"}</Link>
    </main>
  );
  return (
    <main className="page-shell checkout-shell">
      <div className="search-header"><div><span className="eyebrow">{ar ? "سلة التسوق" : "YOUR CART"}</span><h1>{ar ? "راجع قطعك" : "Review your parts"}</h1></div></div>
      <div className="cart-layout">
        <section className="cart-items">
          {lines.map(({ item, product }) => product && (
            <article className="cart-line" key={product.id}>
              <ProductVisual visual={product.visual} compact imageUrl={product.imageUrl} alt={product.imageAlt} />
              <div><strong>{ar ? product.titleAr : product.title}</strong><span>OEM {product.oemNumber}</span><span className="cart-fit">✓ {ar ? "متوافق مع سيارتك" : "Fits your saved vehicle"}</span></div>
              <div className="cart-line-end"><strong>{formatMoney({ ...product.price, amount: product.price.amount * item.quantity }, locale)}</strong><button onClick={() => remove(product.id)}>{ar ? "إزالة" : "Remove"}</button></div>
            </article>
          ))}
        </section>
        <aside className="order-summary">
          <h2>{ar ? "ملخص الطلب" : "Order summary"}</h2>
          <div><span>{ar ? "المجموع" : "Subtotal"}</span><strong>{formatMoney({ amount: subtotal, currency: "AED" }, locale)}</strong></div>
          <div><span>{ar ? "التوصيل" : "Delivery"}</span><strong>{formatMoney({ amount: 35, currency: "AED" }, locale)}</strong></div>
          <div><span>{ar ? "رسوم الحماية" : "Protection fee"}</span><strong>{formatMoney({ amount: 20, currency: "AED" }, locale)}</strong></div>
          <div className="summary-total"><span>{ar ? "الإجمالي" : "Total"}</span><strong>{formatMoney({ amount: subtotal + 55, currency: "AED" }, locale)}</strong></div>
          <Link href={`/checkout?product=${lines[0].product?.id}`} className="button button-primary">{ar ? "انتقل للدفع" : "Secure checkout"}</Link>
          <p className="summary-protection">♢ {ar ? "لن يستلم البائع المبلغ حتى التسليم." : "Seller payout is held until delivery."}</p>
        </aside>
      </div>
    </main>
  );
}
