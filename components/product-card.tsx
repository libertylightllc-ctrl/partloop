"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale, Product } from "@partsloop/contracts";
import { formatMoney } from "@/lib/money";
import { CompatibilityBadge, GradeBadge } from "./status-badges";
import { ProductVisual } from "./product-visual";

export function ProductCard({ product, locale = "en" }: { product: Product; locale?: Locale }) {
  const title = locale === "ar" ? product.titleAr : product.title;
  const ar = locale === "ar";
  const [saved, setSaved] = useState(false);
  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={`/products/${product.slug}`} className="product-image-link" aria-label={title}>
          <ProductVisual visual={product.visual} compact imageUrl={product.imageUrl} alt={product.imageAlt} />
        </Link>
        <button className={`wish-button ${saved ? "saved" : ""}`} type="button" aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={() => setSaved((current) => !current)}>
          {saved ? "♥" : "♡"}
        </button>
        <span className="card-fit-score"><i />{product.compatibility === "confirmed" ? "98%" : product.compatibility === "possible" ? "74%" : "—"} {ar ? "تطابق" : "match"}</span>
      </div>
      <div className="product-card-body">
        <div className="badge-row">
          <GradeBadge grade={product.grade} locale={locale} />
          {product.seller.verified && <span className="verified-mini">✓ {locale === "ar" ? "موثق" : "Verified"}</span>}
        </div>
        <Link href={`/products/${product.slug}`} className="product-title">{title}</Link>
        <span className="product-oem">OEM {product.oemNumber}</span>
        <div className="product-seller-line">
          <span className="seller-mini-mark">{product.seller.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span>
          <span><strong>{product.seller.name}</strong><small>{product.seller.city} · {product.seller.completedOrders.toLocaleString()} orders</small></span>
        </div>
        <strong className="product-price">{formatMoney(product.price, locale)}</strong>
        <CompatibilityBadge status={product.compatibility} locale={locale} />
        <div className="card-meta">
          <span>★ {product.seller.rating}</span>
          <span>{product.deliveryLabel}</span>
        </div>
        <Link className="card-cta" href={`/products/${product.slug}`}>
          <span>{ar ? "فحص التفاصيل والتوافق" : "Inspect details & fitment"}</span><b aria-hidden="true">→</b>
        </Link>
      </div>
    </article>
  );
}
