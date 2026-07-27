import type { CompatibilityStatus, ConditionGrade, Locale } from "@partsloop/contracts";

export function CompatibilityBadge({ status, locale = "en" }: { status: CompatibilityStatus; locale?: Locale }) {
  const labels = {
    confirmed: locale === "ar" ? "توافق مؤكد" : "Confirmed fit",
    possible: locale === "ar" ? "توافق محتمل" : "Possible fit",
    unverified: locale === "ar" ? "غير مؤكد" : "Fit not verified",
  };
  return <span className={`fit-badge fit-${status}`}><span aria-hidden="true">{status === "confirmed" ? "✓" : status === "possible" ? "~" : "!"}</span>{labels[status]}</span>;
}

export function GradeBadge({ grade, locale = "en" }: { grade: ConditionGrade; locale?: Locale }) {
  const labels: Record<ConditionGrade, string> = {
    new: locale === "ar" ? "جديد" : "New",
    a: locale === "ar" ? "درجة A" : "Grade A",
    b: locale === "ar" ? "درجة B" : "Grade B",
    c: locale === "ar" ? "درجة C" : "Grade C",
    repair: locale === "ar" ? "للإصلاح" : "For repair",
    untested: locale === "ar" ? "غير مختبر" : "Untested",
  };
  return <span className={`grade-badge grade-${grade}`}>{labels[grade]}</span>;
}
