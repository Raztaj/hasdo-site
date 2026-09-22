import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { stateCodeToArabic } from '@/lib/geo';
import { getProjectBySlug, getProjects } from '@/lib/data';
import { AREA_SHORT, STATUS_LABELS } from '@/lib/site';
import SudanSilhouette from '@/app/components/sudan-silhouette';

export const dynamicParams = true;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(decodeURIComponent(slug));
  return { title: project?.name_ar ?? 'مشروع' };
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="project-stat">
      <dt>{label}</dt>
      <dd className="num">{value}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(decodeURIComponent(slug));
  if (!project) notFound();

  const [all] = await Promise.all([getProjects()]);
  const related = all
    .filter(
      (p) =>
        p.id !== project.id &&
        (p.areas.some((a) => project.areas.includes(a)) ||
          (p.state_code && p.state_code === project.state_code)),
    )
    .slice(0, 2);

  const start = project.start_date
    ? new Date(project.start_date).toLocaleDateString('ar')
    : null;
  const end = project.end_date ? new Date(project.end_date).toLocaleDateString('ar') : null;

  return (
    <main className="page project-page">
      <section className="project-hero has-wm">
        <SudanSilhouette />
        <div className="container">
          <p className="kicker">
            {project.areas.map((a) => AREA_SHORT[a] ?? a).join(' · ')}
          </p>
          <h1 className="display">{project.name_ar}</h1>
          <p className="project-meta">
            {stateCodeToArabic(project.state_code)}
            {project.locality && ` · ${project.locality}`}
            {(start || end) && (
              <> · {start ? `${start}${end ? ` — ${end}` : ''}` : end}</>
            )}
            {' · '}
            <span className={`chip chip-status status-${project.status}`}>
              {STATUS_LABELS[project.status]}
            </span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container project-layout">
          <div className="project-article">
            <h2 className="h2">عن المشروع</h2>
            <p className="muted">{project.description_ar}</p>

            {project.objective_ar && (
              <>
                <h2 className="h2">الهدف</h2>
                <p className="muted">{project.objective_ar}</p>
              </>
            )}

            {project.challenge_ar && (
              <>
                <h2 className="h2">التحدي</h2>
                <p className="muted">{project.challenge_ar}</p>
              </>
            )}

            {project.activities_ar && (
              <>
                <h2 className="h2">ماذا فعلت المنظمة؟</h2>
                <p className="muted">{project.activities_ar}</p>
              </>
            )}

            {project.results_ar && (
              <>
                <h2 className="h2">النتائج</h2>
                <p className="muted">{project.results_ar}</p>
              </>
            )}

            {project.impact_ar && (
              <>
                <h2 className="h2">الأثر</h2>
                <p className="muted">{project.impact_ar}</p>
              </>
            )}

            {project.documents.length > 0 && (
              <>
                <h2 className="h2">المستندات</h2>
                <ul className="doc-list">
                  {project.documents.map((d, i) => (
                    <li key={`${d.url}-${i}`}>
                      <a href={d.url} className="link-more" target="_blank" rel="noreferrer">
                        {d.label_ar} ←
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="project-side">
            <dl className="project-stats">
              <Stat label="المستفيدون" value={project.beneficiaries > 0 ? project.beneficiaries.toLocaleString('en-US') : '—'} />
              <Stat label="مجتمعات" value={project.communities > 0 ? project.communities.toLocaleString('en-US') : '—'} />
              <Stat label="مدارس" value={project.schools > 0 ? project.schools.toLocaleString('en-US') : '—'} />
              <Stat label="متطوعون" value={project.volunteers > 0 ? project.volunteers.toLocaleString('en-US') : '—'} />
            </dl>
            <p>
              <Link href="/projects" className="btn btn-ghost btn-sm">كل المشاريع</Link>
            </p>
          </aside>
        </div>
      </section>

      {project.gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="h2">من الميدان</h2>
            <div className="field-gallery">
              {project.gallery.map((url, i) => (
                <figure key={`${url}-${i}`}>
                  <img src={url} alt={`مشروع ${project.name_ar}`} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="h2">مشاريع ذات صلة</h2>
            <div className="state-projects">
              {related.map((p) => (
                <Link key={p.id} href={`/projects/${encodeURIComponent(p.slug)}`} className="project-mini">
                  <h3 className="h3">{p.name_ar}</h3>
                  <p className="project-meta">
                    {p.areas.map((a) => AREA_SHORT[a] ?? a).join(' · ')} · {STATUS_LABELS[p.status]}
                  </p>
                  <p className="muted">{p.description_ar}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}