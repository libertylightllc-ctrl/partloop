"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@partsloop/contracts";

const roles: Array<{ role: UserRole; title: string; copy: string }> = [
  { role: "buyer", title: "Buyer", copy: "Browse, checkout, and track protected orders." },
  { role: "seller", title: "Seller", copy: "Create AI listings and manage your wallet." },
  { role: "admin", title: "Admin", copy: "Review disputes and marketplace risk." },
];

export function SignInForm({ nextPath, suggestedRole, supabaseEnabled }: { nextPath: string; suggestedRole?: string; supabaseEnabled: boolean }) {
  const [selected, setSelected] = useState<UserRole>(roles.some((item) => item.role === suggestedRole) ? suggestedRole as UserRole : "buyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function signIn() {
    setLoading(true);
    const response = await fetch("/api/auth/demo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: selected }) });
    if (response.ok) {
      router.push(selected === "buyer" ? nextPath : selected === "seller" ? "/seller" : "/admin");
      router.refresh();
    } else setLoading(false);
  }
  async function secureSignIn(formData: FormData) {
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }),
    });
    const result = await response.json().catch(() => ({})) as { role?: UserRole; error?: string };
    if (!response.ok) {
      setError(result.error ?? "Sign-in failed.");
      setLoading(false);
      return;
    }
    router.push(result.role === "seller" ? "/seller" : result.role === "admin" ? "/admin" : nextPath);
    router.refresh();
  }
  if (supabaseEnabled) {
    return (
      <form className="secure-signin" action={secureSignIn}>
        <label>Email address<input type="email" name="email" autoComplete="email" required placeholder="you@company.ae" /></label>
        <label>Password<input type="password" name="password" autoComplete="current-password" required minLength={8} /></label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="button button-primary" disabled={loading}>{loading ? "Signing in…" : "Sign in securely"}</button>
        <small>Local seed account: seller@partsloop.local / PartsLoopDemo123!</small>
      </form>
    );
  }
  return (
    <div className="role-options">
      {roles.map((item) => <button type="button" key={item.role} className={selected === item.role ? "selected" : ""} onClick={() => setSelected(item.role)}><span>{item.role === "buyer" ? "B" : item.role === "seller" ? "S" : "A"}</span><div><strong>{item.title}</strong><small>{item.copy}</small></div><b>{selected === item.role ? "✓" : ""}</b></button>)}
      <button type="button" className="button button-primary" onClick={signIn} disabled={loading}>{loading ? "Opening workspace…" : `Continue as ${selected}`}</button>
      <small className="demo-note">Local demo only — no password or real payment required.</small>
    </div>
  );
}
