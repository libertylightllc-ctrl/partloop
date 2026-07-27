import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { LegalPage } from "@/components/legal-page";
import { privacySections } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Privacy policy" };

export default async function PrivacyPage() {
  const locale = await getLocale();
  return <LegalPage locale={locale} label="DATA & TRUST" labelAr="البيانات والثقة" title="Privacy policy" titleAr="سياسة الخصوصية" summary="How PartsLoop handles account, vehicle, transaction and marketplace-safety data, and the choices available to you." summaryAr="كيفية تعامل PartsLoop مع بيانات الحساب والمركبة والمعاملة وسلامة السوق والخيارات المتاحة لك." sections={privacySections} />;
}
