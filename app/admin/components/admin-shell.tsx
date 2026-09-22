'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '../actions';

const LINKS = [
  { href: '/admin/overview', label: 'نظرة عامة' },
  { href: '/admin/projects', label: 'المشاريع' },
  { href: '/admin/stories', label: 'القصص والأخبار' },
  { href: '/admin/resources', label: 'الموارد' },
  { href: '/admin/partners', label: 'الشركاء' },
  { href: '/admin/settings', label: 'الإعدادات' },
];

export default function AdminShell({ children, configured }: { children: React.ReactNode; configured: boolean }) {
  const pathname = usePathname();

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link href="/admin/overview" className="admin-brand">لوحة هسدو</Link>
        <nav className="admin-nav">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? 'active' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="admin-topbar-actions">
          {!configured && <span className="chip chip-warn">وضع الاستعراض — بيانات تجريبية</span>}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => void logout()}>خروج</button>
          <Link href="/" className="btn btn-ghost btn-sm">عرض الموقع</Link>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}