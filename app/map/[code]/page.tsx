import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { statesList, stateCodeToArabic } from '@/lib/geo';
import { getPresence, getProjects, getStates } from '@/lib/data';
import { AREA_SHORT, STATUS_LABELS } from '@/lib/site';
import SudanSilhouette from '@/app/components/sudan-silhouette';

export const dynamicParams = true;

interface StatePageProps {
  params: Promise<{ code: string }>;
}

export function generateStaticParams() {
  return statesList().map((s) => ({ code: s.code }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { code } = await params;
  const name = stateCodeToArabic(decodeURIComponent(code));
  return { title: name === 'غير محدد' ? 'أين نعمل' : name };
}

export default async function StatePage({ params }: StatePageProps) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw);

  const [states, projects, presence] = await Promise.all([
    getStates(),
    getProjects(),
    getPresence(),
  ]);

  const state = states.find((s) => s.code === code);
  if (!state) notFound();

  const stateProjects = projects.filter((p) => p.state_code === code);
  const beneficiaries = stateProjects.reduce((s, p) => s + (p.beneficiaries ?? 0), 0);
  const areas = Array.from(new Set(stateProjects.flatMap((p) => p.areas)));
  const pres = presence.find((p) => p.code === code);

  return (
    <main className="page state-page">
      <section className="state-hero has-wm">
        <SudanSilhouette className="sudan-wm--right" />
        <div className="container">
          <p className="kicker">أين نعمل · {state.name_en}</p>
          <h1 className="display">ولاية {state.name_ar}</h1>
          <p className="muted">
            نظرة عامة على عمل المنظمة في الولاية — يُستكمل بالوصف الرسمي الميداني
            عند توفره.
          </p>
        </div>
      </section>

      <section className="section state-body">
        <div className="container">
          <dl className="state-stats">
            <div>
              <dt>المشاريع</dt>
              <dd className="num">{stateProjects.length}</dd>
            </div>
            <div>
              <dt>المستفيدون</dt>
              <dd className="num">{beneficiaries > 0 ? beneficiaries.toLocaleString('en-US') : '—'}</dd>
            </div>
            <div>
              <dt>مجالات العمل</dt>
              <dd className="num">{areas.length}</dd>
            </div>
            <div>
              <dt>الحضور</dt>
              <dd>{pres?.office_kind ? 'مقر رئيسي' : 'موقع عمل'}</dd>
            </div>
          </dl>

          <h2 className="h2">المشاريع في الولاية</h2>
          {stateProjects.length === 0 ? (
            <p className="muted">لا مشاريع منشورة في هذه الولاية بعد.</p>
          ) : (
            <div className="state-projects">
              {stateProjects.map((p) => (
                <article key={p.id} className="project-mini">
                  <h3 className="h3">{p.name_ar}</h3>
                  <p className="project-meta">
                    {p.areas.map((a) => AREA_SHORT[a] ?? a).join(' · ')}
                    {p.locality ? ` · ${p.locality}` : ''} · {STATUS_LABELS[p.status]}
                  </p>
                  <p className="muted">{p.description_ar}</p>
                  <Link href={`/projects/${encodeURIComponent(p.slug)}`} className="link-more">
                    استكشف المشروع ←
                  </Link>
                </article>
              ))}
            </div>
          )}

          <h2 className="h2">الصور</h2>
          <p className="muted">صور ميدانية من الولاية تُضاف فور توثيقها.</p>

          <p className="state-back">
            <Link href="/map" className="btn btn-ghost btn-sm">
              عودة إلى خريطة السودان
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}