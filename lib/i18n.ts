import { cookies } from "next/headers";
import type { Locale } from "@partsloop/contracts";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get("partsloop-locale")?.value === "ar" ? "ar" : "en";
}
