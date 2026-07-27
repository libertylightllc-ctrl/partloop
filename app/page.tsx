/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { garage } from "@/lib/mock-data";
import { dictionary, getLocale } from "@/lib/i18n";
import { ProductCard } from "@/components/product-card";
import { GarageSelector } from "@/components/garage-selector";
import { VehicleFinder } from "@/components/vehicle-finder";
import { searchMarketplaceProducts } from "@/lib/repositories/products";

const categories = [
  { label: "Engines", ar: "محركات", icon: "EN", query: "engines", tone: "blue", count: "4,820 parts" },
  { label: "Lighting", ar: "إضاءة", icon: "LT", query: "lights", tone: "amber", count: "3,140 parts" },
  { label: "Body & Exterior", ar: "الهيكل الخارجي", icon: "BD", query: "body", tone: "mint", count: "5,760 parts" },
  { label: "Transmission", ar: "ناقل الحركة", icon: "TR", query: "transmission", tone: "purple", count: "2,380 parts" },
  { label: "Suspension", ar: "نظام التعليق", icon: "SU", query: "suspension", tone: "slate", count: "2,940 parts" },
  { label: "Wheels & Tyres", ar: "العجلات والإطارات", icon: "WH", query: "wheels", tone: "red", count: "1,860 parts" },
  { label: "Electrical & Electronics", ar: "الكهرباء والإلكترونيات", icon: "EL", query: "electrical", tone: "teal", count: "2,720 parts" },
  { label: "Brakes", ar: "الفرامل", icon: "BR", query: "brakes", tone: "orange", count: "1,980 parts" },
];

