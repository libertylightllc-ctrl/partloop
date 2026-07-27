import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { LegalPage } from "@/components/legal-page";
import { protectionSections } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Buyer protection" };

export default async function BuyerProtectionPage() {
  const locale = await getLocale();
  return <LegalPage locale={locale} label="TRANSACTION PROTECTION" labelAr="حماية المعاملة" title="Buyer protection" titleAr="حماية المشتري" summary="Evidence-led protection for eligible PartsLoop payments, delivery and part-condition disputes." summaryAr="حماية قائمة على الأدلة لمدفوعات PartsLoop المؤهلة ونزاعات التسليم وحالة القطعة." sections={protectionSections} />;
}
