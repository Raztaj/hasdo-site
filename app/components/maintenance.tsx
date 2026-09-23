import { ORG } from '@/lib/site';

export default function Maintenance() {
  return (
    <main className="maintenance">
      <header className="maint-header">
        <div className="container header-inner">
          <span className="brand">
            <img src="/img/logo-transparent.png" alt="" aria-hidden="true" className="brand-logo" loading="eager" />
            <span className="brand-text">
              <strong className="brand-name">{ORG.acronym}</strong>
              <span className="brand-full">{ORG.nameAr}</span>
            </span>
          </span>
          <span className="maint-state num">FIELD EDITION</span>
        </div>
      </header>

      <section className="maint-stage">
        <div className="container maint-grid">
          <div className="maint-copy">
            <p className="kicker num">SITE UNDER MAINTENANCE · T. KHALID</p>
            <h1 className="display">نعود قريباً</h1>
            <p className="hero-support">
              نعمل حالياً على تحديث الموقع وتجهيز تجربة أفضل لكم — سنعود قريباً
              بإذن الله، بوجه جديد يحمل أهدافنا ذاتها.
            </p>
            <p className="maint-by">
              الصيانة التطويرية بإشراف <a href="mailto:info@hasdo.org">Tajelsir Khalid</a>
            </p>
          </div>

          <div className="maint-card">
            <img src="/img/logo-emblem.png" alt="" aria-hidden="true" className="maint-emblem" loading="lazy" />
            <span className="maint-card-title">{ORG.acronym}</span>
            <span className="maint-coord num">15.5°N — 32.5°E · KRT</span>
          </div>
        </div>
      </section>

      <footer className="maint-foot">
        <div className="container footer-bottom">
          <span>© {ORG.acronym} 2026 — {ORG.country}</span>
          <span className="num">MAINTENANCE BY TAJELSIR KHALID</span>
          <span className="num">UNDER CONSTRUCTION</span>
        </div>
      </footer>
    </main>
  );
}