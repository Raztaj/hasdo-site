import type { Locality, State } from './types';
import statesFC from '@/public/data/sudan-states.json';
import khartoumFC from '@/public/data/sdn-khartoum-localities.json';

type FC = {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: { code: string; name_ar: string; name_en: string };
    geometry: unknown;
  }>;
};

const STATES_FC = statesFC as FC;
const KHARTOUM_FC = khartoumFC as FC;

export const KHARTOUM_CODE = 'SD01';

export function statesList(): State[] {
  return STATES_FC.features
    .map((f) => ({
      code: f.properties.code,
      name_ar: f.properties.name_ar,
      name_en: f.properties.name_en,
    }))
    .sort((a, b) => a.name_ar.localeCompare(b.name_ar, 'ar'));
}

export function localitiesList(): Locality[] {
  return KHARTOUM_FC.features.map((f) => ({
    code: f.properties.code,
    name_ar: f.properties.name_ar,
    name_en: f.properties.name_en,
    state_code: KHARTOUM_CODE,
  }));
}

export function stateCodeToArabic(code: string | null | undefined): string {
  if (!code) return 'غير محدد';
  const s = statesList().find((x) => x.code === code);
  return s ? s.name_ar : code;
}

export function stateNameToCode(nameArOrEn: string): string | null {
  const n = nameArOrEn.trim().toLowerCase();
  const found = STATES_FC.features.find(
    (f) =>
      f.properties.name_ar.trim().toLowerCase() === n ||
      f.properties.name_en.trim().toLowerCase() === n,
  );
  return found ? found.properties.code : null;
}

export { STATES_FC, KHARTOUM_FC };