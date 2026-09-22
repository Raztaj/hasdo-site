import Link from 'next/link';
import { AREA_SHORT } from '@/lib/site';
import { MAP_LOCALITIES, MAP_STATES } from '@/lib/mapdata';
import { stateCodeToArabic } from '@/lib/geo';
import { getAreas, getOrganization, getPartners, getPresence, getProjects, getStories } from '@/lib/data';
import HeroMap from './components/hero-map';
import Counter from './components/counter';
import ProjectIndex from './components/project-index';
import SudanSilhouette from './components/sudan-silhouette';

function Today() {
  return <time className="num">{new Date().toLocaleDateString('en-GB')}</time>;
}

export default async function HomePage() {
  const [projects, stories, areas, presence, org] = await Promise.all([
    getProjects(),
    getStories(),
    getAreas(),
    getPresence(),
    getOrganization(),
  ]);
  const partners = await getPartners();

  const activeStates = new Set<string>();
  for (const p of projects) if (p.state_code) activeStates.add(p.state_code);
  for (const pr of presence) activeStates.add(pr.code);

  const completed = projects.filter((p) => p.status === 'completed').length;
  const beneficiaries = projects.reduce((s, p) => s + (p.beneficiaries ?? 0), 0);
  const volunteers = projects.reduce((s, p) => s + p.volunteers, 0);

  const bigStory = stories[0];
  const smallStories = stories.slice(1, 3);

  const secN = (n: number) => <span className="sec-num num">{String(n).padStart(2, '0')}</span>;

  return (
    <div className="home">
      {/* ---------------------------------------------------------- HERO */}
      <section className="hero has-wm">
        <SudanSilhouette className="sudan-wm--right" />
        <div className="container hero-flyout">
          <span className="num">HASDO — SUDAN</span>
          <span><Today /></span>
          <span className="hero-ref num">01</span>
        </div>

        <div className="container hero-grid">
          <aside className="hero-rail" aria-hidden="true">
            <span className="vertical-label">حضور إنساني — حضور كامل</span>
          </aside>

          <div className="hero-main">
            <h1 className="display">العمل الإنساني<br />يبدأ من الإنسان.</h1>
            <p className="hero-support">
              منظمة إنسانيّة سودانيّة تعمل مع المجتمعات — معاً لا بالنيابة عنهم — في
              التعليم، وتمكين الشباب، وتقوية الروابط المجتمعية، من الخرطوم إلى أبعد
              ولايات السودان. حضورنا ميدانيٌّ، وأسلوبنا شراكة، وكل ما ننشره موثّق.
            </p>
            <div className="hero-actions">
              <Link href="/map" className="btn btn-primary btn-lg">استكشف خريطة السودان</Link>
              <Link href="/projects" className="btn btn-ghost btn-lg">اكتشف أعمالنا</Link>
            </div>
            <p className="hero-trust">
              <strong className="num">{activeStates.size}</strong> ولاية نعمل فيها
              {' · '}<strong className="num">{projects.length}</strong> {projects.length === 1 ? 'مشروع' : 'مشروعاً'}
            </p>
          </div>

          <div className="hero-figure">
            <HeroMap projects={projects} presence={presence} states={MAP_STATES} localities={MAP_LOCALITIES} />
          </div>
        </div>

        <div className="container hero-foot">
          <span className="scroll-tag">↓ SCROLL</span>
          <Link href="/map" className="link-more">استكشف أعمال HASDO ←</Link>
        </div>
      </section>

      {/* ------------------------------------------------------ WHO WE ARE */}
      <section className="section who has-wm band-blue">
        <SudanSilhouette />
        <div className="container who-grid">
          <div className="who-copy">
            <div className="sec-head">
              {secN(1)}
              <div>
                <p className="kicker">من نحن</p>
                <h2 className="h2">{org.description_ar}</h2>
              </div>
              <span className="sec-en num">WHO WE ARE</span>
            </div>
            {org.mission_ar ? (
              <p className="muted">{org.mission_ar}</p>
            ) : (
              <p className="muted">نبذة تعريفية رسمية قيد الاعتماد. بيانات المنظمة تُضاف من لوحة التحكم.</p>
            )}
            <p style={{ marginTop: 'var(--space-3)' }}>
              <Link href="/about" className="link-more">اقرأ المزيد عن المنظمة ←</Link>
            </p>
          </div>
          <div className="who-num">
            <strong className="num display">{activeStates.size}</strong>
            <span>ولاية نعمل فيها</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- WHERE WE MAP */}
      <section className="section map-sect">
        <div className="container">
          <div className="sec-head">
            {secN(2)}
            <div>
              <p className="kicker">أين نعمل</p>
              <h2 className="h2">حضورنا مكانٌ، ومكانٌ يعني التزاماً.</h2>
            </div>
            <span className="sec-en num">SUDAN PRESENCE</span>
          </div>
        </div>

        <div className="map-sect-stage">
          <div className="container map-sect-grid">
            <div className="map-sect-copy">
              <p className="muted">
                نعمل في {activeStates.size} ولاية، من المقر الرئيسي في الخرطوم إلى
                مواقع العمل في الميدان. المشاريع تُنفّذ مع المجتمعات نفسها.
              </p>
              <p style={{ marginTop: 'var(--space-3)' }}>
                <Link href="/map" className="link-more">فتح الخريطة كاملة ←</Link>
              </p>
            </div>
            <HeroMap projects={projects} presence={presence} states={MAP_STATES} localities={MAP_LOCALITIES} />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- AREAS */}
      <section className="section areas has-wm band-blue">
        <SudanSilhouette className="sudan-wm--right" />
        <div className="container">
          <div className="sec-head">
            {secN(3)}
            <div>
              <p className="kicker">مجالات العمل</p>
              <h2 className="h2">ثلاثة مجالات تحكم عملنا</h2>
            </div>
            <span className="sec-en num">AREAS OF WORK</span>
          </div>
          <ol className="areas-list">
            {areas.map((a, i) => (
              <li key={a.id} className="area-row">
                <span className="area-num num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="area-body">
                  <h3 className="area-title">{a.name_ar}</h3>
                  <p className="area-desc">{a.description_ar}</p>
                </div>
                <span className="chip chip-area">{AREA_SHORT[a.name_ar] ?? a.name_ar}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------ PROJECTS */}
      <section className="section projects has-wm band-white">
        <SudanSilhouette />
        <div className="container">
          <div className="sec-head">
            {secN(4)}
            <div>
              <p className="kicker">المشاريع</p>
              <h2 className="h2">مشاريعنا فهرسُ أثرٍ، لا مجرد قائمة</h2>
            </div>
            <span className="sec-en num">PROJECT INDEX</span>
          </div>

          <ProjectIndex projects={projects} count={4} />

          <p style={{ marginTop: 'var(--space-3)' }}>
            <Link href="/projects" className="link-more">كل المشاريع ←</Link>
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- IMPACT */}
      <section className="section impact has-wm band-blue">
        <SudanSilhouette className="sudan-wm--right" />
        <div className="container">
          <div className="sec-head">
            {secN(5)}
            <div>
              <p className="kicker">الأثر</p>
              <h2 className="h2">ماذا تغيّر نتيجة العمل؟</h2>
            </div>
            <span className="sec-en num">THE IMPACT</span>
          </div>

          <div className="impact-grid">
            <div className="impact-stats">
              <div className="impact-stat">
                <span className="impact-num"><Counter value={activeStates.size} /></span>
                <span className="impact-label">ولاية نعمل فيها</span>
              </div>
              <div className="impact-stat">
                <span className="impact-num"><Counter value={projects.length} /></span>
                <span className="impact-label">{projects.length === 1 ? 'مشروع' : 'مشروعاً'}</span>
              </div>
              <div className="impact-stat">
                <span className="impact-num">{beneficiaries > 0 ? <Counter value={beneficiaries} /> : '—'}</span>
                <span className="impact-label">مستفيداً من المشاريع المنجزة</span>
              </div>
            </div>

            <div>
              <p className="muted">
                {completed > 0
                  ? (<>منها {completed} مشروعاً منجزاً، وعبر {volunteers > 0 ? `${volunteers} متطوعاً` : 'فرق عمل محلية'}.</>)
                  : (<>تعمل المنظمة حالياً في {activeStates.size} ولاية، والأرقام تُضاف بمجرد توثيقها.</>)}
              </p>
              <ul className="area-impact">
                {areas.map((a, i) => {
                  const n = projects.filter((p) => p.areas.includes(a.name_ar)).length;
                  return (
                    <li key={a.id} className="area-impact-row">
                      <span className="area-num num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <span>{a.name_ar}</span>
                      <span className="num">{n} {n === 1 ? 'مشروع' : 'مشاريع'}</span>
                    </li>
                  );
                })}
              </ul>
              <p style={{ marginTop: 'var(--space-3)' }}>
                <Link href="/impact" className="link-more">صفحة الأثر الكاملة ←</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- FIELD STORIES */}
      {bigStory && (
        <section className="section stories-sect has-wm band-white">
          <SudanSilhouette />
          <div className="container">
            <div className="sec-head">
              {secN(6)}
              <div>
                <p className="kicker">من الميدان</p>
                <h2 className="h2">قصص وتجارب</h2>
              </div>
              <span className="sec-en num">FIELD NOTES</span>
            </div>
            <div className="story-grid">
              <article className="story-feature">
                <div className="ph ph-story" />
                <div className="story-body">
                  <p className="project-meta">
                    {bigStory.state_code ? stateCodeToArabic(bigStory.state_code) : ''}{bigStory.state_code ? ' · ' : ''}
                    <time dateTime={bigStory.published_at}>{new Date(bigStory.published_at).toLocaleDateString('ar')}</time>
                  </p>
                  <h3 className="h3">{bigStory.title_ar}</h3>
                  <p className="muted">{bigStory.body_ar}</p>
                  <p style={{ marginTop: 'var(--space-2)' }}>
                    <Link href="/field" className="link-more">من الميدان ←</Link>
                  </p>
                </div>
              </article>
              <div className="story-side">
                {smallStories.map((s) => (
                  <article key={s.id} className="story-mini">
                    <h3 className="h3">{s.title_ar}</h3>
                    <p className="project-meta">
                      {s.state_code ? stateCodeToArabic(s.state_code) : ''}{s.state_code ? ' · ' : ''}
                      <time dateTime={s.published_at}>{new Date(s.published_at).toLocaleDateString('ar')}</time>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- PARTNERS */}
      <section className="section partners has-wm band-blue">
        <SudanSilhouette className="sudan-wm--right" />
        <div className="container">
          <div className="sec-head">
            {secN(7)}
            <div>
              <p className="kicker">الشركاء</p>
              <h2 className="h2">شراكات تشاركنا الهدف</h2>
            </div>
            <span className="sec-en num">PARTNERS</span>
          </div>
          <div className="cta-row">
            <p className="muted">
              نعمل مع منظمات وهيئات تشاركنا الهدف، وكل شراكة تُوثّق رسمياً قبل
              نشر اسمها. قائمة الشركاء تُحدَّث من لوحة التحكم — لأن الشراكة عندنا
              التزامٌ مكتوب، لا مجرد اسم.
            </p>
            <Link href="/participate#contact" className="btn btn-ghost btn-lg">اعرض الشراكة</Link>
          </div>
          {partners.length > 0 && (
            <div className="partners-band">
              {partners.map((p) => (
                <span key={p.id} className="partner-name">{p.name_ar}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------- DONORS */}
      <section className="section donors has-wm band-white">
        <SudanSilhouette />
        <div className="container">
          <div className="sec-head">
            {secN(8)}
            <div>
              <p className="kicker">المانحون</p>
              <h2 className="h2">أثرك يتضاعف بالشفافية</h2>
            </div>
            <span className="sec-en num">DONORS</span>
          </div>
          <div className="cta-row">
            <p className="muted">
              كل دعم يُوظَّف لمصلحة المستفيد، ويُحاسَب عليه بالأثر لا بالوعد.
              سياساتنا المالية منشورة في مركز الموارد، وقوائم المانحين تنشر
              بتقديرٍ ومصداقية.
            </p>
            <Link href="/participate#contact" className="btn btn-primary btn-lg">ادعم العمل</Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- OUR APPROACH */}
      <section className="section approach-sect has-wm band-blue">
        <SudanSilhouette className="sudan-wm--right" />
        <div className="container">
          <div className="sec-head">
            {secN(9)}
            <div>
              <p className="kicker">منهجنا</p>
              <h2 className="h2">لا نأتي لنفرض، بل لنشارك</h2>
            </div>
            <span className="sec-en num">OUR APPROACH</span>
          </div>
          <ol className="approach-pillars">
            <li>
              <span className="num approach-pillar-num">01</span>
              <h3 className="h3">استجابة قائمة على الحاجة</h3>
              <p className="muted">
                كل نشاط يبدأ بالاستماع للمجتمع أولاً، ثم بالتصميم والتنفيذ
                والمراجعة معه، لا له.
              </p>
            </li>
            <li>
              <span className="num approach-pillar-num">02</span>
              <h3 className="h3">التعليم بوابة التغيير</h3>
              <p className="muted">
                استثمارك في التعليم ليس منفعة عابرة؛ إنه الطريق الأطول أثراً نحو
                مجتمع قادرٍ على القرار.
              </p>
            </li>
            <li>
              <span className="num approach-pillar-num">03</span>
              <h3 className="h3">تمكين الشباب</h3>
              <p className="muted">
                نمنح الشباب أدواتٍ لا عوناً مؤقتاً: تدريباً، منصات، وشبكات
                علاقات، ليبنوا لأنفسهم.
              </p>
            </li>
            <li>
              <span className="num approach-pillar-num">04</span>
              <h3 className="h3">تماسك المجتمع أولاً</h3>
              <p className="muted">
                كل مشروعٍ يقيس نجاحه بقدرته على تقوية الروابط بين الناس، لا على
                عدد الأنشطة فقط.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------- CTA / VOLUNTEER */}
      <section className="cta-band has-wm">
        <SudanSilhouette className="sudan-wm--white sudan-wm--right" />
        <div className="container cta-inner">
          <div>
            <p className="kicker" style={{ color: 'var(--hasdo-blue-light)' }}>شارك في العمل</p>
            <h2 className="h2">وقتك، مهارتك، وخبرتك يمكن أن تكون جزءاً من العمل.</h2>
            <p>تطوع · مهارات وخبرات · شراكة — ثلاث طرق للمشاركة.</p>
          </div>
          <Link href="/participate" className="btn btn-light btn-lg">تطوع معنا</Link>
        </div>
      </section>

      {/* ---------------------------------------------------- TRANSPARENCY */}
      <section className="section transparency has-wm">
        <SudanSilhouette className="sudan-wm--small" />
        <div className="container transparency-row">
          <p className="kicker">الشفافية</p>
          <ul>
            <li><Link href="/resources" className="btn btn-ghost btn-sm">التقارير</Link></li>
            <li><Link href="/resources" className="btn btn-ghost btn-sm">السياسات</Link></li>
            <li><Link href="/resources" className="btn btn-ghost btn-sm">المساءلة المجتمعية</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}