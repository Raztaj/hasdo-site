'use client';

import { useMemo, useState } from 'react';
import type { Project, State } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/site';
import ProjectIndex from './project-index';

interface ProjectListProps {
  projects: Project[];
  states: State[];
  areas: string[];
}

export default function ProjectList({ projects, states, areas }: ProjectListProps) {
  const [area, setArea] = useState('all');
  const [stateCode, setStateCode] = useState('all');
  const [status, setStatus] = useState('all');

  const visible = useMemo(
    () =>
      projects.filter(
        (p) =>
          (area === 'all' || p.areas.includes(area)) &&
          (stateCode === 'all' || p.state_code === stateCode) &&
          (status === 'all' || p.status === status),
      ),
    [projects, area, stateCode, status],
  );

  return (
    <div>
      <div className="filters">
        <label>
          المجال
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="all">كل المجالات</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label>
          الموقع
          <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
            <option value="all">كل الولايات</option>
            {states.map((s) => <option key={s.code} value={s.code}>{s.name_ar}</option>)}
          </select>
        </label>
        <label>
          الحالة
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">كل الحالات</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="muted">لا مشاريع مطابقة لهذه التصفية.</p>
      ) : (
        <ProjectIndex projects={visible} showAll />
      )}
    </div>
  );
}