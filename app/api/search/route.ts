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
  });
  return NextResponse.json({ data: results, meta: { count: results.length, query: q } }, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
}
