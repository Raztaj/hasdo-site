export type ProjectStatus = 'planned' | 'active' | 'completed';
export type StoryType = 'story' | 'news' | 'update';
export type ResourceCategory = 'reports' | 'policies' | 'documents';
export type OfficeKind = 'country';

export interface DocumentItem {
  label_ar: string;
  url: string;
  kind: string;
}

/** حضور منظمة في ولاية/محلية — يتحكم في مؤشر الخريطة (المقر الرئيسي / موقع عمل).
 * منظمة واحدة مقرها الرئيسي: الخرطوم. لا فروع ثانوية. */
export interface StatePresence {
  code: string;
  office_kind: OfficeKind | null;
}

export interface State {
  code: string;
  name_ar: string;
  name_en: string;
}

export interface Locality {
  code: string;
  name_ar: string;
  name_en: string;
  state_code: string;
}

export interface Project {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  state_code: string | null;
  locality: string;
  areas: string[];
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  duration_months: number | null;
  description_ar: string;
  description_en: string;
  objective_ar: string;
  challenge_ar: string;
  activities_ar: string;
  results_ar: string;
  impact_ar: string;
  beneficiaries: number;
  communities: number;
  volunteers: number;
  schools: number;
  partners: string[];
  cover_url: string;
  gallery: string[];
  documents: DocumentItem[];
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  type: StoryType;
  title_ar: string;
  title_en: string;
  body_ar: string;
  author: string;
  project_slug: string | null;
  image_url: string;
  images: string[];
  state_code: string | null;
  published_at: string;
}

export interface ResourceItem {
  id: string;
  category: ResourceCategory;
  title_ar: string;
  title_en: string;
  description_ar: string;
  file_url: string;
  file_size: number;
  published_at: string;
}

export interface Partner {
  id: string;
  name_ar: string;
  website: string;
  kind: string;
}

export interface SiteStat {
  key: string;
  label_ar: string;
  value_num: number;
  value: string;
}

export interface Area {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  cover_image: string;
  sort_order: number;
}

export interface Organization {
  id: number;
  name_ar: string;
  name_en: string;
  acronym: string;
  description_ar: string;
  mission_ar: string;
  vision_ar: string;
  logo_url: string;
  email: string;
  phone: string;
  address_ar: string;
  social_links: string[];
}