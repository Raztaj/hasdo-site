import type { Metadata } from 'next';
import Link from 'next/link';
import { getAreas, getProjects } from '@/lib/data';
import { stateCodeToArabic } from '@/lib/geo';
import { arNoun, NOUN } from '@/lib/site';
import SudanSilhouette from '@/app/components/sudan-silhouette';

export const metadata: Metadata = { title: 'مجالات العمل' };

const AREA_COLORS: Record<string, string> = {
  'الشباب': 'var(--hasdo-blue)',
  'تقوية روابط المجتمع': '#e8a213',
  'التعليم': '#0d8239',
};

function AreaChart({ counts, color }: { counts: Array<{ state: string; n: number }>; color: string }) {
  const max = Math.max(1, ...counts.map((c) => c.n));
  const rows = counts.length;
  const rowH = 34;
  const H = rows * rowH + 4;
  const W = 640;
  const barMax = 430;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="توزيع المشاريع في المجال عبر الولايات" className="area-chart">
      {counts.map((c, i) => {
        const y = 4 + i * rowH;
        const bw = Math.max(6, (c.n / max) * barMax);
        return (
          <g key={c.state}>
            <text x={0} y={y + 18} className="ac-state">{c.state}</text>
            <rect x={150} y={y} width={bw} height={18} rx={5} fill={color} opacity={0.85} />
            <text x={150 + bw + 10} y={y + 15} className="ac-num">{c.n}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default async function AreasPage() {
  const [areas, projects] = await Promise.all([getAreas(), getProjects()]);

  const data = areas.map((a) => {
    const projs = projects.filter((p) => p.areas.includes(a.name_ar));
    const byState = new Map<string, number>();
    for (const p of projs) {
      if (!p.state_code) continue;
      byState.set(stateCodeToArabic(p.state_code), (byState.get(stateCodeToArabic(p.state_code)) ?? 0) + 1);
    }
    const counts = Array.from(byState.entries())
      .map(([state, n]) => ({ state, n }))
      .sort((x, y) => y.n - x.n);
    const beneficiaries = projs.reduce((s, p) => s + (p.beneficiaries ?? 0), 0);
    return { area: a, count: projs.length, beneficiaries, counts, color: AREA_COLORS[a.name_ar] ?? 'var(--hasdo-blue)' };
  });

  return (
    <main className="page areas-page">
      <section className="state-hero has-wm">
        <SudanSilhouette />
        <div className="container">
          <p className="kicker">مجالات العمل</p>
          <h1 className="display">ثلاثة مجالات تحكم عملنا</h1>
          <p className="muted">
            الشباب · التعليم · تقوية روابط المجتمع — مع مقدمة رسمية لكل مجال تُضاف
            عند إطلاقها.
          </p>
        </div>
      </section>

      {data.map((d, i) => (
        <section key={d.area.id} className={`section area-strip${i % 2 ? ' area-strip--reverse' : ''}`}>
          <div className="container area-strip-grid">
            <div className="area-strip-text">
              <span className="area-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="h2">{d.area.name_ar}</h2>
              <p className="muted">{d.area.description_ar}</p>
              <div className="area-strip-meta">
                <span><strong className="num">{d.count}</strong> {arNoun(d.count, NOUN.project)}</span>
                <span><strong className="num">{d.beneficiaries > 0 ? d.beneficiaries : '—'}</strong> {arNoun(d.beneficiaries > 0 ? d.beneficiaries : 0, NOUN.beneficiary)}</span>
              </div>
              <p>
                <Link href="/projects" className="link-more">اطّلع على المشاريع ←</Link>
              </p>
            </div>
            <div className="area-strip-chart">
              {d.counts.length === 0 ? (
                <p className="muted">لا مشاريع منشورة في هذا المجال بعد.</p>
              ) : (
                <AreaChart counts={d.counts} color={d.color} />
              )}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}