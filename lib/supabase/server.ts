import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON, isDbConfigured } from './env';

export const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export { isDbConfigured };

/** Server client bound to the session cookies (auth-aware, RLS applies). */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL!, SUPABASE_ANON!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — safe to ignore when middleware refreshes sessions.
        }
      },
    },
  });
}

/** Client with the service-role key (bypasses RLS). Server actions/admin only. */
export function adminClient() {
  const key = SUPABASE_SERVICE || SUPABASE_ANON!;
  return createServerClient(SUPABASE_URL!, key, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}