export default async function Home() {
  const locale = await getLocale();
  const t = dictionary[locale];
  const ar = locale === "ar";
  const featuredProducts = (await searchMarketplaceProducts()).slice(0, 4);
  return (
    <main>
      <section className="hero page-shell">
        <div className="hero-copy">
          <span className="eyebrow">{ar ? "سوق الدقة لقطع السيارات في الإمارات" : "PRECISION COMMERCE FOR THE UAE"}</span>
          <h1>{t.homeTitle}</h1>
          <p>{t.homeSubtitle}</p>
          <form action="/search" className="hero-search">
            <span aria-hidden="true">⌕</span>
            <input name="q" placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} />
            <button type="submit">{ar ? "ابحث" : "Find my part"}</button>
          </form>
          <div className="hero-actions">
            <Link href="/search" className="button button-primary">{ar ? "تصفح جميع القطع" : "Browse all parts"}</Link>
            <Link href="/seller/listings/new" className="text-link">{ar ? "بيع قطعة في أقل من دقيقة ←" : "Sell a part in under a minute →"}</Link>
          </div>
          <div className="hero-confidence" aria-label="PartsLoop marketplace assurances">
            <span><b>01</b>{ar ? "توافق على مستوى المركبة" : "Vehicle-level fitment"}</span>
            <span><b>02</b>{ar ? "إثبات OEM والحالة" : "OEM & condition proof"}</span>
            <span><b>03</b>{ar ? "معاملة محمية" : "Protected transaction"}</span>
          </div>
        </div>
        <div className="hero-visual premium-hero" aria-label="AI-assisted auto part matching">
          <img src="/partsloop-precision-3d.png" alt="Precision-matched automotive components in a PartsLoop 3D composition" fetchPriority="high" />
          <div className="hero-image-shade" />
          <div className="scan-card scan-main">
            <span className="scan-grid" />
            <strong>FITMENT SIGNAL</strong>
            <small>{ar ? "تم تحديد OEM 81150-60R30" : "OEM 81150-60R30 identified"}</small>
          </div>
          <div className="scan-card scan-fit"><span>✓</span><div><strong>{t.confirmedFit}</strong><small>Toyota Land Cruiser 2021</small></div></div>
          <div className="scan-card scan-price"><small>{ar ? "السعر المقترح" : "Suggested price"}</small><strong>AED 850–920</strong></div>
          <div className="market-pulse"><i /><span>{ar ? "متجر مباشر" : "LIVE MARKETPLACE"}</span><strong>24,800+ {ar ? "قطعة" : "parts"}</strong></div>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
        </div>
      </section>

      <section className="vehicle-finder-section">
        <div className="page-shell">
          <VehicleFinder locale={locale} />
        </div>
      </section>

      <GarageSelector vehicles={garage} locale={locale} />

      <section className="page-shell precision-journey" aria-labelledby="precision-title">
        <div className="precision-intro">
          <span className="eyebrow">{ar ? "حلقة الدقة" : "THE PRECISION LOOP"}</span>
          <h2 id="precision-title">{ar ? "من سيارتك إلى القطعة الصحيحة، بدون تخمين." : "From vehicle to verified part, without the guesswork."}</h2>
          <p>{ar ? "سياق المركبة ورقم OEM وحالة القطعة ومسؤولية البائع والدفع المحمي في تدفق واحد." : "Vehicle context, OEM evidence, seller accountability and protected checkout—connected in one clear flow."}</p>
        </div>
        <div className="precision-steps">
          <article><span>01</span><i>VIN</i><h3>{ar ? "حدد المركبة" : "Identify the vehicle"}</h3><p>{ar ? "اختر السنة والماركة والطراز والفئة والمحرك، أو استخدم دليل OEM وVIN." : "Select year, make, model, variant and engine—or use OEM and VIN evidence."}</p></article>
          <article><span>02</span><i>OEM</i><h3>{ar ? "تحقق من الدليل" : "Verify the evidence"}</h3><p>{ar ? "راجع الحالة والصور ورقم القطعة والبائع المسؤول." : "Review condition, multi-angle photos, part number and the accountable seller."}</p></article>
          <article><span>03</span><i>48H</i><h3>{ar ? "اشترِ بحماية" : "Transact with protection"}</h3><p>{ar ? "الدفع المحمي وفترة الفحص ومسار النزاع موضحة منذ البداية." : "Protected payment, a visible inspection window and a defined dispute path."}</p></article>
        </div>
      </section>

      <section className="proof-bar">
        <div className="page-shell proof-grid">
          <div><strong>24,800+</strong><span>{ar ? "قطعة نشطة" : "active parts"}</span></div>
          <div><strong>96%</strong><span>{ar ? "طلبات بتوافق مؤكد" : "confirmed-fit orders"}</span></div>
          <div><strong>4.8/5</strong><span>{ar ? "تقييم البائعين" : "seller rating"}</span></div>
          <div><strong>48h</strong><span>{ar ? "فترة فحص" : "inspection window"}</span></div>
          <div><strong>7</strong><span>{ar ? "إمارات مخدومة" : "emirates covered"}</span></div>
        </div>
      </section>

      <section className="page-shell section">
        <div className="section-heading">
          <div><span className="eyebrow">{ar ? "ابدأ هنا" : "START HERE"}</span><h2>{ar ? "تسوق حسب الفئة" : "Shop by category"}</h2></div>
          <Link href="/search">{ar ? "عرض الكل ←" : "View all →"}</Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link href={`/search?category=${category.query}`} key={category.label} className={`category-card tone-${category.tone}`}>
              <span>{category.icon}</span>
              <strong>{ar ? category.ar : category.label}</strong>
              <small>{ar ? "استكشف القطع" : category.count} <b>→</b></small>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell section products-section">
        <div className="section-heading">
          <div><span className="eyebrow">{ar ? "مختارة لسيارتك" : "CURATED FOR YOUR GARAGE"}</span><h2>{ar ? "مقترحة للاند كروزر" : "Recommended for your Land Cruiser"}</h2></div>
          <Link href="/search?vehicle=land-cruiser">{ar ? "عرض كل القطع المتوافقة ←" : "See all compatible parts →"}</Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}
        </div>
      </section>

      <section className="page-shell section deal-section">
        <div className="deal-banner">
          <div className="deal-copy">
            <span className="eyebrow">{ar ? "صفقة الأسبوع" : "WORKSHOP DEAL OF THE WEEK"}</span>
            <h2>{ar ? "شحن مجاني للقطع الصغيرة مع حماية كاملة للدفع." : "Free delivery on small parts, with full payment protection."}</h2>
            <p>{ar ? "للمرايا والإضاءة والإلكترونيات حتى مساء الخميس." : "Mirrors, lighting, and electronics through Thursday evening."}</p>
            <Link href="/search?deal=free-delivery" className="button button-accent">{ar ? "تسوق العرض" : "Shop the offer"}</Link>
          </div>
          <div className="deal-countdown" aria-label="Deal ends in 2 days">
            <div><strong>02</strong><span>{ar ? "يوم" : "days"}</span></div><b>:</b>
            <div><strong>11</strong><span>{ar ? "ساعة" : "hours"}</span></div><b>:</b>
            <div><strong>46</strong><span>{ar ? "دقيقة" : "mins"}</span></div>
          </div>
        </div>
      </section>

      <section className="page-shell section seller-directory">
        <div className="section-heading">
          <div><span className="eyebrow">{ar ? "شبكة موثوقة" : "VERIFIED SELLER NETWORK"}</span><h2>{ar ? "أفضل البائعين بالقرب منك" : "Top sellers near you"}</h2></div>
          <Link href="/search?seller=verified">{ar ? "عرض دليل البائعين" : "View seller directory"} →</Link>
        </div>
        <div className="seller-directory-grid">
          {[
            ["AQ", "Al Quoz Auto Parts", "Dubai", "4.9", "1,264", "8 min"],
            ["SM", "Sharjah Motor Hub", "Sharjah", "4.8", "842", "14 min"],
            ["GG", "Gulf Gearbox Centre", "Abu Dhabi", "4.7", "411", "21 min"],
          ].map(([mark, name, city, rating, ordersCount, response]) => (
            <article className="directory-card" key={name}>
              <span className="seller-avatar">{mark}</span>
              <div className="directory-name"><h3>{name}</h3><span>✓ {ar ? "بائع موثق" : "Verified seller"} • {city}</span></div>
              <div className="directory-stats"><span><strong>★ {rating}</strong>{ar ? "التقييم" : "rating"}</span><span><strong>{ordersCount}</strong>{ar ? "طلب" : "orders"}</span><span><strong>{response}</strong>{ar ? "الرد" : "response"}</span></div>
              <Link href={`/search?seller=${encodeURIComponent(name)}`} className="button button-light">{ar ? "زيارة المتجر" : "Visit storefront"}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell trust-architecture">
        <div>
          <span className="eyebrow">{ar ? "الثقة مصممة في المنتج" : "TRUST, DESIGNED IN"}</span>
          <h2>{ar ? "قواعد واضحة قبل أن تدفع." : "Clear rules before money changes hands."}</h2>
          <p>{ar ? "التوافق والحالة والإرجاع ومسؤوليات البائع والخصوصية موضحة بلغة بسيطة." : "Fitment, condition, returns, seller duties and privacy are presented in plain language and backed by defined evidence."}</p>
        </div>
        <nav aria-label="Marketplace protections">
          <Link href="/buyer-protection"><b>01</b><span>{ar ? "حماية المشتري" : "Buyer Protection"}<small>{ar ? "التغطية والنزاعات" : "Coverage & disputes"}</small></span><i>↗</i></Link>
          <Link href="/returns"><b>02</b><span>{ar ? "الإرجاع والاسترداد" : "Returns & Refunds"}<small>{ar ? "العيوب وعدم المطابقة" : "Defects & misdescription"}</small></span><i>↗</i></Link>
          <Link href="/seller-terms"><b>03</b><span>{ar ? "معايير البائع" : "Seller Standards"}<small>{ar ? "الأصالة والإفصاح" : "Authenticity & disclosure"}</small></span><i>↗</i></Link>
          <Link href="/privacy"><b>04</b><span>{ar ? "الخصوصية" : "Privacy"}<small>{ar ? "البيانات وخياراتك" : "Data & your choices"}</small></span><i>↗</i></Link>
        </nav>
      </section>

      <section className="seller-cta">
        <div className="page-shell seller-cta-inner">
          <div>
            <span className="eyebrow">{ar ? "للبائعين والورش" : "FOR SELLERS, GARAGES & DISMANTLERS"}</span>
            <h2>{ar ? "صوّر القطعة. دع الذكاء الاصطناعي يكمل الإعلان." : "Photograph the part. Let AI finish the listing."}</h2>
            <p>{ar ? "تعرف تلقائي، قراءة OEM، تسعير مقترح ووصف عربي وإنجليزي." : "Automatic identification, OEM reading, price guidance, and Arabic + English descriptions."}</p>
          </div>
          <Link href="/seller/listings/new" className="button button-accent">{ar ? "أنشئ إعلاناً" : "Create an AI listing"}</Link>
        </div>
      </section>
    </main>
  );
}
