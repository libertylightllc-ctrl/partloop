import { NextRequest, NextResponse } from "next/server";

interface VpicModelResult {
  Model_Name?: string;
}

interface VpicResponse {
  Results?: VpicModelResult[];
}

const VPIC_BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

export async function GET(request: NextRequest) {
  const make = request.nextUrl.searchParams.get("make")?.trim() ?? "";

  if (!make || make.length > 80) {
    return NextResponse.json({ models: [], error: "A valid make is required." }, { status: 400 });
  }

  try {
    const response = await fetch(`${VPIC_BASE_URL}/GetModelsForMake/${encodeURIComponent(make)}?format=json`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`vPIC returned ${response.status}`);
    }

    const data = (await response.json()) as VpicResponse;
    const models = [...new Set(
      (data.Results ?? [])
        .map((item) => item.Model_Name?.trim())
        .filter((item): item is string => Boolean(item)),
    )].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

    return NextResponse.json(
      { make, models, source: "NHTSA vPIC" },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { make, models: [], error: "The full model catalogue is temporarily unavailable." },
      { status: 502 },
    );
  }
}
