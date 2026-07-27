import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { VehicleFinder } from "@/components/vehicle-finder";
import { getLocale } from "@/lib/i18n";
import { products } from "@/lib/mock-data";
import { searchMarketplaceProducts } from "@/lib/repositories/products";

export const metadata: Metadata = { title: "Search auto parts" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getLocale();
  const ar = locale === "ar";
  const params = await searchParams;
  const q = String(params.q ?? "").toLowerCase();
  const category = String(params.category ?? "").toLowerCase();
  const condition = String(params.condition ?? "").toLowerCase();
  const compatibility = String(params.compatibility ?? "").toLowerCase();
  const sellerVerified = String(params.verified ?? "") === "1";
  const sort = String(params.sort ?? "recommended");
  const make = String(params.make ?? "");
  const model = String(params.model ?? "");
  const year = String(params.year ?? "");
  const engineSize = String(params.engineSize ?? "");
  const fuelType = String(params.fuelType ?? "");
  const engineType = String(params.engineType ?? "");
  const trim = String(params.trim ?? "");
  const vin = String(params.vin ?? "");
  const vehicleLabel = [year, make, model].filter(Boolean).join(" ");
  const vehicleParams = { make, model, year, engineSize, fuelType, engineType, trim, vin };
  const results = await searchMarketplaceProducts({ q, category, condition, compatibility, verified: sellerVerified, sort, ...vehicleParams });

  return (
    <main className="page-shell search-page">
      <div className="search-header">
        <div>
          <span className="eyebrow">{ar ? "نتائج البحث" : "PARTS CATALOGUE"}</span>
          <h1>{q ? (ar ? `نتائج “${q}”` : `Results for “${q}”`) : vehicleLabel ? (ar ? `قطع ${vehicleLabel}` : `Parts for ${vehicleLabel}`) : (ar ? "كل قطع السيارات" : "All auto parts")}</h1>
          <p>{ar ? `${results.length} قطع متاحة من بائعين داخل الإمارات` : `${results.length} parts available from UAE sellers`}</p>
        </div>
        <button className="button button-light filter-mobile" type="button">☷ {ar ? "تصفية" : "Filters"}</button>
      </div>
      <VehicleFinder locale={locale} initial={vehicleParams} preserve={{ q, category, condition, compatibility, verified: sellerVerified ? "1" : "" }} compact />
      <div className="search-layout">
        <form className="filters" method="get">
          {q && <input type="hidden" name="q" value={q} />}
          {Object.entries(vehicleParams).map(([name, value]) => value && <input key={name} type="hidden" name={name} value={value} />)}
          <strong>{ar ? "تصفية النتائج" : "Filter results"}</strong>
          <label>{ar ? "الفئة" : "Category"}<select name="category" defaultValue={category}><option value="">{ar ? "كل الفئات" : "All categories"}</option><option value="lights">{ar ? "إضاءة" : "Lighting"}</option><option value="engines">{ar ? "محركات" : "Engines"}</option><option value="body">{ar ? "هيكل" : "Body & Exterior"}</option><option value="transmission">{ar ? "ناقل الحركة" : "Transmission"}</option><option value="suspension">{ar ? "نظام التعليق" : "Suspension"}</option><option value="wheels">{ar ? "جنوط" : "Wheels & Tyres"}</option><option value="electrical">{ar ? "الكهرباء والإلكترونيات" : "Electrical & Electronics"}</option><option value="brakes">{ar ? "الفرامل" : "Brakes"}</option></select></label>
          <fieldset><legend>{ar ? "الحالة" : "Condition"}</legend>{["New", "Used", "Refurbished"].map((item) => <label className="radio-row" key={item}><input type="radio" name="condition" value={item.toLowerCase()} defaultChecked={condition === item.toLowerCase()} />{item}<span>{products.filter((p) => p.condition === item.toLowerCase()).length}</span></label>)}</fieldset>
          <fieldset><legend>{ar ? "التوافق" : "Compatibility"}</legend><label className="radio-row"><input type="radio" name="compatibility" value="confirmed" defaultChecked={compatibility === "confirmed"} />{ar ? "توافق مؤكد فقط" : "Confirmed fit only"}<span>4</span></label><label className="radio-row"><input type="radio" name="compatibility" value="possible" defaultChecked={compatibility === "possible"} />{ar ? "توافق محتمل" : "Possible fit"}<span>1</span></label></fieldset>
          <fieldset><legend>{ar ? "البائع" : "Seller"} </legend><label className="check-row"><input type="checkbox" name="verified" value="1" defaultChecked={sellerVerified} />{ar ? "بائع موثق" : "Verified seller"}<span>5</span></label></fieldset>
          <div className="filter-actions"><button type="submit" className="button button-primary">{ar ? "تطبيق الفلاتر" : "Apply filters"}</button><Link href="/search" className="text-button">{ar ? "مسح" : "Clear"}</Link></div>
        </form>
        <section>
          <div className="results-toolbar">
            <span>{results.length} {ar ? "نتائج" : "results"}</span>
            <form method="get" className="sort-form">
              {q && <input type="hidden" name="q" value={q} />}
              {category && <input type="hidden" name="category" value={category} />}
              {condition && <input type="hidden" name="condition" value={condition} />}
              {Object.entries(vehicleParams).map(([name, value]) => value && <input key={name} type="hidden" name={name} value={value} />)}
              <label>{ar ? "ترتيب" : "Sort"}<select name="sort" defaultValue={sort}><option value="recommended">{ar ? "الموصى به" : "Recommended"}</option><option value="price-low">{ar ? "السعر: الأقل" : "Price: low to high"}</option><option value="price-high">{ar ? "السعر: الأعلى" : "Price: high to low"}</option><option value="rating">{ar ? "الأعلى تقييماً" : "Seller rating"}</option></select></label>
              <button type="submit">{ar ? "رتب" : "Go"}</button>
            </form>
          </div>
          {results.length ? <div className="product-grid search-products">{results.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}</div> : (
            <div className="empty-state compact"><span className="empty-icon">⌕</span><h2>{ar ? "لا توجد نتائج مطابقة" : "No exact matches"}</h2><p>{ar ? "جرّب رقم OEM أو احذف بعض الفلاتر." : "Try an OEM number or remove a filter."}</p></div>
          )}
        </section>
      </div>
    </main>
  );
}
