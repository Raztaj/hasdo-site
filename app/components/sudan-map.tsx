'use client';

import type { KeyboardEvent } from 'react';
import { KHARTOUM_CODE } from '@/lib/geo';
import type { MapRegion } from '@/lib/mapdata';

interface SudanMapProps {
  /** الولايات أو المحليات المعروضة — مسارات معروضة مسبقاً (من lib/mapdata) */
  states: MapRegion[];
  localities: MapRegion[];
  /** المناطق ذات الحضور (مشاريع أو مكتب/موقع عمل) → ملأ أزرق */
  activeCodes: Record<string, true>;
  /** نوع المقر لكل منطقة: 'country' → دائرة معبأة (المقر الرئيسي)؛ غير موجودة = موقع عمل */
  officeKinds: Record<string, string>;
  width?: number;
  height?: number;
  selectedState?: string;
  selectedLocality?: string;
  onSelectState?: (code: string) => void;
  onSelectLocality?: (code: string) => void;
}

export default function SudanMap({
  states,
  localities,
  activeCodes,
  officeKinds,
  width = 520,
  height = 600,
  selectedState,
  selectedLocality,
  onSelectState,
  onSelectLocality,
}: SudanMapProps) {
  const showLocalities = selectedState === KHARTOUM_CODE || Boolean(selectedLocality);
  const regions = showLocalities ? localities : states;

  const handleKey = (e: KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const isActive = (code: string) => activeCodes[code] === true;
  const kindOf = (code: string) => officeKinds[code] ?? '';

  return (
    <svg
      role="group"
      className="sudan-map"
      viewBox={`0 0 ${width} ${height}`}
      aria-label={showLocalities ? 'خريطة محليات الخرطوم' : 'خريطة ولايات السودان'}
    >
      {regions.map((r) => {
        const active = isActive(r.code);
        const pressed = showLocalities ? selectedLocality === r.code : selectedState === r.code;
        const handleSelect = showLocalities ? onSelectLocality : onSelectState;
        return (
          <g
            key={r.code}
            className={`map-region${active ? ' is-active' : ' is-inactive'}`}
            role={handleSelect ? 'button' : undefined}
            tabIndex={handleSelect ? 0 : undefined}
            aria-label={`${r.name_ar}${active ? ' — حضور' : ''}`}
            aria-pressed={pressed}
            onClick={handleSelect ? () => handleSelect(r.code) : undefined}
            onKeyDown={handleSelect ? (e) => handleKey(e, () => handleSelect(r.code)) : undefined}
          >
            <title>{r.name_ar}</title>
            <path d={r.d} />
            {active && (
              <>
                <circle
                  className={kindOf(r.code) ? 'map-dot map-dot--office' : 'map-dot map-dot--site'}
                  cx={r.cx}
                  cy={r.cy - 18}
                  r={5}
                />
                <text className="map-label" x={r.cx} y={r.cy + 7} textAnchor="middle">
                  {r.name_ar}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}