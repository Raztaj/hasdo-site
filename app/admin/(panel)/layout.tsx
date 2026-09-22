import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient, isDbConfigured } from '@/lib/supabase/server';
import AdminShell from '../components/admin-shell';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (isDbConfigured()) {
    let user = null;
    try {
      const supabase = await createClient();
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      user = u;
    } catch {
      user = null;
    }
    if (!user) redirect('/admin/login');
  }

  return (
    <Suspense fallback={<p className="admin-loading">…</p>}>{children}</Suspense>
  );
}