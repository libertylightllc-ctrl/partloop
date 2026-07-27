"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@partsloop/contracts";
import {
  allVehicleYears,
  fallbackEngineSizes,
  fallbackEngineTypes,
  fallbackFuelTypes,
  vehicleCatalog,
  vehicleMakes,
} from "@/lib/vehicle-catalog";

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

const OTHER_MODEL = "__other_model__";

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );
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
  const [modelChoice, setModelChoice] = useState(initial.model ?? "");
  const [customModel, setCustomModel] = useState("");
  const [year, setYear] = useState(initial.year ?? "");
  const [engineSize, setEngineSize] = useState(initial.engineSize ?? "");
  const [fuelType, setFuelType] = useState(initial.fuelType ?? "");
  const [engineType, setEngineType] = useState(initial.engineType ?? "");
  const [remoteModels, setRemoteModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(Boolean(initial.make));
  const [modelsUnavailable, setModelsUnavailable] = useState(false);

  const model = modelChoice === OTHER_MODEL ? customModel : modelChoice;
  const curatedModels = useMemo(() => Object.keys(vehicleCatalog[make] ?? {}), [make]);
  const models = useMemo(
    () => uniqueSorted([...curatedModels, ...remoteModels, make === initial.make ? initial.model ?? "" : ""]),
    [curatedModels, remoteModels, initial.make, initial.model, make],
  );
  const selectedModel = make && model ? vehicleCatalog[make]?.[model] : undefined;
  const engines = selectedModel?.engines ?? [];
  const curatedSizes = uniqueSorted(engines.map((engine) => engine.size));
  const curatedFuels = uniqueSorted(
    engines.filter((engine) => !engineSize || engine.size === engineSize).map((engine) => engine.fuel),
  );
  const curatedLayouts = uniqueSorted(
    engines
      .filter(
        (engine) =>
          (!engineSize || engine.size === engineSize) &&
          (!fuelType || engine.fuel === fuelType),
      )
      .map((engine) => engine.layout),
  );
  const trims = uniqueSorted(
    engines
      .filter(
        (engine) =>
          (!engineSize || engine.size === engineSize) &&
          (!fuelType || engine.fuel === fuelType) &&
          (!engineType || engine.layout === engineType),
      )
      .flatMap((engine) => engine.trims),
  );
  const otherSizes = fallbackEngineSizes.filter((item) => !curatedSizes.includes(item));
  const otherFuels = fallbackFuelTypes.filter((item) => !curatedFuels.includes(item));
  const otherLayouts = fallbackEngineTypes.filter((item) => !curatedLayouts.includes(item));

  useEffect(() => {
    if (!make) return;

    const controller = new AbortController();

    fetch(`/api/vehicles/models?make=${encodeURIComponent(make)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Model catalogue unavailable");
        return (await response.json()) as { models?: string[] };
      })
      .then((data) => setRemoteModels(Array.isArray(data.models) ? data.models : []))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setRemoteModels([]);
        setModelsUnavailable(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setModelsLoading(false);
      });

    return () => controller.abort();
  }, [make]);

  function resetPowertrain() {
    setEngineSize("");
    setFuelType("");
    setEngineType("");
  }

  function changeMake(next: string) {
    setMake(next);
    setModelChoice("");
    setCustomModel("");
    setYear("");
    setRemoteModels([]);
    setModelsLoading(Boolean(next));
    setModelsUnavailable(false);
    resetPowertrain();
  }

  function changeModel(next: string) {
    setModelChoice(next);
    setCustomModel("");
    setYear("");
    resetPowertrain();
  }

  return (
    <form action="/search" method="get" className={`vehicle-finder ${compact ? "vehicle-finder-compact" : ""}`}>
      {Object.entries(preserve).map(([name, value]) =>
        value ? <input key={name} type="hidden" name={name} value={value} /> : null,
      )}
      <input type="hidden" name="model" value={model} />

      <div className="vehicle-finder-heading">
        <div>
          <span className="vehicle-step">01</span>
          <div>
            <span className="eyebrow">{ar ? "البحث حسب السيارة" : "SEARCH BY VEHICLE"}</span>
            <h2>{ar ? "اختر سيارتك لنُظهر القطع المناسبة" : "Find the exact part for your car"}</h2>
            <p>
              {ar
                ? "دليل سيارات الشرق الأوسط من 1960 إلى 2026، مع الموديلات مرتبة من الألف إلى الياء وخيارات المحرك والفئة."
                : "Middle East-first coverage from 1960–2026, with manufacturer models A–Z and guided engine and variant choices."}
            </p>
          </div>
        </div>
        <div className="fitment-badges">
          <span className="fitment-promise">{ar ? "✓ موديلات A–Z" : "✓ Models A–Z"}</span>
          <span className="fitment-promise">{ar ? "1960–2026" : "1960–2026"}</span>
        </div>
      </div>

      <div className="vehicle-flow" aria-label={ar ? "خطوات اختيار السيارة" : "Vehicle selection steps"}>
        <span className={make ? "complete" : "active"}>1 · {ar ? "الشركة" : "Make"}</span>
        <i aria-hidden="true">›</i>
        <span className={model ? "complete" : make ? "active" : ""}>2 · {ar ? "الموديل" : "Model"}</span>
        <i aria-hidden="true">›</i>
        <span className={year ? "complete" : model ? "active" : ""}>3 · {ar ? "السنة" : "Year"}</span>
        <i aria-hidden="true">›</i>
        <span className={engineSize ? "complete" : year ? "active" : ""}>4 · {ar ? "المحرك" : "Engine"}</span>
      </div>

      <div className="vehicle-finder-grid">
        <label className="vehicle-field">
          <span>{ar ? "الشركة المصنعة" : "Make"}</span>
          <select name="make" value={make} onChange={(event) => changeMake(event.target.value)}>
            <option value="">{ar ? "اختر الشركة" : "Select make"}</option>
            {vehicleMakes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="vehicle-field">
          <span>
            {ar ? "الموديل" : "Model"}
            {modelsLoading ? <small>{ar ? " جارٍ التحميل…" : " Loading A–Z…"}</small> : null}
          </span>
          <select
            value={modelChoice}
            onChange={(event) => changeModel(event.target.value)}
            disabled={!make || modelsLoading}
          >
            <option value="">
              {modelsLoading
                ? ar ? "جارٍ تحميل جميع الموديلات…" : "Loading all models…"
                : ar ? "اختر الموديل" : "Select model"}
            </option>
            {models.map((item) => <option key={item} value={item}>{item}</option>)}
            <option value={OTHER_MODEL}>{ar ? "موديل آخر / غير موجود" : "Other / model not listed"}</option>
          </select>
        </label>

        {modelChoice === OTHER_MODEL ? (
          <label className="vehicle-field vehicle-field-emphasis">
            <span>{ar ? "اكتب اسم الموديل" : "Enter exact model"}</span>
            <input
              value={customModel}
              onChange={(event) => setCustomModel(event.target.value)}
              placeholder={ar ? "مثال: Land Cruiser 70" : "e.g. Land Cruiser 70"}
              autoFocus
            />
          </label>
        ) : (
          <label className="vehicle-field">
            <span>{ar ? "سنة الصنع" : "Year"}</span>
            <select name="year" value={year} onChange={(event) => setYear(event.target.value)} disabled={!model}>
              <option value="">{ar ? "اختر السنة" : "Select year"}</option>
              {allVehicleYears.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        )}

        {modelChoice === OTHER_MODEL ? (
          <label className="vehicle-field">
            <span>{ar ? "سنة الصنع" : "Year"}</span>
            <select name="year" value={year} onChange={(event) => setYear(event.target.value)} disabled={!customModel}>
              <option value="">{ar ? "اختر السنة" : "Select year"}</option>
              {allVehicleYears.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        ) : null}

        <label className="vehicle-field">
          <span>{ar ? "سعة المحرك" : "Engine size"}</span>
          <select
            name="engineSize"
            value={engineSize}
            onChange={(event) => {
              setEngineSize(event.target.value);
              setFuelType("");
              setEngineType("");
            }}
            disabled={!year}
          >
            <option value="">{ar ? "اختر سعة المحرك" : "Select engine size"}</option>
            {curatedSizes.length ? <optgroup label={ar ? "خيارات خليجية شائعة" : "Common GCC options"}>
              {curatedSizes.map((item) => <option key={item} value={item}>{item}</option>)}
            </optgroup> : null}
            <optgroup label={ar ? "جميع الأحجام" : "All engine sizes"}>
              {otherSizes.map((item) => <option key={item} value={item}>{item}</option>)}
            </optgroup>
          </select>
        </label>

        <label className="vehicle-field">
          <span>{ar ? "نوع الوقود" : "Fuel type"}</span>
          <select
            name="fuelType"
            value={fuelType}
            onChange={(event) => {
              setFuelType(event.target.value);
              setEngineType("");
            }}
            disabled={!year}
          >
            <option value="">{ar ? "اختر نوع الوقود" : "Select fuel type"}</option>
            {curatedFuels.length ? <optgroup label={ar ? "خيارات خليجية شائعة" : "Common GCC options"}>
              {curatedFuels.map((item) => <option key={item} value={item}>{item}</option>)}
            </optgroup> : null}
            <optgroup label={ar ? "جميع أنواع الوقود" : "All fuel types"}>
              {otherFuels.map((item) => <option key={item} value={item}>{item}</option>)}
            </optgroup>
          </select>
        </label>

        <label className="vehicle-field">
          <span>{ar ? "تكوين المحرك" : "Engine type"}</span>
          <select name="engineType" value={engineType} onChange={(event) => setEngineType(event.target.value)} disabled={!year}>
            <option value="">{ar ? "اختر نوع المحرك" : "Select engine type"}</option>
            {curatedLayouts.length ? <optgroup label={ar ? "خيارات خليجية شائعة" : "Common GCC options"}>
              {curatedLayouts.map((item) => <option key={item} value={item}>{item}</option>)}
            </optgroup> : null}
            <optgroup label={ar ? "جميع أنواع المحركات" : "All engine types"}>
              {otherLayouts.map((item) => <option key={item} value={item}>{item}</option>)}
            </optgroup>
          </select>
        </label>
      </div>

      <div className="vehicle-variant-row">
        <label className="vehicle-field">
          <span>{ar ? "الفئة / النسخة / السلسلة" : "Variant / trim / series"}</span>
          <input
            name="trim"
            defaultValue={initial.trim ?? ""}
            list={`vehicle-trims-${compact ? "compact" : "full"}`}
            disabled={!year}
            placeholder={trims.length ? (ar ? "اختر أو اكتب الفئة الدقيقة" : "Select or type the exact variant") : (ar ? "اكتب الفئة كما تظهر على السيارة" : "Type the variant exactly as shown on the car")}
          />
          <datalist id={`vehicle-trims-${compact ? "compact" : "full"}`}>
            {trims.map((item) => <option key={item} value={item} />)}
          </datalist>
        </label>

        <label className="vehicle-field">
          <span>{ar ? "رقم الهيكل VIN (اختياري)" : "VIN / chassis number (optional)"}</span>
          <input
            name="vin"
            defaultValue={initial.vin ?? ""}
            maxLength={17}
            placeholder={ar ? "17 حرفاً ورقماً للتأكيد الدقيق" : "17 characters for exact confirmation"}
          />
        </label>
      </div>

      <div className="vehicle-catalogue-status" aria-live="polite">
        <strong>
          {modelsUnavailable
            ? ar ? "تعذر تحميل الدليل الكامل مؤقتاً." : "The full model catalogue is temporarily unavailable."
            : make && !modelsLoading
              ? ar ? `${models.length} موديل متاح ومرتب` : `${models.length} models available, sorted A–Z`
              : ar ? "ابدأ باختيار الشركة المصنعة." : "Start with the manufacturer."}
        </strong>
        <span>
          {ar
            ? "تظهر اقتراحات الفئات الخليجية حيثما كانت متاحة، ويمكنك دائماً كتابة النسخة الدقيقة."
            : "Verified GCC suggestions appear where available; you can always enter the exact regional variant."}
        </span>
      </div>

      <div className="vehicle-finder-actions">
        <div>
          <strong>{ar ? "لست متأكداً من المحرك أو الفئة؟" : "Not sure about the engine or variant?"}</strong>
          <span>{ar ? "اختر الشركة والموديل والسنة فقط، أو أضف رقم الهيكل للتأكيد." : "Choose make, model and year—or add the VIN for confirmation."}</span>
        </div>
        <button className="button button-primary" type="submit" disabled={!make || !model}>
          {ar ? "عرض القطع المتوافقة" : "Find compatible parts"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
