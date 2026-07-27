import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { CompatibilityBadge, GradeBadge } from "@/components/status-badges";
import { getLocale } from "@/lib/i18n";
import { findMarketplaceProduct, searchMarketplaceProducts } from "@/lib/repositories/products";
import { formatMoney } from "@/lib/money";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await findMarketplaceProduct((await params).slug);
  return { title: product?.title ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getLocale();
  const ar = locale === "ar";
  const product = await findMarketplaceProduct((await params).slug);
  if (!product) notFound();
  const related = (await searchMarketplaceProducts({ category: product.category })).filter((item) => item.id !== product.id).slice(0, 4);
  return (
    <main className="page-shell product-page">
      <nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href={`/search?category=${product.category.toLowerCase()}`}>{product.category}</Link><span>/</span><span>{product.oemNumber}</span></nav>
      <section className="product-detail-grid">
        <div className="product-gallery">
          <ProductVisual visual={product.visual} imageUrl={product.imageUrl} alt={product.imageAlt} priority />
          <div className="thumbnail-row">{[1, 2, 3, 4].map((item) => <button key={item} className={item === 1 ? "active" : ""} aria-label={`View product image ${item}`}><ProductVisual visual={product.visual} compact imageUrl={product.imageUrl} alt={`${product.imageAlt}, view ${item}`} /></button>)}</div>
          <div className="photo-proof"><span>✓</span><div><strong>{ar ? "صور تم التحقق منها" : "Verified listing photos"}</strong><small>{ar ? "تم فحص التكرار والتلاعب" : "Checked for duplication and manipulation"}</small></div></div>
        </div>
        <div className="product-info">
          <div className="badge-row"><GradeBadge grade={product.grade} locale={locale} /><span className="condition-label">{product.condition}</span></div>
          <h1>{ar ? product.titleAr : product.title}</h1>
          <div className="rating-line"><span>★ {product.seller.rating}</span><span>{product.seller.completedOrders.toLocaleString()} {ar ? "طلب مكتمل" : "orders"}</span><span>OEM {product.oemNumber}</span></div>
          <strong className="detail-price">{formatMoney(product.price, locale)}</strong>
          <span className="vat-note">{ar ? "يشمل ضريبة القيمة المضافة عند انطباقها" : "VAT included where applicable"}</span>
          <div className="fitment-panel">
            <div className="fitment-top"><CompatibilityBadge status={product.compatibility} locale={locale} /><button>{ar ? "تغيير السيارة" : "Change vehicle"}</button></div>
            <strong>Toyota Land Cruiser 2021 • 4.0L V6 • GXR</strong>
            <p>{ar ? "تمت مطابقة رقم OEM والمحرك والطراز. نوصي بتأكيد رقم الهيكل قبل الشحن." : "OEM, engine, and model match. We still recommend confirming the VIN before dispatch."}</p>
          </div>
          <div className="delivery-card">
            <span aria-hidden="true">⇢</span><div><strong>{product.deliveryLabel}</strong><small>{ar ? "شحن متتبع من " : "Tracked delivery from "}{product.seller.city}</small></div><b>{formatMoney({ amount: 35, currency: "AED" }, locale)}</b>
          </div>
          <AddToCart productId={product.id} locale={locale} />
          <div className="protection-note"><span>♢</span><div><strong>{ar ? "حماية PartsLoop" : "PartsLoop Protection"}</strong><p>{ar ? "يبقى الدفع محمياً حتى التسليم وانتهاء فترة الفحص." : "Payment remains protected until delivery and the inspection window ends."}</p></div></div>
        </div>
      </section>
      <section className="details-columns">
        <div>
          <span className="eyebrow">{ar ? "تفاصيل القطعة" : "PART DETAILS"}</span>
          <h2>{ar ? "الحالة والوصف" : "Condition & description"}</h2>
          <p>{ar ? product.descriptionAr : product.description}</p>
          <dl className="spec-grid"><div><dt>{ar ? "رقم OEM" : "OEM number"}</dt><dd>{product.oemNumber}</dd></div><div><dt>{ar ? "الضمان" : "Warranty"}</dt><dd>{product.warrantyDays} {ar ? "يوماً" : "days"}</dd></div><div><dt>{ar ? "الحالة" : "Condition"}</dt><dd>{product.condition}</dd></div><div><dt>{ar ? "الملاحظات" : "Known marks"}</dt><dd>{product.defects.length ? product.defects.join(", ") : (ar ? "لا يوجد" : "None disclosed")}</dd></div></dl>
        </div>
        <aside className="seller-card">
          <span className="verified-seal">✓</span>
          <div><small>{ar ? "يباع بواسطة" : "SOLD BY"}</small><h3>{product.seller.name}</h3><p>{product.seller.city} • ★ {product.seller.rating}</p></div>
          <div className="seller-stats"><div><strong>{product.seller.completedOrders.toLocaleString()}</strong><small>{ar ? "طلب" : "Orders"}</small></div><div><strong>{product.seller.responseMinutes}m</strong><small>{ar ? "الرد" : "Response"}</small></div><div><strong>98%</strong><small>{ar ? "في الموعد" : "On time"}</small></div></div>
          <button className="button button-light">{ar ? "مراسلة البائع" : "Chat with seller"}</button>
        </aside>
      </section>
      <section className="section">
        <div className="section-heading"><h2>{ar ? "قطع مشابهة" : "You may also need"}</h2><Link href="/search">{ar ? "عرض الكل" : "View all"} →</Link></div>
        <div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} locale={locale} />)}</div>
      </section>
    </main>
  );
}
