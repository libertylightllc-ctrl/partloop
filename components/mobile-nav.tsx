import Link from "next/link";
import type { Locale } from "@partsloop/contracts";

export function MobileNav({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <Link href="/"><span aria-hidden="true">⌂</span>{ar ? "الرئيسية" : "Home"}</Link>
      <Link href="/search"><span aria-hidden="true">⌕</span>{ar ? "بحث" : "Search"}</Link>
      <Link href="/seller/listings/new" className="mobile-sell"><span aria-hidden="true">＋</span>{ar ? "بيع" : "Sell"}</Link>
      <Link href="/orders/ord_1"><span aria-hidden="true">□</span>{ar ? "طلبات" : "Orders"}</Link>
      <Link href="/auth/sign-in"><span aria-hidden="true">○</span>{ar ? "حساب" : "Account"}</Link>
    </nav>
  );
}
