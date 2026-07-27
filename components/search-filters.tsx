"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@partsloop/contracts";

type VehicleParams = Record<string, string>;

export function SearchFilters({
  locale,
  q,
  category,
  condition,
  compatibility,
  sellerVerified,
  vehicleParams,
  counts,
}: {
  locale: Locale;
  q: string;
  category: string;
  condition: string;
  compatibility: string;
  sellerVerified: boolean;
  vehicleParams: VehicleParams;
  counts: Record<string, number>;
}) {
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <>
      <button className="button button-light filter-mobile" type="button" onClick={() => setOpen(true)} aria-expanded={open}>
        <span aria-hidden="true">≡</span>{ar ? "تصفية وترتيب" : "Filter & refine"}
      </button>
      {open && <button className="filter-backdrop" aria-label={ar ? "إغلاق الفلاتر" : "Close filters"} onClick={() => setOpen(false)} />}
      <form id="search-filters" className={`filters ${open ? "is-open" : ""}`} method="get">
        <div className="filters-heading">
          <div><small>{ar ? "الكتالوج" : "CATALOGUE"}</small><strong>{ar ? "تصفية النتائج" : "Refine results"}</strong></div>
          <button className="filters-close" type="button" onClick={() => setOpen(false)} aria-label={ar ? "إغلاق" : "Close"}>×</button>
        </div>
        {q && <input type="hidden" name="q" value={q} />}
        {Object.entries(vehicleParams).map(([name, value]) => value && <input key={name} type="hidden" name={name} value={value} />)}
        <label>{ar ? "الفئة" : "Category"}
          <select name="category" defaultValue={category}>
            <option value="">{ar ? "كل الفئات" : "All categories"}</option>
            <option value="lights">{ar ? "إضاءة" : "Lighting"}</option>
            <option value="engines">{ar ? "محركات" : "Engines"}</option>
            <option value="body">{ar ? "هيكل" : "Body & Exterior"}</option>
            <option value="transmission">{ar ? "ناقل الحركة" : "Transmission"}</option>
            <option value="suspension">{ar ? "نظام التعليق" : "Suspension"}</option>
            <option value="wheels">{ar ? "جنوط" : "Wheels & Tyres"}</option>
            <option value="electrical">{ar ? "الكهرباء والإلكترونيات" : "Electrical & Electronics"}</option>
            <option value="brakes">{ar ? "الفرامل" : "Brakes"}</option>
          </select>
        </label>
        <fieldset>
          <legend>{ar ? "الحالة" : "Condition"}</legend>
          {["New", "Used", "Refurbished"].map((item) => (
            <label className="radio-row" key={item}>
              <input type="radio" name="condition" value={item.toLowerCase()} defaultChecked={condition === item.toLowerCase()} />
              {item}<span>{counts[item.toLowerCase()] ?? 0}</span>
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>{ar ? "التوافق" : "Compatibility"}</legend>
          <label className="radio-row"><input type="radio" name="compatibility" value="confirmed" defaultChecked={compatibility === "confirmed"} />{ar ? "توافق مؤكد فقط" : "Confirmed fit only"}<span>{counts.confirmed ?? 0}</span></label>
          <label className="radio-row"><input type="radio" name="compatibility" value="possible" defaultChecked={compatibility === "possible"} />{ar ? "توافق محتمل" : "Possible fit"}<span>{counts.possible ?? 0}</span></label>
        </fieldset>
        <fieldset>
          <legend>{ar ? "البائع" : "Seller"}</legend>
          <label className="check-row"><input type="checkbox" name="verified" value="1" defaultChecked={sellerVerified} />{ar ? "بائع موثق" : "Verified seller"}<span>{counts.verified ?? 0}</span></label>
        </fieldset>
        <div className="filter-actions">
          <button type="submit" className="button button-primary">{ar ? "عرض النتائج" : "Show results"}</button>
          <Link href="/search" className="text-button">{ar ? "مسح الكل" : "Clear all"}</Link>
        </div>
      </form>
    </>
  );
}
