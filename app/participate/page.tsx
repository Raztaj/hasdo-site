import type { Metadata } from 'next';
import Link from 'next/link';
import { getOrganization } from '@/lib/data';
import ContactForm from '@/app/components/contact-form';
import SudanSilhouette from '@/app/components/sudan-silhouette';

export const metadata: Metadata = { title: 'شارك معنا' };

const PATHWAYS = [
  {
    num: '01',
    title: 'تطوع',
    desc: 'شارك في تنفيذ الأنشطة والمبادرات الميدانية، من التعليم إلى التوعية المجتمعية — كل مهارة تجد لها مكاناً.',
    points: ['فرص ميدانية في ولايات عملنا', 'التزام مرن يناسب وقتك', 'تدريب مسبق عند كل مهمة'],
    cta: 'تطوع معنا',
  },
  {
    num: '02',
    title: 'مهارات وخبرات',
    desc: 'خبرة مهنية في التعليم، التصميم، الاتصال، اللوجستيات وغيرها — نستفيد منها عند تثبيت الاحتياج، كمتطوع خبير.',
    points: ['مهام نوعية قصيرة وبعيدة', 'عمل يعتمد على إنجازك الفعلي', 'شبكة علاقات مع فريق ميداني'],
    cta: 'اعرض مهارتك',
  },
  {
    num: '03',
    title: 'شراكة',
    desc: 'مؤسسات وهيئات ترغب في التعاون مع المنظمة — لتمويل برنامج، أو عقد شراكة تنفيذية، أو دعم فني ولوجستي.',
    points: ['شراكة موثقة بعقد واضح', 'تقارير وأثر يحاسب عليه', 'حضور ميداني باسمك الحقيقي'],
    cta: 'ابدأ محادثة',
  },
];

const EXPECT = [
  { t: 'الجدية', d: 'كل متطوع وشريك يعرف دوره منذ البداية، ويُلتزم به كتابة.' },
  { t: 'الأثر أولاً', d: 'ما نعدك به يُنفَّذ ويُوثَّق، والنتيجة تُقاس لا تروى.' },
  { t: 'وقتك محترم', d: 'لا اجتماعات مهدرة، ولا التزامات شكلية بلا عمل حقيقي.' },
  { t: 'متابعة شفافة', d: 'تصلك تقارير منظمة عن أثر مشاركتك في كل برنامج شاركت فيه.' },
];

export default async function ParticipatePage() {
  const org = await getOrganization();

  return (
    <main className="page participate-page">
      <section className="state-hero has-wm">
        <SudanSilhouette />
        <div className="container">
          <p className="kicker">شارك معنا</p>
          <h1 className="display">وقتك، مهارتك، وخبرتك يمكن أن تكون جزءاً من العمل.</h1>
          <p className="muted">
            ثلاث طرق للمشاركة في عمل المنظمة — اختر ما يناسبك، وابدأ محادثة
            تُترجم خيرك إلى أثر.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="kicker">ثلاث طرق</p>
            <h2 className="h2">اختر طريق مشاركتك</h2>
            <p className="muted">كل طريق مبني على التزامٍ متبادل: نضبطه بالأثر، وتحاسبه على موعدك.</p>
          </div>
          <div className="pathways">
            {PATHWAYS.map((pw) => (
              <article key={pw.num} className="pathway">
                <span className="area-num">{pw.num}</span>
                <h2 className="h2">{pw.title}</h2>
                <p className="muted">{pw.desc}</p>
                <ul className="pathway-points">
                  {pw.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
                <Link href="#contact" className="btn btn-ghost btn-sm">{pw.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section expect-sect">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num num">02</span>
            <div>
              <p className="kicker">ماذا تتوقع منا؟</p>
              <h2 className="h2">التزام متبادل</h2>
            </div>
            <span className="sec-en num">MUTUAL COMMITMENT</span>
          </div>
          <ul className="expect-grid">
            {EXPECT.map((e, i) => (
              <li key={e.t}>
                <span className="num expect-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3">{e.t}</h3>
                <p className="muted">{e.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="section contact-sect">
        <div className="container contact-grid">
          <div className="contact-info">
            <p className="kicker">تواصل معنا</p>
            <h2 className="h2">ابدأ الرسالة — وسندّ العدّاد.</h2>
            <p className="muted">
              اكتب بضع كلمات عنك وعن ماذا تريد أن تقدم. فريقنا يقرأ كل رسالة
              ويرد خلال أيام عمل معدودة، ويكمل معك الخطوات التالية.
            </p>
            <address className="footer-contact">
              {org.address_ar && <span><strong>المقر:</strong> {org.address_ar}</span>}
              {org.email && <span><strong>البريد:</strong> {org.email}</span>}
              {org.phone && <span><strong>الهاتف:</strong> {org.phone}</span>}
            </address>
          </div>
          <ContactForm email={org.email} />
        </div>
      </section>
    </main>
  );
}