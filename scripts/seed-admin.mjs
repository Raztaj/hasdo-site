#!/usr/bin/env node
/**
 * Seed/helpers for the Supabase project:
 *   node scripts/seed-admin.mjs
 * Prompts to create the first admin user (editable: keep it simple, purely programmatic —
 * set ADMIN_EMAIL / ADMIN_PASSWORD to skip prompting).
 *
 * Requires the same .env.local variables as the app
 * (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

function loadEnv() {
  const file = new URL('../.env.local', import.meta.url).pathname;
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const service = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });

const rl = createInterface({ input: stdin, output: stdout });

async function prompt(q, fallback) {
  const v = await rl.question(`${q}${fallback ? ` [${fallback}]` : ''}: `);
  return v.trim() || fallback;
}

const email = (env.ADMIN_EMAIL || (await prompt('البريد الإلكتروني للمدير')).trim()).trim();
const password = env.ADMIN_PASSWORD || (await prompt('كلمة المرور (8+ أحرف)')).trim();
const fullName = env.ADMIN_NAME || (await prompt('الاسم', 'مدير الموقع'));
rl.close();

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: fullName, role: 'admin' },
});
if (error) {
  console.error('createUser:', error.message);
  process.exit(1);
}
console.log(`OK — أنشئ المستخدم ${data.user?.email ?? email} (تم تأكيد البريد).`);