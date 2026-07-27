import { cookies } from "next/headers";
import type { Locale } from "@partsloop/contracts";

export const dictionary = {
  en: {
    browse: "Browse parts",
    sell: "Sell",
    orders: "Orders",
    account: "Account",
    searchPlaceholder: "Search part, OEM, VIN or vehicle",
    garage: "My Garage",
    confirmedFit: "Confirmed fit",
    protectedPayment: "Protected payment",
    homeTitle: "The right part. Verified for your car.",
    homeSubtitle: "Search trusted new, used and refurbished parts across the UAE, with fitment checks and protected payments.",
  },
  ar: {
    browse: "تصفح القطع",
    sell: "بيع",
    orders: "الطلبات",
    account: "الحساب",
    searchPlaceholder: "ابحث بالقطعة أو رقم OEM أو VIN أو السيارة",
    garage: "كراجي",
    confirmedFit: "توافق مؤكد",
    protectedPayment: "دفع محمي",
    homeTitle: "القطعة الصحيحة، مؤكدة لسيارتك.",
    homeSubtitle: "ابحث عن قطع جديدة ومستعملة ومجددة من بائعين موثوقين في الإمارات مع التحقق من التوافق وحماية الدفع.",
  },
} as const;

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get("partsloop-locale")?.value === "ar" ? "ar" : "en";
}
