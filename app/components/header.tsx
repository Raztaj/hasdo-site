'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, ORG } from '@/lib/site';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label={ORG.nameAr}>
            <img src="/img/logo-transparent.png" alt="" aria-hidden="true" className="brand-logo" loading="eager" />
            <span className="brand-text">
              <strong className="brand-name">{ORG.acronym}</strong>
              <span className="brand-full">{ORG.nameAr}</span>
            </span>
          </Link>

          <nav className="header-nav" aria-label="القائمة الرئيسية">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(pathname, item.href) ? 'active' : undefined}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="burger"
              aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="القائمة الرئيسية">
          <nav className="drawer-nav">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(pathname, item.href) ? 'active' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/participate" className="btn btn-primary drawer-cta" onClick={() => setOpen(false)}>
              شارك معنا
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}