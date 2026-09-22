import Link from 'next/link';
import { NAV, ORG } from '@/lib/site';
import { getOrganization } from '@/lib/data';
import WorldMap from './world-map';

export default async function Footer() {
  const org = await getOrganization();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand" aria-label={org.name_ar}>
            <img src="/img/logo-transparent.png" alt="" aria-hidden="true" className="brand-logo" loading="lazy" />
            <span className="brand-text">
              <strong className="brand-name">{org.acronym}</strong>
              <span className="brand-full">{org.name_ar}</span>
            </span>
          </Link>
          <p className="footer-blurb">{org.description_ar}</p>
          <address className="footer-contact">
            {org.address_ar && <span>{org.address_ar}</span>}
            {org.email && <span>{org.email}</span>}
            {org.phone && <span>{org.phone}</span>}
          </address>
        </div>

        <nav className="footer-nav" aria-label="روابط الموقع">
          <h3>الموقع</h3>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-nav" aria-label="روابط قانونية">
          <h3>وثائق</h3>
          <ul>
            <li><Link href="/legal/privacy">سياسة الخصوصية</Link></li>
            <li><Link href="/legal/terms">شروط الاستخدام</Link></li>
          </ul>
        </nav>
      </div>

      <div className="footer-terrain">
        <WorldMap className="world-wm--center" marker={{ x: 525, y: 185 }} />
        <p className="footer-terrain-note">
          حاضرون حيث تكون الحاجة — من الخرطوم إلى عمق الميدان
          <span className="num">.WHERE WE WORK</span>
        </p>
      </div>

      <div className="container footer-bottom">
        <span>© {ORG.acronym} 2026 — {ORG.country}</span>
        <Link href="/admin/overview" className="footer-admin">لوحة التحكم</Link>
        <span className="num">FIELD EDITION</span>
      </div>
    </footer>
  );
}