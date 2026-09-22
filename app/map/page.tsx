import type { Metadata } from 'next';
import Link from 'next/link';
import { statesList, localitiesList } from '@/lib/geo';
import { getProjects, getPresence } from '@/lib/data';
import { MAP_LOCALITIES, MAP_STATES } from '@/lib/mapdata';
import MapExplorer from '@/app/components/map-explorer';

export const metadata: Metadata = { title: 'أين نعمل' };

export default async function MapPage() {
  const [projects, presence] = await Promise.all([getProjects(), getPresence()]);

  return (
    <main className="map-page">
      <div className="map-topbar">
        <div className="container">
          <div>
            <h1 className="map-title">حضورنا في السودان</h1>
            <p className="map-sub">استكشف مشاريعنا ومواقع عملنا في مختلف الولايات. اضغط على أي ولاية على الخريطة.</p>
          </div>
        </div>
      </div>

      <div className="map-body">
        <MapExplorer
          projects={projects}
          presence={presence}
          states={MAP_STATES}
          localities={MAP_LOCALITIES}
        />

        <div className="map-legend" aria-label="مفتاح الخريطة">
          <span><i className="dot-legend dot--office" />المقر الرئيسي</span>
          <span><i className="dot-legend dot--site" />حيث نعمل</span>
        </div>
      </div>

      <details className="map-details">
        <summary>ولايات السودان ▾</summary>
        <ul>
          {statesList().map((s) => {
            const n = projects.filter((p) => p.state_code === s.code).length;
            return (
<li key={s.code}>
                  <Link href={`/map/${encodeURIComponent(s.code)}`}>{s.name_ar}</Link>
                  <span className="num">{n}</span>
                </li>
            );
          })}
        </ul>
      </details>

      <p className="map-source">
        الخريطة: بيانات حدود إدارية (COD-AB) من Humanitarian Data Exchange (OCHA)، وللأغراض المرجعية الجغرافية فقط.
      </p>
    </main>
  );
}