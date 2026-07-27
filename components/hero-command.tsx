"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@partsloop/contracts";

export function HeroCommand({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [mode, setMode] = useState<"part" | "vehicle">("part");

  return (
    <div className="hero-command">
      <div className="hero-command-tabs" role="tablist" aria-label={ar ? "طريقة البحث" : "Search method"}>
        <button type="button" role="tab" aria-selected={mode === "part"} className={mode === "part" ? "active" : ""} onClick={() => setMode("part")}>
          <span>01</span>{ar ? "قطعة أو OEM" : "Part or OEM"}
        </button>
        <button type="button" role="tab" aria-selected={mode === "vehicle"} className={mode === "vehicle" ? "active" : ""} onClick={() => setMode("vehicle")}>
          <span>02</span>{ar ? "حسب السيارة" : "By vehicle"}
        </button>
      </div>
      <form action="/search" className="hero-search">
        <span className="search-signal" aria-hidden="true" />
        <input
          key={mode}
          name="q"
          autoComplete="off"
          placeholder={mode === "part"
            ? (ar ? "اسم القطعة، رقم OEM أو VIN" : "Part name, OEM number or VIN")
            : (ar ? "مثال: تويوتا لاند كروزر 2021 4.0L" : "e.g. Toyota Land Cruiser 2021 4.0L")}
          aria-label={mode === "part" ? (ar ? "البحث عن قطعة" : "Search for a part") : (ar ? "البحث حسب السيارة" : "Search by vehicle")}
        />
        <button type="submit">{ar ? "ابدأ المطابقة" : "Start matching"}<i aria-hidden="true">→</i></button>
      </form>
      <div className="hero-command-foot">
        <span>{ar ? "جرّب" : "Popular"}</span>
        <Link href="/search?q=81150-60R30">81150-60R30</Link>
        <Link href="/search?q=Land+Cruiser">Land Cruiser</Link>
        <Link href="/search?category=suspension">{ar ? "نظام التعليق" : "Suspension"}</Link>
      </div>
    </div>
  );
}
