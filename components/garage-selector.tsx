"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale, Vehicle } from "@partsloop/contracts";

export function GarageSelector({ vehicles, locale }: { vehicles: Vehicle[]; locale: Locale }) {
  const ar = locale === "ar";
  const [selectedId, setSelectedId] = useState(vehicles[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"garage" | "add">("garage");
  const [saved, setSaved] = useState(vehicles);
  const selected = saved.find((vehicle) => vehicle.id === selectedId) ?? saved[0];

  function addVehicle(formData: FormData) {
    const next: Vehicle = {
      id: `veh_${Date.now()}`,
      make: String(formData.get("make") ?? "Toyota"),
      model: String(formData.get("model") ?? "Land Cruiser"),
      year: Number(formData.get("year") ?? 2021),
      engine: String(formData.get("engine") ?? "4.0L"),
      trim: String(formData.get("trim") ?? ""),
      vin: String(formData.get("vin") ?? ""),
    };
    setSaved((current) => [...current, next]);
    setSelectedId(next.id);
    setOpen(false);
  }

  return (
    <>
      <section className="garage-strip">
        <div className="page-shell garage-inner">
          <div className="garage-title"><span>◆</span><div><small>{ar ? "كراجي" : "MY GARAGE"}</small><strong>{ar ? "اعرض القطع المناسبة لسيارتك" : "Show only parts that fit"}</strong></div></div>
          <button className="vehicle-pill" type="button" onClick={() => { setMode("garage"); setOpen(true); }}>
            <span>{selected?.make.toUpperCase()}</span>
            <div><strong>{selected?.make} {selected?.model}</strong><small>{selected?.year} • {selected?.engine} • {selected?.trim}</small></div>
            <b>⌄</b>
          </button>
          <Link href={`/search?vehicle=${encodeURIComponent(`${selected?.make}-${selected?.model}`)}`} className="button button-light">{ar ? "تسوق لهذه السيارة" : "Shop for this vehicle"}</Link>
          <button type="button" className="add-vehicle" onClick={() => { setMode("add"); setOpen(true); }}>＋ {ar ? "أضف سيارة" : "Add vehicle"}</button>
        </div>
      </section>

      {open && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setOpen(false);
        }}>
          <section className="garage-modal" role="dialog" aria-modal="true" aria-labelledby="garage-title">
            <div className="modal-heading">
              <div><span className="eyebrow">{ar ? "ملف التوافق" : "FITMENT PROFILE"}</span><h2 id="garage-title">{mode === "garage" ? (ar ? "اختر سيارتك" : "Choose your vehicle") : (ar ? "أضف سيارة" : "Add a vehicle")}</h2></div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>
            {mode === "garage" ? (
              <>
                <div className="garage-vehicles">
                  {saved.map((vehicle) => (
                    <button
                      type="button"
                      key={vehicle.id}
                      className={selectedId === vehicle.id ? "selected" : ""}
                      onClick={() => { setSelectedId(vehicle.id); setOpen(false); }}
                    >
                      <span>{vehicle.make.slice(0, 2).toUpperCase()}</span>
                      <div><strong>{vehicle.make} {vehicle.model}</strong><small>{vehicle.year} • {vehicle.engine} • {vehicle.trim}</small></div>
                      <b>{selectedId === vehicle.id ? "✓" : ""}</b>
                    </button>
                  ))}
                </div>
                <button type="button" className="button button-primary modal-full" onClick={() => setMode("add")}>＋ {ar ? "أضف سيارة أخرى" : "Add another vehicle"}</button>
              </>
            ) : (
              <form action={addVehicle} className="garage-form">
                <div className="vin-entry"><span>VIN</span><div><strong>{ar ? "الأسرع: أدخل رقم الهيكل" : "Fastest: enter the VIN"}</strong><small>{ar ? "سنقترح الموديل والمحرك والفئة" : "We’ll suggest model, engine, and trim"}</small></div></div>
                <label className="full-span">{ar ? "رقم الهيكل" : "VIN"}<input name="vin" placeholder="JTMHU09J1M4123456" minLength={8} /></label>
                <div className="form-grid">
                  <label>{ar ? "الشركة" : "Make"}<select name="make" defaultValue="Toyota"><option>Toyota</option><option>Nissan</option><option>Lexus</option><option>Hyundai</option><option>Mercedes-Benz</option><option>Land Rover</option></select></label>
                  <label>{ar ? "الموديل" : "Model"}<input name="model" defaultValue="Land Cruiser" required /></label>
                  <label>{ar ? "السنة" : "Year"}<input name="year" type="number" min="1950" max="2100" defaultValue="2021" required /></label>
                  <label>{ar ? "المحرك" : "Engine"}<input name="engine" defaultValue="4.0L V6" required /></label>
                  <label className="full-span">{ar ? "الفئة" : "Trim"}<input name="trim" defaultValue="GXR" /></label>
                </div>
                <div className="wizard-actions"><button type="button" className="button button-light" onClick={() => setMode("garage")}>{ar ? "رجوع" : "Back"}</button><button className="button button-primary">{ar ? "احفظ في كراجي" : "Save to My Garage"}</button></div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
