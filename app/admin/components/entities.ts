import type { State } from '@/lib/types';
import type { FieldDef } from './fields';

export const STATUS_OPTIONS = [
  { value: 'planned', label: 'مُخطط' },
  { value: 'active', label: 'نشط' },
  { value: 'completed', label: 'منفذ' },
];

export const TYPE_OPTIONS = [
  { value: 'story', label: 'قصة' },
  { value: 'news', label: 'خبر' },
  { value: 'update', label: 'تحديث' },
];

export const CATEGORY_OPTIONS = [
  { value: 'reports', label: 'تقارير' },
  { value: 'policies', label: 'سياسات' },
  { value: 'documents', label: 'وثائق' },
];

export function stateOptions(states: State[]): Array<{ value: string; label: string }> {
  return [{ value: '', label: '— غير محدد —' }, ...states.map((s) => ({ value: s.code, label: s.name_ar }))];
}

export function projectFields(states: State[]): FieldDef[] {
  const st = stateOptions(states);
  return [
    { name: 'name_ar', label: 'الاسم (عربي) [العنوان]', required: true },
    { name: 'slug', label: 'الرابط (slug لاتيني أو عربي)', required: true },
    { name: 'name_en', label: 'الاسم (إنجليزي)' },
    { name: 'state_code', label: 'الولاية', type: 'select', options: st },
    { name: 'locality', label: 'المحلية' },
    { name: 'areas', label: 'مجالات العمل (فاصلة) — الشباب، التعليم، تقوية روابط المجتمع', type: 'tags' },
    { name: 'status', label: 'الحالة', type: 'select', options: STATUS_OPTIONS },
    { name: 'start_date', label: 'بداية التنفيذ', type: 'date' },
    { name: 'end_date', label: 'النهاية', type: 'date' },
    { name: 'duration_months', label: 'المدة (شهر)', type: 'number' },
    { name: 'description_ar', label: 'الوصف المختصر (بطاقة الموقع)', type: 'textarea' },
    { name: 'description_en', label: 'الوصف (إنجليزي)', type: 'textarea' },
    { name: 'objective_ar', label: 'الهدف', type: 'textarea' },
    { name: 'challenge_ar', label: 'التحدي', type: 'textarea' },
    { name: 'activities_ar', label: 'الأنشطة', type: 'multiline' },
    { name: 'results_ar', label: 'النتائج', type: 'multiline' },
    { name: 'impact_ar', label: 'الأثر', type: 'textarea' },
    { name: 'beneficiaries', label: 'المستفيدون', type: 'number' },
    { name: 'communities', label: 'المجتمعات', type: 'number' },
    { name: 'volunteers', label: 'المتطوعون', type: 'number' },
    { name: 'schools', label: 'المدارس', type: 'number' },
    { name: 'partners', label: 'الشركاء (سطر لكل شريك)', type: 'multiline' },
    { name: 'cover_url', label: 'رابط صورة الغلاف' },
    { name: 'gallery', label: 'معرض الصور (سطر لكل رابط)', type: 'multiline' },
    { name: 'documents', label: 'الوثائق — كل سطر: العنوان|الرابط|النوع', type: 'documents' },
  ];
}

export function storyFields(states: State[]): FieldDef[] {
  const st = stateOptions(states);
  return [
    { name: 'title_ar', label: 'العنوان', required: true },
    { name: 'title_en', label: 'العنوان (إنجليزي)' },
    { name: 'type', label: 'النوع', type: 'select', options: TYPE_OPTIONS },
    { name: 'body_ar', label: 'النص', type: 'textarea' },
    { name: 'author', label: 'الكاتب' },
    { name: 'state_code', label: 'الولاية', type: 'select', options: st },
    { name: 'project_slug', label: 'رابط المشروع المرتبط (slug)' },
    { name: 'image_url', label: 'صورة رئيسية' },
    { name: 'images', label: 'صور إضافية (سطر لكل رابط)', type: 'multiline' },
    { name: 'published_at', label: 'تاريخ النشر', type: 'datetime' },
  ];
}

export function resourceFields(): FieldDef[] {
  return [
    { name: 'title_ar', label: 'العنوان', required: true },
    { name: 'title_en', label: 'العنوان (إنجليزي)' },
    { name: 'category', label: 'الفئة', type: 'select', options: CATEGORY_OPTIONS },
    { name: 'description_ar', label: 'الوصف', type: 'textarea' },
    { name: 'file_url', label: 'رابط الملف' },
    { name: 'file_size', label: 'الحجم (كيلوبايت)', type: 'number' },
    { name: 'published_at', label: 'تاريخ النشر', type: 'datetime' },
  ];
}

export function partnerFields(): FieldDef[] {
  return [
    { name: 'name_ar', label: 'الاسم', required: true },
    { name: 'kind', label: 'الدور/الشراكة' },
    { name: 'website', label: 'الموقع الإلكتروني' },
  ];
}