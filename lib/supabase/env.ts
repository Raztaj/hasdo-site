export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isDbConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON);
}