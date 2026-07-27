import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { LegalPage } from "@/components/legal-page";
import { sellerSections } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Seller standards" };

export default async function SellerTermsPage() {
  const locale = await getLocale();
  return <LegalPage locale={locale} label="SELLER CODE" labelAr="ميثاق البائع" title="Seller standards" titleAr="معايير البائع" summary="The identity, provenance, disclosure, safety and after-sales standards required to sell on PartsLoop." summaryAr="معايير الهوية والمصدر والإفصاح والسلامة وخدمة ما بعد البيع المطلوبة للبيع على PartsLoop." sections={sellerSections} />;
}
