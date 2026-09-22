import Link from 'next/link';
import { getAreas, getOrganization, getPartners, getPresence, getProjects, getResources, getStats, getStories } from '@/lib/data';
import { isDbConfigured } from '@/lib/supabase/server';
import SetupNotice from '../../components/setup-notice';

export const metadata = { title: 'نظرة عامة | لوحة هسدو' };

export default async function OverviewPage() {
  const [projects, stories, resources, partners, stats, presence, areas] = await Promise.all([
    getProjects(),
    getStories(),
    getResources(),
    getPartners(),
    getStats(),
    getPresence(),
    getAreas(),
  ]);

  const configured = isDbConfigured();
  const active = projects.filter((p) => p.status === 'active').length;
  const completed = projects.filter((p) => p.status === 'completed').length;
  const planned = projects.filter((p) => p.status === 'planned').length;
  const hq = presence.find((p) => p.office_kind === 'country');
  const sites = presence.filter((p) => p.office_kind !== 'country').length;
  const beneficiaries = projects.reduce((n, p) => n + (p.beneficiaries ?? 0), 0);

  const kpis = [
    { label: 'إجمالي المشاريع', value: projects.length, href: '/admin/projects' },
    { label: 'نشط', value: active, tone: 'blue' as const },
    { label: 'منفذ', value: completed, tone: 'green' as const },
    { label: 'مُخطط', value: planned, tone: 'gray' as const },
    { label: 'المستفيدون (مجموعًا)', value: beneficiaries, tone: 'gold' as const },
    { label: 'القصص والأخبار', value: stories.length, href: '/admin/stories' },
    { label: 'الموارد', value: resources.length, href: '/admin/resources' },
    { label: 'الشركاء', value: partners.length, href: '/admin/partners' },
    { label: 'ولايات (مقر/مواقع)', value: presence.length, href: '/admin/settings' },
    { label: 'مجالات العمل', value: areas.length },
  ];

  return (
    <>
      <div className="admin-page-head">
        <h1 className="h2">نظرة عامة</h1>
      </div>

      {!configured && <SetupNotice />}

      <div className="admin-kpis">
        {kpis.map((k) => {
          const inner = (
            <>
              <span className={`admin-kpi-value${k.tone ? ` kpi-${k.tone}` : ''}`}>
                {new Intl.NumberFormat('ar-EG').format(k.value)}
              </span>
              <span className="admin-kpi-label">{k.label}</span>
            </>
          );
          return k.href ? (
            <Link key={k.label} href={k.href} className="admin-kpi card-link">
              {inner}
            </Link>
          ) : (
            <div key={k.label} className="admin-kpi">
              {inner}
            </div>
          );
        })}
      </div>

      {stats.length > 0 && (
        <div className="admin-table-wrap">
          <h2 className="h3 admin-group-title">المؤشرات الرئيسية</h2>
          <table className="admin-table">
            <tbody>
              {stats.map((s) => (
                <tr key={s.key}>
                  <td className="admin-row-title">{s.label_ar || s.key}</td>
                  <td className="admin-row-meta" dir="ltr">{s.value || s.value_num || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-meta-note">
        {hq ? `المقر الرئيسي: ${hq.code}${sites ? ` — مواقع عمل: ${sites}` : ' — لا مواقع عمل إضافية بعد'}` : 'لم يُعيّن المقر الرئيسي بعد.'}
        {' '}
        <Link href="/admin/settings">تعديل الإعدادات</Link>
      </div>
    </>
  );
}