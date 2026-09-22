import type { Metadata } from 'next';
import Link from 'next/link';
import { stateCodeToArabic } from '@/lib/geo';
import { getProjects, getStories } from '@/lib/data';
import SudanSilhouette from '@/app/components/sudan-silhouette';

export const metadata: Metadata = { title: 'من الميدان' };

export default async function FieldPage() {
  const [stories, projects] = await Promise.all([getStories(), getProjects()]);
  const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

  const gallery = stories.flatMap((s) => s.images.map((url, i) => ({ url, story: s, i })));

  return (
    <main className="page field-page">
      <section className="state-hero has-wm">
        <SudanSilhouette />
        <div className="container">
          <p className="kicker">من الميدان</p>
          <h1 className="display">قصص وتجارب من المجتمعات والمتطوعين</h1>
          <p className="muted">
            حين يتحول العمل من أرقام إلى وجوه وأسماء. نروي حكايات الناس كما
            يقولونها، لا كما نود أن تُروى عنهم — باحترام الخصوصية وبدون
            استغلال.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="kicker">حكايات موثقة</p>
            <h2 className="h2">القصص</h2>
            <p className="muted">
              كل قصة منشورة هنا حقيقية العدد والمكان والتاريخ، وتُنشر بموافقة
              أصحابها. تُحدَّث من لوحة التحكم عند توثيق تغطية جديدة.
            </p>
          </div>
          {stories.length === 0 ? (
            <p className="muted">لا قصص منشورة بعد — تُضاف عند توثيق التغطية الميدانية.</p>
          ) : (
            <div className="field-grid">
              {stories.map((s) => {
                const proj = s.project_slug ? projectBySlug.get(s.project_slug) : undefined;
                return (
                  <article key={s.id} className="story-feature field-card">
                    <div className="ph ph-story">
                      <span className="field-chip">{s.type === 'news' ? 'خبر' : s.type === 'update' ? 'تحديث' : 'قصة'}</span>
                    </div>
                    <div className="story-body">
                      <p className="project-meta">
                        {s.state_code ? stateCodeToArabic(s.state_code) : ''}{s.state_code ? ' · ' : ''}
                        <time dateTime={s.published_at || undefined}>{s.published_at ? new Date(s.published_at).toLocaleDateString('ar') : ''}</time>
                      </p>
                      <h3 className="h3">{s.title_ar}</h3>
                      <p className="muted">{s.body_ar}</p>
                      {proj && (
                        <Link href={`/projects/${encodeURIComponent(proj.slug)}`} className="link-more">
                          المشروع المرتبط: {proj.name_ar} ←
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num num">02</span>
            <div>
              <p className="kicker">معرض الصور</p>
              <h2 className="h2">من الميدان — صور</h2>
            </div>
            <span className="sec-en num">FIELD GALLERY</span>
          </div>
          <p className="muted" style={{ marginBottom: 'var(--space-4)' }}>
            صور موثّقة — كل صورة تحمل تعليقاً ومصدراً وتاريخاً، وتنشر بإذن أصحابها وباحترام كامل.
          </p>
          {gallery.length === 0 ? (
            <p className="muted">صور ميدانية موثّقة بهذا الشكل تُضاف لاحقاً، بتعليق ومصدر وتاريخ لكل صورة.</p>
          ) : (
            <div className="field-gallery">
              {gallery.map((g) => (
                <figure key={`${g.story.id}-${g.i}`}>
                  <img src={g.url} alt={g.story.title_ar} loading="lazy" />
                  <figcaption>
                    {stateCodeToArabic(g.story.state_code)} · {new Date(g.story.published_at).toLocaleDateString('ar')}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}