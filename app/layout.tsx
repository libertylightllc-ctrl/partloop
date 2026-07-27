import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./premium.css";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { TopNav } from "@/components/top-nav";
import { getLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  return {
    metadataBase,
    title: {
      default: "PartsLoop — The right auto part, verified",
      template: "%s | PartsLoop",
    },
    description: "A trusted Middle East marketplace for new, used, and refurbished auto parts with fitment checks and protected payments.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "PartsLoop",
      description: "The right part. Verified for your car.",
      type: "website",
      images: [{ url: "/partsloop-social-v9.png", width: 1733, height: 907, alt: "PartsLoop — Every part. Proven to fit." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "PartsLoop",
      description: "The right part. Verified for your car.",
      images: ["/partsloop-social-v9.png"],
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <CartProvider>
          <TopNav locale={locale} />
          {children}
          <Footer locale={locale} />
          <MobileNav locale={locale} />
        </CartProvider>
      </body>
    </html>
  );
}
