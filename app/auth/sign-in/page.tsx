import type { Metadata } from "next";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; role?: string }> }) {
  const params = await searchParams;
  const supabaseEnabled = process.env.DEMO_MODE === "false" && Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="brand auth-brand"><span className="brand-mark">P</span>PartsLoop</span>
        <span className="eyebrow">{supabaseEnabled ? "SECURE ACCOUNT ACCESS" : "DEMO ACCESS"}</span>
        <h1>{supabaseEnabled ? "Welcome back" : "Choose how you want to explore"}</h1>
        <p>{supabaseEnabled ? "Sign in with your PartsLoop buyer or business account." : "Use a local demo role now. Supabase Auth takes over automatically in connected mode."}</p>
        <SignInForm nextPath={params.next ?? "/"} suggestedRole={params.role} supabaseEnabled={supabaseEnabled} />
      </section>
    </main>
  );
}
