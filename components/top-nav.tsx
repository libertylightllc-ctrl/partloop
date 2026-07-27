"use client";

import Link from "next/link";
import type { Locale } from "@partsloop/contracts";
import { dictionary } from "@/lib/i18n";
import { LocaleSwitch } from "./locale-switch";
import { useCart } from "./cart-provider";

export function TopNav({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const { count } = useCart();
  return (
    <>
      <div className="trust-strip">
        <span>{locale === "ar" ? "توصيل مجاني للطلبات فوق 250 د.إ" : "Free UAE delivery over AED 250"}</span>
        <span>{locale === "ar" ? "دفع محمي • بائعون موثقون" : "Protected payments • Verified sellers"}</span>
      </div>
      <header className="top-nav">
        <Link href="/" className="brand" aria-label="PartsLoop home">
          <span className="brand-mark">P</span>
          <span>Parts<span>Loop</span></span>
        </Link>
        <form action="/search" className="nav-search">
          <span aria-hidden="true">⌕</span>
          <input name="q" placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} />
          <button type="submit">{locale === "ar" ? "بحث" : "Search"}</button>
        </form>
        <nav className="nav-actions" aria-label="Primary navigation">
          <LocaleSwitch locale={locale} />
          <Link href="/seller">{t.sell}</Link>
          <Link href="/orders/ord_1">{t.orders}</Link>
          <Link href="/cart" className="cart-link" aria-label={`${count} items in cart`}>
            <span aria-hidden="true">Bag</span>
            {count > 0 && <strong>{count}</strong>}
          </Link>
        </nav>
      </header>
      <nav className="category-nav" aria-label="Product categories">
        <Link href="/search?category=engines">{locale === "ar" ? "محركات" : "Engines"}</Link>
        <Link href="/search?category=lights">{locale === "ar" ? "إضاءة" : "Lights"}</Link>
        <Link href="/search?category=body">{locale === "ar" ? "هيكل" : "Body parts"}</Link>
        <Link href="/search?category=transmission">{locale === "ar" ? "ناقل الحركة" : "Transmission"}</Link>
        <Link href="/search?condition=used">{locale === "ar" ? "قطع مستعملة" : "Used parts"}</Link>
        <Link href="/search?condition=new">{locale === "ar" ? "قطع جديدة" : "New parts"}</Link>
        <Link href="/seller/listings/new" className="category-sell">{locale === "ar" ? "بع قطعة بالذكاء الاصطناعي" : "AI Sell a part"}</Link>
      </nav>
    </>
  );
}
