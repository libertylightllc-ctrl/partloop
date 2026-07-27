"use client";

import { useTransition } from "react";
import type { Locale } from "@partsloop/contracts";

export function LocaleSwitch({ locale }: { locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const next = locale === "en" ? "ar" : "en";
  return (
    <button
      className="locale-switch"
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => {
        document.cookie = `partsloop-locale=${next};path=/;max-age=31536000;samesite=lax`;
        window.location.reload();
      })}
      aria-label={locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
    >
      {locale === "en" ? "العربية" : "English"}
    </button>
  );
}
