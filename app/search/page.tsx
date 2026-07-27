import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { VehicleFinder } from "@/components/vehicle-finder";
import { getLocale } from "@/lib/i18n";
import { products } from "@/lib/mock-data";
import { searchMarketplaceProducts } from "@/lib/repositories/products";
import { SearchFilters } from "@/components/search-filters";

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
      </div>
      <VehicleFinder locale={locale} initial={vehicleParams} preserve={{ q, category, condition, compatibility, verified: sellerVerified ? "1" : "" }} compact />
      <div className="search-layout">
        <SearchFilters
          locale={locale}
          q={q}
          category={category}
          condition={condition}
          compatibility={compatibility}
          sellerVerified={sellerVerified}
          vehicleParams={vehicleParams}
          counts={{
            new: products.filter((product) => product.condition === "new").length,
            used: products.filter((product) => product.condition === "used").length,
            refurbished: products.filter((product) => product.condition === "refurbished").length,
            confirmed: products.filter((product) => product.compatibility === "confirmed").length,
            possible: products.filter((product) => product.compatibility === "possible").length,
            verified: products.filter((product) => product.seller.verified).length,
          }}
        />
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
