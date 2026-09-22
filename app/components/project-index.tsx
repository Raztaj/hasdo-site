'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Project } from '@/lib/types';
import { AREA_SHORT, STATUS_LABELS } from '@/lib/site';
import { stateCodeToArabic } from '@/lib/geo';

interface ProjectIndexProps {
  projects: Project[];
  /** صفوف معدودة (homepage: كل المشاريع) */
  showAll?: boolean;
  count?: number;
}

/** فهرس مشاريع بنمط منشور: صف مرقّم، صورة تظهر عند التمرير، والرقم 'استكشف' يتبع المؤشر. */
export default function ProjectIndex({ projects, showAll = false, count = 3 }: ProjectIndexProps) {
  const rows = useMemo(
    () => (showAll ? projects : projects.slice(0, count)),
    [projects, showAll, count],
  );
  const [showCursor, setShowCursor] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    const root = indexRef.current;
    if (!root) return;
    const move = (e: MouseEvent) => {
      if (!labelRef.current) return;
      labelRef.current.style.left = `${e.clientX}px`;
      labelRef.current.style.top = `${e.clientY}px`;
    };
    const enter = () => setShowCursor(true);
    const leave = () => setShowCursor(false);
    const els = root.querySelectorAll('.index-row');
    els.forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });
    window.addEventListener('mousemove', move);
    return () => {
      els.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
      window.removeEventListener('mousemove', move);
    };
  }, [rows]);

  const yearOf = (p: Project) => {
    if (p.end_date) return new Date(p.end_date).getFullYear();
    if (p.start_date) return new Date(p.start_date).getFullYear();
    return '';
  };

  return (
    <>
      {showCursor && (
        <span ref={labelRef} className="cursor-label" aria-hidden="true">
          استكشف
        </span>
      )}
      <ol ref={indexRef} className="index">
        {rows.map((p, i) => (
          <li key={p.id} className="index-item">
            <Link href={`/projects/${encodeURIComponent(p.slug)}`} className="index-row">
              <span className="index-num num">{String(i + 1).padStart(2, '0')}</span>
              <span className="index-name">{p.name_ar}</span>
              <span className="index-tags">
                {p.areas.map((a) => AREA_SHORT[a] ?? a).join(' · ')}
                {p.state_code ? ` — ${stateCodeToArabic(p.state_code)}` : ''}
                {' · '}
                <span className="meta">{STATUS_LABELS[p.status]}</span>
              </span>
              <span className="index-year num">{yearOf(p)}</span>
              <span className="index-arrow" aria-hidden="true">←</span>
            </Link>
            <div className="index-ph" aria-hidden="true">
              <div className="ph ph-card" />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}