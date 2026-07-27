import { NextResponse } from "next/server";
import type { UserRole } from "@partsloop/contracts";

const roles: UserRole[] = ["buyer", "seller", "admin"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { role?: UserRole };
  if (!body.role || !roles.includes(body.role)) return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  const response = NextResponse.json({ ok: true, role: body.role });
  response.cookies.set("partsloop-role", body.role, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
