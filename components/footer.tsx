import Link from "next/link";
import type { Locale } from "@partsloop/contracts";

export function Footer({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <footer className="site-footer">
      <div>
        <span className="brand footer-brand"><span className="brand-mark">P</span>PartsLoop</span>
        <p>{ar ? "سوق موثوق لقطع السيارات في الشرق الأوسط." : "A trusted auto-parts marketplace built for the Middle East."}</p>
      </div>
      <div>
        <strong>{ar ? "تسوق" : "Shop"}</strong>
        <Link href="/search">{ar ? "جميع القطع" : "All parts"}</Link>
        <Link href="/search?condition=used">{ar ? "مستعمل" : "Used"}</Link>
        <Link href="/search?condition=new">{ar ? "جديد" : "New"}</Link>
      </div>
      <div>
        <strong>{ar ? "للشركات" : "For business"}</strong>
        <Link href="/seller">{ar ? "بوابة البائع" : "Seller portal"}</Link>
        <Link href="/admin">{ar ? "الإدارة" : "Admin demo"}</Link>
      </div>
      <div>
        <strong>{ar ? "الأمان" : "Trust"}</strong>
        <span>{ar ? "حماية الدفع" : "Payment protection"}</span>
        <span>{ar ? "فحص التوافق" : "Fitment checks"}</span>
        <Link href="/image-credits">{ar ? "مصادر الصور" : "Image credits"}</Link>
      </div>
    </footer>
  );
}
