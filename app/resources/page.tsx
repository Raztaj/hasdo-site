import type { Metadata } from 'next';
import { getProjects, getResources, getStories } from '@/lib/data';
import { stateCodeToArabic } from '@/lib/geo';
import SudanSilhouette from '@/app/components/sudan-silhouette';

export const metadata: Metadata = { title: 'الموارد' };

const CATEGORIES: Record<string, string> = {
  reports: 'التقارير',
  policies: 'السياسات',
  documents: 'المستندات',
};

const MEDIA_KIT = [
  { name: 'الشعار الأساسي (شفاف)', file: '/img/logo-transparent.png' },
  { name: 'الشعار الأساسي', file: '/img/logo.png' },
  { name: 'الشعار متعدد الألوان', file: '/img/logo-multicolor.png' },
  { name: 'الشعار بالأبيض', file: '/img/logo--white.png' },
  { name: 'الشعار بصيغة SVG', file: '/img/logo.svg' },
  { name: 'الشارة', file: '/img/logo-emblem.png' },
];

function fmtSize(bytes: number) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function ResourcesPage() {
  const [resources, stories, projects] = await Promise.all([
    getResources(),
    getStories(),
    getProjects(),
  ]);

  const news = stories.filter((s) => s.type !== 'story');
  const byState = new Map(projects.map((p) => [p.slug, stateCodeToArabic(p.state_code)]));

  return (
    <main className="page resources-page">
      <section className="state-hero has-wm">
        <SudanSilhouette />
        <div className="container">
          <p className="kicker">الموارد</p>
          <h1 className="display">مركز الموارد</h1>
          <p className="muted">التقارير، السياسات، الملفات الرسمية، وأخبار المنظمة.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="kicker">نافذة الحساب</p>
            <h2 className="h2">الشفافية سياستنا، لا شعارنا</h2>
            <p className="muted">
              كل مستند هنا يعبّر عن طريقة عملنا: تقارير تُحاسَب بالأرقام،
              وسياسات تُفصَّل قبل أن تبدأ الممارسة. إن لم تجد مستنداً بعد، فهو
              قيد التوثيق من لوحة التحكم — لأن النشر عندنا مصحوبٌ بالمسؤولية.
            </p>
          </div>
          <div className="section-head">
            <p className="kicker">المستندات</p>
            <h2 className="h2">التقارير والسياسات</h2>
          </div>
          {resources.length === 0 ? (
            <p className="muted">لا مستندات منشورة بعد — تُرفع من لوحة التحكم عند جاهزيتها.</p>
          ) : (
            <div className="resources-list">
              {resources.map((r) => (
                <article key={r.id} className="resource-item">
                  <span className="chip chip-area">{CATEGORIES[r.category] ?? r.category}</span>
                  <h3 className="h3">{r.title_ar}</h3>
                  {r.description_ar && <p className="muted">{r.description_ar}</p>}
                  <p className="project-meta">
                    {new Date(r.published_at).toLocaleDateString('ar')}
                    {fmtSize(r.file_size) ? ` · ${fmtSize(r.file_size)}` : ''}
                  </p>
                  {r.file_url && (
                    <a href={r.file_url} className="link-more" target="_blank" rel="noreferrer">تحميل الملف ←</a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section news-sect">
        <div className="container">
          <div className="section-head">
            <p className="kicker">حضورنا الميداني</p>
            <h2 className="h2">الأخبار والتحديثات</h2>
            <p className="muted">
              تحديثات من الميدان تنشر كما وقعت: بعناوين صريحة، وتواريخ ثابتة،
              دون تهويل أو تضخيم. الأخبار تُغذى من لوحة التحكم فور اعتمادها.
            </p>
          </div>
          {news.length === 0 ? (
            <p className="muted">لا أخبار أو تحديثات بعد.</p>
          ) : (
            <div className="resources-list">
              {news.map((n) => (
                <article key={n.id} className="resource-item">
                  <span className="chip chip-area">{n.type === 'news' ? 'خبر' : 'تحديث'}</span>
                  <h3 className="h3">{n.title_ar}</h3>
                  <p className="muted">{n.body_ar}</p>
                  <p className="project-meta">
                    {n.state_code ? byState.get(n.project_slug ?? '') ?? stateCodeToArabic(n.state_code) : ''}
                    {n.published_at ? ` · ${new Date(n.published_at).toLocaleDateString('ar')}` : ''}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="kicker">Media kit</p>
            <h2 className="h2">أصول العلامة</h2>
            <p className="muted">
              أصول هوية المنظمة لوسائل الإعلام والشركاء. نرجو الالتزام بالنسخة
              الرسمية من الشعار وعدم تعديل ألوانه أو أبعاده.
            </p>
          </div>
          <div className="media-grid">
            {MEDIA_KIT.map((m) => (
              <a key={m.file} href={m.file} className="media-item" download>
                <span className="media-thumb">
                  <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                </span>
                <span>{m.name}</span>
                <span className="link-more">تحميل ←</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}