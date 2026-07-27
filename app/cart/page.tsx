import type { Metadata } from "next";
import { CartPageClient } from "./cart-page-client";
import { getLocale } from "@/lib/i18n";
import { searchMarketplaceProducts } from "@/lib/repositories/products";

export const metadata: Metadata = { title: "Your cart" };

export default async function CartPage() {
  const [locale, catalog] = await Promise.all([getLocale(), searchMarketplaceProducts()]);
  return <CartPageClient locale={locale} catalog={catalog} />;
}
