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