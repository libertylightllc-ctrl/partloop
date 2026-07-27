import { NextResponse } from "next/server";
import { validateListingDraft } from "@partsloop/contracts";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateListingDraft(body);
  if (!result.success || !result.data) return NextResponse.json({ error: "Please correct the listing details.", fields: result.errors }, { status: 422 });
  const { oemNumber, donorVehicle, notes } = result.data;
  if (process.env.AI_LISTING_ENDPOINT && process.env.AI_LISTING_API_KEY) {
    const response = await fetch(process.env.AI_LISTING_ENDPOINT, { method: "POST", headers: { Authorization: `Bearer ${process.env.AI_LISTING_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(result.data) });
    if (!response.ok) return NextResponse.json({ error: "AI provider is temporarily unavailable." }, { status: 502 });
    return NextResponse.json(await response.json());
  }
  return NextResponse.json({
    title: `Toyota Land Cruiser Front Left LED Headlight OEM ${oemNumber} — Grade A`,
    titleAr: `مصباح ليد أمامي يسار تويوتا لاند كروزر أصلي ${oemNumber} — درجة A`,
    description: `Genuine front-left LED headlight removed from a ${donorVehicle}. ${notes} OEM number verified from the supplied label photo.`,
    descriptionAr: `مصباح ليد أمامي أصلي يسار مفكوك من ${donorVehicle}. خدشان سطحيان خفيفان، دون كسور، وقواعد التثبيت سليمة. تم التحقق من رقم القطعة من صورة الملصق.`,
    category: "Lights",
    grade: "Grade A",
    suggestedPrice: 875,
    compatibility: ["Toyota Land Cruiser 2018–2021 4.0L", "Lexus LX 2018–2021"],
    confidence: 96,
    provider: "deterministic-mock",
  });
}
