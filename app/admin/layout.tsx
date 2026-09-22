import { Suspense } from 'react';
import { isDbConfigured } from '@/lib/supabase/server';
import AdminShell from './components/admin-shell';

export const metadata = { title: 'لوحة البيانات | منظمة هسدو' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell configured={isDbConfigured()}>
      <Suspense fallback={<p className="admin-loading">…</p>}>{children}</Suspense>
    </AdminShell>
  );
}