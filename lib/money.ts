import type { Locale, Money } from "@partsloop/contracts";

export function formatMoney(money: Money, locale: Locale = "en") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    style: "currency",
    currency: money.currency,
    maximumFractionDigits: 0,
  }).format(money.amount);
}
