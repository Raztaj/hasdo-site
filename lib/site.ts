export const ORG = {
  nameAr: 'منظمة العمل الإنساني والتنمية المستدامة',
  acronym: 'HASDO',
  blurb: 'عمل إنساني يبدأ من الإنسان، والتنمية تبدأ من المجتمع.',
  country: 'السودان',
};

export const NAV = [
  { href: '/', label: 'الرئيسية' },
  { href: '/about', label: 'من نحن' },
  { href: '/areas', label: 'مجالات العمل' },
  { href: '/map', label: 'أين نعمل' },
  { href: '/projects', label: 'مشاريعنا' },
  { href: '/impact', label: 'الأثر' },
  { href: '/field', label: 'من الميدان' },
  { href: '/resources', label: 'الموارد' },
] as const;

export const CTA = { href: '/participate', label: 'شارك معنا' } as const;

export const AREAS = ['الشباب', 'تقوية روابط المجتمع', 'التعليم'] as const;

export const STATUS_LABELS: Record<string, string> = {
  planned: 'مُخطط',
  active: 'نشط',
  completed: 'منفذ',
};

export const AREA_SHORT: Record<string, string> = {
  'الشباب': 'شباب',
  'تقوية روابط المجتمع': 'مجتمع',
  'التعليم': 'تعليم',
};

/**
 * صياغة الاسم حسب العدد وفق قواعد العربية (المفرد/المثنى/الجمع/التمييز).
 * الصيغ بالترتيب: [مفرد، مثنى، جمع (3–10)، تمييز (11 فأكثر في المنصوب)].
 */
export function arNoun(
  n: number,
  forms: { one: string; two: string; threeToTen: string; many: string },
): string {
  if (n === 1) return forms.one;
  if (n === 2) return forms.two;
  if (n >= 3 && n <= 10) return forms.threeToTen;
  return forms.many;
}

export const NOUN = {
  project: { one: 'مشروع', two: 'مشروعان', threeToTen: 'مشاريع', many: 'مشروعاً' },
  beneficiary: { one: 'مستفيد', two: 'مستفيدان', threeToTen: 'مستفيدون', many: 'مستفيداً' },
  volunteer: { one: 'متطوع', two: 'متطوعان', threeToTen: 'متطوعون', many: 'متطوعاً' },
  state: { one: 'ولاية', two: 'ولايتان', threeToTen: 'ولايات', many: 'ولاية' },
  completed: { one: 'منجز', two: 'منجزان', threeToTen: 'منجزة', many: 'منجزاً' },
  story: { one: 'قصة', two: 'قصتان', threeToTen: 'قصص', many: 'قصة' },
  resource: { one: 'مستند', two: 'مستندان', threeToTen: 'مستندات', many: 'مستنداً' },
  partner: { one: 'شريك', two: 'شريكان', threeToTen: 'شركاء', many: 'شريكاً' },
} as const;