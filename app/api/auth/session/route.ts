import { NextResponse } from "next/server";
import type { UserRole } from "@partsloop/contracts";
import { supabaseQuery } from "@/lib/supabase-rest";

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: { id: string; email?: string };
}

export async function POST(request: Request) {
  if (process.env.DEMO_MODE !== "false") return NextResponse.json({ error: "Secure account mode is not enabled." }, { status: 409 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "Account service is not configured." }, { status: 503 });
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string };
  if (!body.email || !body.password || body.password.length < 8) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 422 });
  const authResponse = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });
  if (!authResponse.ok) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  const session = await authResponse.json() as AuthResponse;
  const profiles = await supabaseQuery<Array<{ role: UserRole }>>(`profiles?id=eq.${encodeURIComponent(session.user.id)}&select=role`);
  const role = profiles[0]?.role ?? "buyer";
  const response = NextResponse.json({ ok: true, role });
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set("partsloop-access-token", session.access_token, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: session.expires_in });
  response.cookies.set("partsloop-refresh-token", session.refresh_token, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 60 * 60 * 24 * 30 });
  response.cookies.set("partsloop-user-id", session.user.id, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: session.expires_in });
  response.cookies.set("partsloop-user-email", session.user.email ?? body.email, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: session.expires_in });
  response.cookies.set("partsloop-role", role, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: session.expires_in });
  return response;
}
