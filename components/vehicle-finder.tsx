"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@partsloop/contracts";
import { vehicleCatalog, vehicleMakes } from "@/lib/vehicle-catalog";

export interface VehicleSearchValues {
  make?: string;
  model?: string;
  year?: string;
  engineSize?: string;
  fuelType?: string;
  engineType?: string;
  trim?: string;
  vin?: string;
}

export function VehicleFinder({
  locale,
  initial = {},
  preserve = {},
  compact = false,
}: {
  locale: Locale;
  initial?: VehicleSearchValues;
  preserve?: Record<string, string>;
  compact?: boolean;
}) {
  const ar = locale === "ar";
  const [make, setMake] = useState(initial.make ?? "");
  const [model, setModel] = useState(initial.model ?? "");
  const [engineSize, setEngineSize] = useState(initial.engineSize ?? "");
  const [fuelType, setFuelType] = useState(initial.fuelType ?? "");
  const [engineType, setEngineType] = useState(initial.engineType ?? "");

  const models = make ? Object.keys(vehicleCatalog[make] ?? {}) : [];
  const selectedModel = make && model ? vehicleCatalog[make]?.[model] : undefined;
  const engines = selectedModel?.engines ?? [];
  const years = useMemo(() => {
    if (!selectedModel) return Array.from({ length: 27 }, (_, index) => String(2026 - index));
    const [from, to] = selectedModel.years;
    return Array.from({ length: to - from + 1 }, (_, index) => String(to - index));
  }, [selectedModel]);
  const sizes = [...new Set(engines.map((engine) => engine.size))];
  const fuels = [...new Set(engines.filter((engine) => !engineSize || engine.size === engineSize).map((engine) => engine.fuel))];
  const layouts = [...new Set(engines.filter((engine) => (!engineSize || engine.size === engineSize) && (!fuelType || engine.fuel === fuelType)).map((engine) => engine.layout))];
  const trims = [...new Set(engines.filter((engine) => (!engineSize || engine.size === engineSize) && (!fuelType || engine.fuel === fuelType) && (!engineType || engine.layout === engineType)).flatMap((engine) => engine.trims))];

  function changeMake(next: string) {
    setMake(next);
    setModel("");
    setEngineSize("");
    setFuelType("");
    setEngineType("");
  }

  function changeModel(next: string) {
    setModel(next);
    setEngineSize("");
    setFuelType("");
    setEngineType("");
  }

  return (
    <form action="/search" method="get" className={`vehicle-finder ${compact ? "vehicle-finder-compact" : ""}`}>
      {Object.entries(preserve).map(([name, value]) => value && <input key={name} type="hidden" name={name} value={value} />)}
      <div className="vehicle-finder-heading">
        <div>
          <span className="vehicle-step">01</span>
          <div>
            <span className="eyebrow">{ar ? "بحث حسب السيارة" : "SEARCH BY VEHICLE"}</span>
            <h2>{ar ? "اختر سيارتك لنُظهر القطع المناسبة" : "Tell us what you drive"}</h2>
            <p>{ar ? "سنستخدم الموديل والسنة والمحرك لتصفية القطع المتوافقة." : "We’ll use the model, year and engine to show the most relevant compatible parts."}</p>
          </div>
        </div>
        <span className="fitment-promise">{ar ? "✓ تحقق ذكي من التوافق" : "✓ Smart fitment check"}</span>
      </div>

      <div className="vehicle-finder-grid">
        <label className="vehicle-field">
          <span>{ar ? "الشركة" : "Make"}</span>
          <select name="make" value={make} onChange={(event) => changeMake(event.target.value)}>
            <option value="">{ar ? "أي شركة" : "Any make"}</option>
            {vehicleMakes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="vehicle-field">
          <span>{ar ? "الموديل" : "Model"}</span>
          <select name="model" value={model} onChange={(event) => changeModel(event.target.value)} disabled={!make}>
            <option value="">{ar ? "أي موديل" : "Any model"}</option>
            {models.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="vehicle-field">
          <span>{ar ? "السنة" : "Year"}</span>
          <select name="year" defaultValue={initial.year ?? ""}>
            <option value="">{ar ? "أي سنة" : "Any year"}</option>
            {years.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="vehicle-field">
          <span>{ar ? "سعة المحرك" : "Engine size"}</span>
          <select name="engineSize" value={engineSize} onChange={(event) => { setEngineSize(event.target.value); setFuelType(""); setEngineType(""); }} disabled={!model}>
            <option value="">{ar ? "أي سعة" : "Any size"}</option>
            {sizes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="vehicle-field">
          <span>{ar ? "نوع الوقود" : "Fuel type"}</span>
          <select name="fuelType" value={fuelType} onChange={(event) => { setFuelType(event.target.value); setEngineType(""); }} disabled={!model}>
            <option value="">{ar ? "أي نوع" : "Any fuel"}</option>
            {fuels.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="vehicle-field">
          <span>{ar ? "تكوين المحرك" : "Engine type"}</span>
          <select name="engineType" value={engineType} onChange={(event) => setEngineType(event.target.value)} disabled={!model}>
            <option value="">{ar ? "أي محرك" : "Any engine"}</option>
            {layouts.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <details className="vehicle-advanced">
        <summary>{ar ? "خيارات إضافية: الفئة أو رقم الهيكل" : "More options: trim or VIN"}</summary>
        <div>
          <label className="vehicle-field">
            <span>{ar ? "الفئة" : "Trim"}</span>
            <select name="trim" defaultValue={initial.trim ?? ""} disabled={!model}>
              <option value="">{ar ? "أي فئة" : "Any trim"}</option>
              {trims.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="vehicle-field">
            <span>{ar ? "رقم الهيكل VIN" : "VIN / chassis number"}</span>
            <input name="vin" defaultValue={initial.vin ?? ""} maxLength={17} placeholder={ar ? "17 حرفاً ورقماً" : "17 characters (optional)"} />
          </label>
        </div>
      </details>

      <div className="vehicle-finder-actions">
        <div>
          <strong>{ar ? "لست متأكداً من المحرك؟" : "Not sure about the engine?"}</strong>
          <span>{ar ? "اختر الشركة والموديل والسنة فقط أو استخدم رقم الهيكل." : "Choose only make, model and year—or add the VIN for confirmation."}</span>
        </div>
        <button className="button button-primary" type="submit">{ar ? "عرض القطع المتوافقة" : "Find compatible parts"} <span aria-hidden="true">→</span></button>
      </div>
    </form>
  );
}
