'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, isDbConfigured } from '@/lib/supabase/server';
import { deleteRow, saveRow, writeSettings, type WriteResult } from '@/lib/admin';

export type { WriteResult };

/* ------------------------------------------------------------------------ auth */

export async function login(formData: FormData): Promise<{ ok: false; error: string } | undefined> {
  if (!isDbConfigured()) return { ok: false, error: 'Supabase غير مرتبط بعد.' };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  });
  if (error) return { ok: false, error: 'بيانات الدخول غير صحيحة.' };
  redirect('/admin/overview');
}

export async function logout() {
  if (isDbConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect('/admin/login');
}

/* ---------------------------------------------------------- named table writes */

function refreshPublic() {
  revalidatePath('/');
  revalidatePath('/projects');
  revalidatePath('/map');
  revalidatePath('/stories');
  revalidatePath('/resources');
}

export async function saveProject(input: Record<string, unknown>): Promise<WriteResult> {
  const result = await saveRow('projects', input);
  if (result.ok) refreshPublic();
  return result;
}
export async function deleteProject(id: string): Promise<WriteResult> {
  const result = await deleteRow('projects', id);
  if (result.ok) refreshPublic();
  return result;
}
export async function saveStory(input: Record<string, unknown>): Promise<WriteResult> {
  const result = await saveRow('stories', input);
  if (result.ok) revalidatePath('/stories');
  return result;
}
export async function deleteStory(id: string): Promise<WriteResult> {
  const result = await deleteRow('stories', id);
  if (result.ok) revalidatePath('/stories');
  return result;
}
export async function saveResource(input: Record<string, unknown>): Promise<WriteResult> {
  const result = await saveRow('resources', input);
  if (result.ok) revalidatePath('/resources');
  return result;
}
export async function deleteResource(id: string): Promise<WriteResult> {
  const result = await deleteRow('resources', id);
  if (result.ok) revalidatePath('/resources');
  return result;
}
export async function savePartner(input: Record<string, unknown>): Promise<WriteResult> {
  const result = await saveRow('partners', input);
  if (result.ok) revalidatePath('/');
  return result;
}
export async function deletePartner(id: string): Promise<WriteResult> {
  const result = await deleteRow('partners', id);
  if (result.ok) revalidatePath('/');
  return result;
}
export async function saveSettings(input: Parameters<typeof writeSettings>[0]): Promise<WriteResult> {
  const result = await writeSettings(input);
  if (result.ok) refreshPublic();
  return result;
}