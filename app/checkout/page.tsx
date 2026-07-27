import type { Metadata } from "next";
import { CheckoutClient } from "./checkout-client";
import { getLocale } from "@/lib/i18n";
import { findMarketplaceProduct, searchMarketplaceProducts } from "@/lib/repositories/products";

export const metadata: Metadata = { title: "Secure checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const locale = await getLocale();
  const productId = (await searchParams).product;
  const product = productId ? await findMarketplaceProduct(productId) : (await searchMarketplaceProducts())[0];
  if (!product) return null;
  return <CheckoutClient locale={locale} product={product} />;
}
