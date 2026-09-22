import type { Metadata } from 'next';
import { getOrganization, getProjects, getPresence } from '@/lib/data';
import SudanSilhouette from '@/app/components/sudan-silhouette';

export const metadata: Metadata = { title: 'من نحن' };

const VALUES = [
  { t: 'الإنسان', d: 'كل عملٍ يبدأ من كرامة الإنسان، ويُقاس بما يعود عليه مباشرة.' },
  { t: 'المجتمع', d: 'نعمل مع المجتمعات لا بالنيابة عنها، ونحترم أولوياتها وخبرتها.' },
  { t: 'المشاركة', d: 'المستفيد شريك في القرار، من التخطيط إلى التقييم.' },
  { t: 'المسؤولية', d: 'أموالُ الشركاء وأوقاتُ المتطوعين تُحاسَب عليها بالأثر.' },
  { t: 'الاستدامة', d: 'نتجنّب الحلول المؤقتة ونراهن على ما يدوم بعد انتهاء المشروع.' },
];
const APPROACH = [
  { num: '01', label: 'الاستجابة' },
  { num: '02', label: 'التعافي' },
  { num: '03', label: 'تمكين المجتمع' },
  { num: '04', label: 'التنمية المستدامة' },
];
const COMMITMENTS = [
  { t: 'الشفافية', d: 'التقارير والسياسات المالية منشورة للعموم في مركز الموارد، بلا انتقائية.' },
  { t: 'الحفاظ على الكرامة', d: 'لا صور استغلالية، ولا سردية ضعف؛ نروي قصة الناس كما يروونها عن أنفسهم.' },
  { t: 'المساءلة المجتمعية', d: 'مستفيدونا وآليات التغذية الراجعة جزءٌ من تقييم كل مشروع.' },
  { t: 'الحياد الإنساني', d: 'نصل إلى من يحتاج العمل أينما كان، غير منحازين لأي طرف.' },
];
const TIMELINE = [
  { color: 'var(--hasdo-blue)', label: 'التأسيس — بانتظار التوثيق', note: 'المقر: السودان' },
];

export default async function AboutPage() {
  const [org, projects, presence] = await Promise.all([
    getOrganization(),
    getProjects(),
    getPresence(),
  ]);

  const statesCount = new Set<string>();
  for (const p of projects) if (p.state_code) statesCount.add(p.state_code);
  for (const pr of presence) statesCount.add(pr.code);

  const volunteerCount = projects.reduce((s, p) => s + p.volunteers, 0);

  return (
    <main className="page about-page">
      <section className="state-hero has-wm">
        <SudanSilhouette />
        <div className="container">
          <p className="kicker">من نحن · {org.acronym}</p>
          <h1 className="display">{org.name_ar}</h1>
          <p className="muted">{org.description_ar}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div className="about-article">
            <p className="kicker">رؤيتنا</p>
            <h2 className="h2">الرؤية</h2>
            <p className="muted">
              {org.vision_ar || 'رؤية المنظمة تُضاف هنا فور اعتمادها رسمياً.'}
            </p>
            <p className="muted">
              مجتمعٌ سوداني يتماسك بروابطه، ويتعلم أبناؤه، ويقرر شبابه — رؤية تبدأ
              من الفرد ولا تكتمل إلا بالمجتمع كله.
            </p>

            <div className="about-block">
              <p className="kicker">رسالتنا</p>
              <h2 className="h2">الرسالة</h2>
              <p className="muted">
                {org.mission_ar || 'رسالة المنظمة تُضاف هنا فور اعتمادها رسمياً.'}
              </p>
              <p className="muted">
                ننفّذ عملنا مع المجتمعات المحلية، عبر برامج في التعليم وتمكين
                الشباب وتقوية التماسك الاجتماعي، بأسلوبٍ تشاركي يحترم خبرة الناس
                ويحاسب بالنتيجة.
              </p>
            </div>

            <div className="about-block">
              <p className="kicker">هويتنا البصرية</p>
              <h2 className="h2">شعار المنظمة</h2>
              <figure className="about-logo-figure">
                <img src="/img/logo-transparent.png" alt="شعار منظمة العمل الإنساني والتنمية المستدامة" className="about-logo" loading="lazy" />
                <figcaption className="muted">
                  الشعار الرسمي — نسخ عالية الدقة في مركز الموارد.
                </figcaption>
              </figure>
            </div>

            <div className="about-block">
              <p className="kicker">كيف نعمل</p>
              <h2 className="h2">من الاستجابة إلى التنمية المستدامة</h2>
              <ol className="approach">
                {APPROACH.map((s) => (
                  <li key={s.num}>
                    <span className="num area-num">{s.num}</span>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="about-block">
              <p className="kicker">ما نقف عليه</p>
              <h2 className="h2">التزاماتنا</h2>
              <ul className="commitments">
                {COMMITMENTS.map((c) => (
                  <li key={c.t}>
                    <strong>{c.t}</strong>
                    <span className="muted">{c.d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-block">
              <p className="kicker">قيمنا</p>
              <h2 className="h2">القيم</h2>
              <ul className="values">
                {VALUES.map((v) => <li key={v.t}>{v.t}</li>)}
              </ul>
              <dl className="values-list">
                {VALUES.map((v) => (
                  <div key={v.t}>
                    <dt>{v.t}</dt>
                    <dd className="muted">{v.d}</dd>
                  </div>
                ))}
              </dl>
              <p className="muted">توصيفات عامة — تُستكمل بالنص الرسمي عند إطلاقه.</p>
            </div>
          </div>

          <aside className="about-aside">
            <div className="about-stat">
              <span className="num display">{statesCount.size}</span>
              <span>ولاية نعمل فيها</span>
            </div>
            <div className="about-stat">
              <span className="num display">{projects.length}</span>
              <span>مشروعاً</span>
            </div>
            <div className="about-stat">
              <span className="num display">{volunteerCount > 0 ? volunteerCount : '—'}</span>
              <span>متطوعاً</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section timeline-sect">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num num">06</span>
            <div>
              <p className="kicker">المسار الزمني</p>
              <h2 className="h2">مراحل المنظمة</h2>
            </div>
            <span className="sec-en num">TIMELINE</span>
          </div>
          <div className="timeline">
            <ul className="timeline-events">
              {TIMELINE.map((t) => (
                <li key={t.label}>
                  <strong>{t.label}</strong>
                  <span>{t.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}