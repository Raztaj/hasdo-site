import { MAP_HEIGHT, MAP_STATES, MAP_WIDTH } from '@/lib/mapdata';

interface SudanSilhouetteProps {
  className?: string;
}

/** ظل خريطة السودان — طبقة خلفية باهتة توضع داخل خلفيات الصفحة والأقسام. */
export default function SudanSilhouette({ className = '' }: SudanSilhouetteProps) {
  return (
    <svg
      className={`sudan-wm${className ? ` ${className}` : ''}`}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {MAP_STATES.map((s) => (
        <path key={s.code} d={s.d} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}
