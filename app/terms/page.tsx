import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { LegalPage } from "@/components/legal-page";
import { termsSections } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Terms of use" };

export default async function TermsPage() {
  const locale = await getLocale();
  return <LegalPage locale={locale} label="MARKETPLACE AGREEMENT" labelAr="اتفاقية السوق" title="Terms of use" titleAr="الشروط والأحكام" summary="The rules that govern accounts, listings, fitment support, orders, protected payments and disputes on PartsLoop." summaryAr="القواعد التي تحكم الحسابات والإعلانات ودعم التوافق والطلبات والدفع المحمي والنزاعات على PartsLoop." sections={termsSections} />;
}
