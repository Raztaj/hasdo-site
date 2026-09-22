'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Project, StatePresence } from '@/lib/types';
import { AREA_SHORT, STATUS_LABELS } from '@/lib/site';
import { KHARTOUM_CODE } from '@/lib/geo';
import type { MapRegion } from '@/lib/mapdata';
import SudanMap from './sudan-map';

type Selection = { kind: 'state' | 'locality'; code: string } | null;
type ProjectView = string | null;

interface MapExplorerProps {
  projects: Project[];
  presence: StatePresence[];
  states: MapRegion[];
  localities: MapRegion[];
}

export default function MapExplorer({
  projects,
  presence,
  states,
  localities,
}: MapExplorerProps) {
  const [selection, setSelection] = useState<Selection>(null);
  const [projectView, setProjectView] = useState<ProjectView>(null);

  const activeCodes = useMemo(() => {
    const set: Record<string, true> = {};
    for (const p of projects) {
      if (p.state_code) set[p.state_code] = true;
      if (p.locality) set[p.locality] = true;
    }
    for (const pr of presence) set[pr.code] = true;
    return set;
  }, [projects, presence]);

  const officeKinds = useMemo(() => {
    const map: Record<string, string> = {};
    for (const pr of presence) if (pr.office_kind) map[pr.code] = pr.office_kind;
    return map;
  }, [presence]);

  const projectsByState = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const p of projects) {
      if (!p.state_code) continue;
      const list = map.get(p.state_code) ?? [];
      list.push(p);
      map.set(p.state_code, list);
    }
    return map;
  }, [projects]);

  const projectsByLocality = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const p of projects) {
      if (!p.locality) continue;
      const list = map.get(p.locality) ?? [];
      list.push(p);
      map.set(p.locality, list);
    }
    return map;
  }, [projects]);

  const showLocalities =
    (selection?.kind === 'state' && selection.code === KHARTOUM_CODE) ||
    selection?.kind === 'locality';

  const list = showLocalities ? localities : states;

  const current = selection
    ? showLocalities && selection.kind === 'state'
      ? states.find((s) => s.code === selection.code) ?? null
      : list.find((s) => s.code === selection.code) ?? null
    : null;

  const currentProjects = selection
    ? (selection.kind === 'locality'
        ? projectsByLocality.get(selection.code)
        : projectsByState.get(selection.code)) ?? []
    : [];

  const areasHere = useMemo(
    () => Array.from(new Set(currentProjects.flatMap((p) => p.areas))),
    [currentProjects],
  );
  const beneficiariesHere = currentProjects.reduce((s, p) => s + (p.beneficiaries ?? 0), 0);

  const visibleProject = projectView
    ? currentProjects.find((p) => p.slug === projectView) ?? null
    : null;

  const selectCode = (code: string, kind: 'state' | 'locality') => {
    setSelection({ kind, code });
    setProjectView(null);
  };

  const closePanel = () => {
    setSelection(null);
    setProjectView(null);
  };

  const backToStates = () => {
    setSelection(null);
    setProjectView(null);
  };

  return (
    <div className="explorer">
      <div className="explorer-list" aria-label="قائمة الولايات">
        <p className="kicker">ولايات السودان</p>
        <ul>
          {states.map((s) => {
            const n = (projectsByState.get(s.code) ?? []).length;
            const active = activeCodes[s.code] === true;
            const selected = selection?.code === s.code && !showLocalities;
            return (
              <li key={s.code}>
                <button
                  type="button"
                  className={`state-row${active ? ' has-presence' : ''}${selected ? ' is-selected' : ''}`}
                  onClick={() => selectCode(s.code, 'state')}
                >
                  <i className={officeKinds[s.code] ? 'dot-legend dot--office' : active ? 'dot-legend dot--site' : 'dot-legend dot--none'} aria-hidden="true" />
                  <span>{s.name_ar}</span>
                  <span className="num">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="explorer-stage">
        <SudanMap
          states={states}
          localities={localities}
          activeCodes={activeCodes}
          officeKinds={officeKinds}
          selectedState={selection?.kind === 'state' ? selection.code : undefined}
          selectedLocality={selection?.kind === 'locality' ? selection.code : undefined}
          onSelectState={(code) => selectCode(code, 'state')}
          onSelectLocality={(code) => selectCode(code, 'locality')}
        />

        {showLocalities && (
          <button type="button" className="map-back" onClick={backToStates}>
            عودة إلى الولايات ←
          </button>
        )}

        {selection && (
          <aside className="map-panel" aria-label="تفاصيل المنطقة" role="dialog">
            <div className="map-panel__head">
              <div>
                <p className="kicker">{selection?.kind === 'locality' ? 'محلية' : 'ولاية'}</p>
                <h2 className="h2">{current?.name_ar ?? ''}</h2>
              </div>
              <button type="button" className="icon-btn" onClick={showLocalities ? backToStates : closePanel} aria-label="إغلاق اللوحة">
                ✕
              </button>
            </div>

            {visibleProject ? (
              <div className="map-panel__project">
                <p className="project-meta">
                  {visibleProject.areas.map((a) => AREA_SHORT[a] ?? a).join(' · ')} · {STATUS_LABELS[visibleProject.status]}
                </p>
                <h3 className="h3">{visibleProject.name_ar}</h3>
                <p className="muted">{visibleProject.description_ar}</p>
                <Link href={`/projects/${encodeURIComponent(visibleProject.slug)}`} className="link-more">
                  استكشف المشروع كاملاً ←
                </Link>
                <button type="button" className="btn btn-ghost btn-sm map-panel__back" onClick={() => setProjectView(null)}>
                  عودة للمشاريع
                </button>
              </div>
            ) : (
              <>
                <dl className="map-panel__stats">
                  <div><dt>المشاريع</dt><dd className="num">{currentProjects.length}</dd></div>
                  <div><dt>المستفيدون</dt><dd className="num">{beneficiariesHere > 0 ? beneficiariesHere.toLocaleString('en-US') : '—'}</dd></div>
                  <div><dt>المجالات</dt><dd>{areasHere.map((a) => AREA_SHORT[a] ?? a).join(' · ') || '—'}</dd></div>
                </dl>
                <ul className="map-panel__projects">
                  {currentProjects.map((p) => (
                    <li key={p.id}>
                      <button type="button" className="panel-project" onClick={() => setProjectView(p.slug)}>
                        <span className="panel-project__name">{p.name_ar}</span>
                        <span className="panel-project__meta">{p.areas.map((a) => AREA_SHORT[a] ?? a).join(' · ')} · {STATUS_LABELS[p.status]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {currentProjects.length === 0 && (
                  <p className="muted">لا مشاريع منشورة في هذه {showLocalities ? 'المحلية' : 'الولاية'} بعد.</p>
                )}
                {!showLocalities && (
                  <Link href={`/map/${encodeURIComponent(selection.code)}`} className="link-more map-panel__more">
                    استكشف أعمالنا في الولاية ←
                  </Link>
                )}
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}