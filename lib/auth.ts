import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@partsloop/contracts";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function getSession() {
  const store = await cookies();
  const role = store.get("partsloop-role")?.value as UserRole | undefined;
  const demoMode = process.env.DEMO_MODE !== "false";
  const accessToken = store.get("partsloop-access-token")?.value;
  const userId = store.get("partsloop-user-id")?.value;
  const userEmail = store.get("partsloop-user-email")?.value;
  const hostedUser = await getChatGPTUser();
  if (hostedUser) return { id: hostedUser.email, email: hostedUser.email, name: hostedUser.displayName, role: role ?? "buyer" as UserRole };
  if (!demoMode && accessToken && userId && userEmail && role) return { id: userId, email: userEmail, role };
  if (demoMode && role) return { id: `demo_${role}`, email: `${role}@partsloop.local`, role };
  if (demoMode) return { id: "demo_buyer", email: "buyer@partsloop.local", role: "buyer" as const };
  return null;
}

export async function requireRole(allowed: UserRole[], returnTo: string) {
  const session = await getSession();
  if (!session) redirect(`/auth/sign-in?next=${encodeURIComponent(returnTo)}`);
  if (!allowed.includes(session.role)) redirect(`/auth/sign-in?next=${encodeURIComponent(returnTo)}&role=${allowed[0]}`);
  return session;
}
