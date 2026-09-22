'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Project, StatePresence } from '@/lib/types';
import type { MapRegion } from '@/lib/mapdata';
import SudanMap from './sudan-map';

interface HeroMapProps {
  projects: Project[];
  presence: StatePresence[];
  states: MapRegion[];
  localities: MapRegion[];
}

/** المصغّرة الحيّة داخل هيرو الرئيسية — تفاعلية من أول ثانية؛
 *  النقر على ولاية ينقل إلى صفحة أعمالنا في تلك الولاية. */
export default function HeroMap({ projects, presence, states, localities }: HeroMapProps) {
  const router = useRouter();

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

  return (
    <div className="hero-map">
      <SudanMap
        states={states}
        localities={localities}
        activeCodes={activeCodes}
        officeKinds={officeKinds}
        onSelectState={(code) => router.push(`/map/${code}`)}
      />
      <p className="hero-map__hint">
        <Link href="/map">استكشف خريطة السودان كاملة</Link>
      </p>
    </div>
  );
}