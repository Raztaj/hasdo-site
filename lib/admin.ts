import { adminClient, isDbConfigured, SUPABASE_SERVICE } from '@/lib/supabase/server';

export type WriteResult = { ok: boolean; error?: string };

function guard(): WriteResult | null {
  if (!isDbConfigured()) return { ok: false, error: 'Supabase غير مرتبط بعد — أضف متغيرات البيئة.' };
  if (!SUPABASE_SERVICE) return { ok: false, error: 'مفتاح الخدمة SUPABASE_SERVICE_ROLE_KEY غير مضبوط.' };
  return null;
}

/** كتابة عبر مفتاح الخدمة — تُستدعى داخل إجراءات مسماة فقط، لا تُكشف كلوحة مفاتيح. */
export async function saveRow(table: string, input: Record<string, unknown>): Promise<WriteResult> {
  const blocked = guard();
  if (blocked) return blocked;
  const { error } = await adminClient().from(table).upsert(input);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteRow(table: string, id: string): Promise<WriteResult> {
  const blocked = guard();
  if (blocked) return blocked;
  const { error } = await adminClient().from(table).delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function writeSettings(input: {
  org: Record<string, unknown>;
  hq: string;
  sites: string[];
  stats: Array<{ key: string; label_ar: string; value_num: number; value: string }>;
}): Promise<WriteResult> {
  const blocked = guard();
  if (blocked) return blocked;
  const client = adminClient();

  const orgError = await client.from('organization').update(input.org).eq('id', 1);
  if (orgError.error) return { ok: false, error: `organization: ${orgError.error.message}` };

  const hqRows = [{ code: input.hq, office_kind: 'country' }];
  const siteRows = input.sites
    .filter((c) => c !== input.hq)
    .map((code) => ({ code, office_kind: null as string | null }));

  const presenceError = await client.from('state_presence').delete().neq('code', '');
  if (presenceError.error) return { ok: false, error: `state_presence: ${presenceError.error.message}` };
  if (hqRows.length || siteRows.length) {
    const insertError = await client.from('state_presence').insert([...hqRows, ...siteRows]);
    if (insertError.error) return { ok: false, error: `state_presence insert: ${insertError.error.message}` };
  }

  for (const s of input.stats) {
    const statError = await client
      .from('site_stats')
      .upsert({ key: s.key, label_ar: s.label_ar, value_num: s.value_num, value: s.value });
    if (statError.error) return { ok: false, error: `site_stats: ${statError.error.message}` };
  }

  return { ok: true };
}