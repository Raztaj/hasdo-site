'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Organization, SiteStat, State } from '@/lib/types';
import type { WriteResult } from '../actions';
import { saveSettings } from '../actions';

interface SettingsFormProps {
  org: Organization;
  states: State[];
  presence: Array<{ code: string; office_kind: string | null }>;
  stats: SiteStat[];
}

export default function SettingsForm({ org, states, presence, stats }: SettingsFormProps) {
  const router = useRouter();
  const hqCode = presence.find((p) => p.office_kind === 'country')?.code ?? 'SD01';
  const siteCodes = new Set(presence.filter((p) => p.office_kind !== 'country').map((p) => p.code));

  const [orgForm, setOrgForm] = useState<Record<string, string>>({
    name_ar: org.name_ar,
    name_en: org.name_en,
    acronym: org.acronym,
    description_ar: org.description_ar,
    mission_ar: org.mission_ar,
    vision_ar: org.vision_ar,
    logo_url: org.logo_url,
    email: org.email,
    phone: org.phone,
    address_ar: org.address_ar,
    social_links: (org.social_links ?? []).join('\n'),
  });
  const [hq, setHq] = useState(hqCode);
  const [sites, setSites] = useState<string[]>(siteCodes.size ? [...siteCodes] : []);
  const [statsForm, setStatsForm] = useState(
    stats.map((s) => ({ key: s.key, label_ar: s.label_ar, value_num: s.value_num })),
  );
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const toggleSite = (code: string) => {
    setSites((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    const orgPayload: Record<string, unknown> = { id: 1, ...orgForm };
    orgPayload.social_links = orgForm.social_links.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const res: WriteResult = await saveSettings({
      org: orgPayload,
      hq,
      sites,
      stats: statsForm.map((s) => ({ ...s, value_num: Number(s.value_num) || 0, value: '' })),
    });
    setBusy(false);
    if (res.ok) {
      setNotice({ type: 'ok', text: 'حُفظت الإعدادات.' });
      router.refresh();
    } else {
      setNotice({ type: 'error', text: res.error ?? 'تعذّر الحفظ.' });
    }
  };

  return (
    <form className="admin-form" onSubmit={submit}>
      {notice && <p className={`form-note ${notice.type === 'ok' ? 'admin-ok' : 'admin-error'}`}>{notice.text}</p>}

      <h3 className="h3 admin-group-title">المؤسسة</h3>
      <div className="admin-form-grid">
        {(['name_ar', 'name_en', 'acronym', 'logo_url', 'email', 'phone', 'address_ar'] as const).map((k) => (
          <label key={k}>
            <span>{k}</span>
            <input
              value={orgForm[k] ?? ''}
              onChange={(e) => setOrgForm((s) => ({ ...s, [k]: e.target.value }))}
            />
          </label>
        ))}
        {(['description_ar', 'mission_ar', 'vision_ar'] as const).map((k) => (
          <label key={k} className="admin-field--wide">
            <span>{k}</span>
            <textarea rows={3} value={orgForm[k] ?? ''} onChange={(e) => setOrgForm((s) => ({ ...s, [k]: e.target.value }))} />
          </label>
        ))}
        <label className="admin-field--wide">
          <span>social_links (سطر لكل رابط)</span>
          <textarea rows={3} value={orgForm.social_links} onChange={(e) => setOrgForm((s) => ({ ...s, social_links: e.target.value }))} />
        </label>
      </div>

      <h3 className="h3 admin-group-title">الحضور على الخريطة</h3>
      <p className="admin-hint">مقر رئيسي واحد (دائرة ● معبأة) + ولايات تُدار فيها مشاريع (○). يُشتق الباقي من سجل المشاريع.</p>
      <div className="admin-form-grid">
        <label>
          <span>المقر الرئيسي</span>
          <select value={hq} onChange={(e) => setHq(e.target.value)}>
            {states.map((s) => (
              <option key={s.code} value={s.code}>{s.name_ar}</option>
            ))}
          </select>
        </label>
        <label className="admin-field--wide">
          <span>مواقع العمل</span>
          <div className="admin-checkbox-grid">
            {states.map((s) => (
              <label key={s.code} className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={sites.includes(s.code)}
                  onChange={() => toggleSite(s.code)}
                  disabled={s.code === hq}
                />
                {s.name_ar}
              </label>
            ))}
          </div>
        </label>
      </div>

      <h3 className="h3 admin-group-title">المؤشرات</h3>
      <p className="admin-hint">قيم الرئيسية («أرقام حقيقية») — ضع 0 إذا لم تُحدد بعد.</p>
      <div className="admin-form-grid admin-stats-grid">
        {statsForm.map((s, i) => (
          <div key={s.key} className="admin-stats-row">
            <input
              placeholder="التسمية"
              value={s.label_ar}
              onChange={(e) => setStatsForm((prev) => prev.map((x, j) => (j === i ? { ...x, label_ar: e.target.value } : x)))}
            />
            <input
              type="number"
              placeholder="القيمة"
              value={s.value_num}
              onChange={(e) => setStatsForm((prev) => prev.map((x, j) => (j === i ? { ...x, value_num: Number(e.target.value) || 0 } : x)))}
            />
          </div>
        ))}
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '…' : 'حفظ الإعدادات'}</button>
      </div>
    </form>
  );
}