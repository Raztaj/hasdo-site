'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Project, StatePresence } from '@/lib/types';
import type { MapRegion } from '@/lib/mapdata';
import SudanMap from './sudan-map';

type Metric = 'projects' | 'beneficiaries' | 'communities';

const METRICS: Array<{ key: Metric; label: string }> = [
  { key: 'projects', label: 'المشاريع' },
  { key: 'beneficiaries', label: 'المستفيدين' },
  { key: 'communities', label: 'المجتمعات' },
];

interface ImpactMapProps {
  projects: Project[];
  presence: StatePresence[];
  states: MapRegion[];
  localities: MapRegion[];
}

/** خريطة الأثر: تسليط الضوء على الولايات حسب المقياس المختار. */
export default function ImpactMap({ projects, presence, states, localities }: ImpactMapProps) {
  const [metric, setMetric] = useState<Metric>('projects');

  const officeKinds = useMemo(() => {
    const map: Record<string, string> = {};
    for (const pr of presence) if (pr.office_kind) map[pr.code] = pr.office_kind;
    return map;
  }, [presence]);

  const activeCodes = useMemo(() => {
    const set: Record<string, true> = {};
    for (const p of projects) {
      if (!p.state_code) continue;
      if ((metric === 'projects') ||
          (metric === 'beneficiaries' && p.beneficiaries > 0) ||
          (metric === 'communities' && p.communities > 0)) {
        set[p.state_code] = true;
      }
    }
    for (const pr of presence) if (pr.office_kind) set[pr.code] = true;
    return set;
  }, [projects, presence, metric]);

  return (
    <div className="impact-map">
      <div className="impact-map-stage">
        <SudanMap
          states={states}
          localities={localities}
          activeCodes={activeCodes}
          officeKinds={officeKinds}
          onSelectState={(code) => { window.location.href = `/map/${encodeURIComponent(code)}`; }}
        />
      </div>
      <div className="impact-map-switch" role="radiogroup" aria-label="عرض حسب">
        <span className="impact-map-switch-label">عرض حسب:</span>
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            role="radio"
            aria-checked={metric === m.key}
            className={metric === m.key ? 'is-on' : undefined}
            onClick={() => setMetric(m.key)}
          >
            <i className={`dot-legend ${metric === m.key ? 'dot--office' : 'dot--site'}`} />
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}