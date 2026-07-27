import Link from "next/link";
import type { Locale } from "@partsloop/contracts";

export type LegalSection = {
  title: string;
  titleAr: string;
  body: string[];
  bodyAr: string[];
};

export function LegalPage({
  locale,
  label,
  labelAr,
  title,
  titleAr,
  summary,
  summaryAr,
  sections,
}: {
  locale: Locale;
  label: string;
  labelAr: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  sections: LegalSection[];
}) {
  const ar = locale === "ar";
  return (
    <main className="legal-page page-shell">
      <header className="legal-hero">
        <span className="eyebrow">{ar ? labelAr : label}</span>
        <h1>{ar ? titleAr : title}</h1>
        <p>{ar ? summaryAr : summary}</p>
        <div className="legal-meta">
          <span>{ar ? "آخر تحديث: 27 يوليو 2026" : "Last updated: 27 July 2026"}</span>
          <span>{ar ? "الإصدار 1.0" : "Version 1.0"}</span>
        </div>
      </header>
      <div className="legal-layout">
        <aside className="legal-index">
          <strong>{ar ? "سياسات السوق" : "Marketplace policies"}</strong>
          <Link href="/terms">{ar ? "الشروط والأحكام" : "Terms of use"}</Link>
          <Link href="/buyer-protection">{ar ? "حماية المشتري" : "Buyer protection"}</Link>
          <Link href="/returns">{ar ? "الإرجاع والاسترداد" : "Returns & refunds"}</Link>
          <Link href="/seller-terms">{ar ? "معايير البائع" : "Seller standards"}</Link>
          <Link href="/privacy">{ar ? "الخصوصية" : "Privacy policy"}</Link>
        </aside>
        <article className="legal-document">
          {sections.map((section, index) => (
            <section key={section.title} id={`section-${index + 1}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{ar ? section.titleAr : section.title}</h2>
                {(ar ? section.bodyAr : section.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
          <div className="legal-priority">
            <strong>{ar ? "حقوقك القانونية محفوظة" : "Your statutory rights remain protected"}</strong>
            <p>{ar ? "لا تستبعد هذه السياسات أو تقيد أي حقوق أو تعويضات لا يجوز استبعادها بموجب قوانين دولة الإمارات العربية المتحدة. عند التعارض، تسود القوانين الإلزامية." : "Nothing in these policies excludes or limits rights or remedies that cannot lawfully be excluded under UAE law. Mandatory law prevails if there is a conflict."}</p>
          </div>
        </article>
      </div>
    </main>
  );
}
