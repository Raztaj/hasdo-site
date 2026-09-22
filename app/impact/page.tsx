import type { Metadata } from 'next';
import Link from 'next/link';
import { MAP_LOCALITIES, MAP_STATES } from '@/lib/mapdata';
import { stateCodeToArabic } from '@/lib/geo';
import { getAreas, getPresence, getProjects } from '@/lib/data';
import { AREA_SHORT, STATUS_LABELS } from '@/lib/site';
import Counter from '@/app/components/counter';
import ImpactMap from '@/app/components/impact-map';
import SudanSilhouette from '@/app/components/sudan-silhouette';

export const metadata: Metadata = { title: 'الأثر' };

export default async function ImpactPage() {
  const [areas, projects, presence] = await Promise.all([
    getAreas(),
    getProjects(),
    getPresence(),
  ]);

  const beneficiaries = projects.reduce((s, p) => s + (p.beneficiaries ?? 0), 0);
  const volunteers = projects.reduce((s, p) => s + p.volunteers, 0);
  const communities = projects.reduce((s, p) => s + p.communities, 0);
  const completed = projects.filter((p) => p.status === 'completed').length;
  const active = projects.filter((p) => p.status === 'active').length;
  const planned = projects.filter((p) => p.status === 'planned').length;

  const statesCount = new Set<string>();
  for (const p of projects) if (p.state_code) statesCount.add(p.state_code);
  for (const pr of presence) statesCount.add(pr.code);

  const areaMetrics = areas.map((a) => {
    const projs = projects.filter((p) => p.areas.includes(a.name_ar));
    return {
      id: a.id,
      name: a.name_ar,
      projects: projs.length,
      beneficiaries: projs.reduce((s, p) => s + (p.beneficiaries ?? 0), 0),
    };
  });

  const secN = (n: number) => <span className="sec-num num">{String(n).padStart(2, '0')}</span>;

  return (
    <main className="page impact-page">
      <section className="state-hero has-wm">
        <SudanSilhouette />
        <div className="container">
          <p className="kicker">الأثر</p>
          <h1 className="display">ماذا تغيّر نتيجة العمل؟</h1>
          <p className="muted">أرقام حقيقية تُحسب من المشاريع المنشورة، وليست وعوداً.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sec-head">
            {secN(1)}
            <div>
              <p className="kicker">الأثر بالرقم</p>
              <h2 className="h2">الأرقام عناوين، لا ديكور</h2>
            </div>
            <span className="sec-en num">BY THE NUMBERS</span>
          </div>
          <div className="impact-stats">
            <div className="impact-stat">
              <span className="impact-num">{beneficiaries > 0 ? <Counter value={beneficiaries} /> : '—'}</span>
              <span className="impact-label">مستفيداً من المشاريع المنجزة</span>
            </div>
            <div className="impact-stat">
              <span className="impact-num"><Counter value={projects.length} /></span>
              <span className="impact-label">{projects.length === 1 ? 'مشروع' : 'مشروعاً'} · منها {completed} منجزاً</span>
            </div>
            <div className="impact-stat">
              <span className="impact-num">{volunteers > 0 ? <Counter value={volunteers} /> : '—'}</span>
              <span className="impact-label">متطوعاً ساهموا في العمل</span>
            </div>
            <div className="impact-stat">
              <span className="impact-num">{communities > 0 ? <Counter value={communities} /> : '—'}</span>
              <span className="impact-label">مجتمعاً محلياً شريكاً</span>
            </div>
            <div className="impact-stat">
              <span className="impact-num"><Counter value={statesCount.size} /></span>
              <span className="impact-label">ولاية نعمل فيها</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section impact-section">
        <div className="container">
          <div className="sec-head">
            {secN(2)}
            <div>
              <p className="kicker">الأثر حسب المجال</p>
              <h2 className="h2">مجالات العمل</h2>
            </div>
            <span className="sec-en num">BY AREA</span>
          </div>
          <ul className="area-impact full">
            {areaMetrics.map((m) => (
              <li key={m.id} className="area-impact-row">
                <i className="dot-legend dot--office" style={{ boxShadow: 'none' }} />
                <span>{m.name}</span>
                <span className="num">{m.projects} مشاريع · {m.beneficiaries > 0 ? m.beneficiaries.toLocaleString('en-US') : '—'} مستفيد</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section impact-section">
        <div className="container">
          <div className="sec-head">
            {secN(3)}
            <div>
              <p className="kicker">الأثر حسب الموقع</p>
              <h2 className="h2">خريطة الأثر</h2>
            </div>
            <span className="sec-en num">BY LOCATION</span>
          </div>
          <ImpactMap projects={projects} presence={presence} states={MAP_STATES} localities={MAP_LOCALITIES} />
        </div>
      </section>

      <section className="section impact-section">
        <div className="container">
          <div className="sec-head row-between">
            <span className="sec-num num">04</span>
            <div>
              <p className="kicker">مراحل المشاريع</p>
              <h2 className="h2">حالة المشاريع</h2>
            </div>
            <Link href="/projects" className="link-more">كل المشاريع ←</Link>
          </div>
          <div className="status-strip">
            <span className="status-item"><i className="status-dot" style={{ background: 'var(--hasdo-blue)' }} />{STATUS_LABELS.planned} <strong className="num">{planned}</strong></span>
            <span className="status-item"><i className="status-dot" style={{ background: '#e8a213' }} />{STATUS_LABELS.active} <strong className="num">{active}</strong></span>
            <span className="status-item"><i className="status-dot" style={{ background: '#0d8239' }} />{STATUS_LABELS.completed} <strong className="num">{completed}</strong></span>
          </div>

          <h2 className="h2">جدول المشاريع</h2>
          <div className="projects-table-wrap">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>المشروع</th>
                  <th>المجال</th>
                  <th>الموقع</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/projects/${encodeURIComponent(p.slug)}`}>{p.name_ar}</Link>
                    </td>
                    <td>{p.areas.map((a) => AREA_SHORT[a] ?? a).join(' · ')}</td>
                    <td>{stateCodeToArabic(p.state_code)}</td>
                    <td>
                      <span className={`status-pill status-${p.status}`}>{STATUS_LABELS[p.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}