import { NextResponse } from "next/server";
import { searchMarketplaceProducts } from "@/lib/repositories/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const results = await searchMarketplaceProducts({
    q,
    category: searchParams.get("category") ?? undefined,
    condition: searchParams.get("condition") ?? undefined,
    compatibility: searchParams.get("compatibility") ?? undefined,
    verified: searchParams.get("verified") === "1",
    sort: searchParams.get("sort") ?? undefined,
    make: searchParams.get("make") ?? undefined,
    model: searchParams.get("model") ?? undefined,
    year: searchParams.get("year") ?? undefined,
    engineSize: searchParams.get("engineSize") ?? undefined,
    fuelType: searchParams.get("fuelType") ?? undefined,
    engineType: searchParams.get("engineType") ?? undefined,
    trim: searchParams.get("trim") ?? undefined,
    vin: searchParams.get("vin") ?? undefined,
  });
  return NextResponse.json({ data: results, meta: { count: results.length, query: q } }, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
}
