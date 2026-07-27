const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonymousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(url && (serviceKey || anonymousKey));
}

export async function supabaseQuery<T>(path: string, init?: RequestInit): Promise<T> {
  const key = serviceKey || anonymousKey;
  if (!url || !key) throw new Error("Supabase is not configured. Use DEMO_MODE=true or provide Supabase environment values.");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export function supabasePublicAsset(bucket: string, path: string) {
  if (!url) return path;
  if (/^https?:\/\//.test(path)) return path;
  return `${url}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, "")}`;
}
