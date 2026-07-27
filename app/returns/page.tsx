import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { LegalPage } from "@/components/legal-page";
import { returnsSections } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Returns & refunds" };

export default async function ReturnsPage() {
  const locale = await getLocale();
  return <LegalPage locale={locale} label="AFTER-SALES STANDARD" labelAr="معيار ما بعد البيع" title="Returns & refunds" titleAr="الإرجاع والاسترداد" summary="A clear route for wrong, damaged, defective, incomplete or materially misdescribed parts—without reducing UAE consumer rights." summaryAr="مسار واضح للقطع الخاطئة أو التالفة أو المعيبة أو الناقصة أو المخالفة للوصف، دون تقليل حقوق المستهلك في دولة الإمارات." sections={returnsSections} />;
}
