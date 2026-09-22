-- يوائم نموذج البيانات مع القسم 17 من المخطط (BLUEPRINT):
--   المشروع: challenge · results · documents · schools
--   جدول areas  : مجال العمل مستقل (name/description/cover)
--   جدول organization : سطر واحد لبيانات المنظمة (name/description/mission/vision/logo/contact)
--   القصة: author · project_slug · images[]

-- ---------------------------------------------------------------- projects (توسيع)
alter table public.projects
  add column if not exists challenge_ar    text not null default '',
  add column if not exists results_ar      text not null default '',
  add column if not exists description_en  text not null default '',
  add column if not exists schools         integer not null default 0
                                          check (schools >= 0),
  add column if not exists documents       jsonb not null default '[]';

-- ---------------------------------------------------------------- areas
create table if not exists public.areas (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name_ar       text not null,
  name_en       text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  cover_image   text not null default '',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger areas_set_updated_at
  before update on public.areas
  for each row execute function public.set_updated_at();

insert into public.areas (slug, name_ar, name_en, sort_order) values
  ('youth', 'الشباب', 'Youth', 1),
  ('community', 'تقوية روابط المجتمع', 'Community Social Cohesion', 2),
  ('education', 'التعليم', 'Education', 3)
on conflict (slug) do nothing;

-- ------------------------------------------------------- organization (سطر واحد)
create table if not exists public.organization (
  id            smallint primary key default 1 check (id = 1),
  name_ar       text not null default '',
  name_en       text not null default '',
  acronym       text not null default '',
  description_ar text not null default '',
  mission_ar    text not null default '',
  vision_ar     text not null default '',
  logo_url      text not null default '',
  email         text not null default '',
  phone         text not null default '',
  address_ar    text not null default '',
  social_links  jsonb not null default '[]',
  updated_at    timestamptz not null default now()
);

create trigger organization_set_updated_at
  before update on public.organization
  for each row execute function public.set_updated_at();

insert into public.organization
  (id, name_ar, name_en, acronym, description_ar, address_ar) values
  (1, 'منظمة العمل الإنساني والتنمية المستدامة', 'HASDO', 'HASDO',
   'عمل إنساني يبدأ من الإنسان، والتنمية تبدأ من المجتمع.',
   'المقر: السودان')
on conflict (id) do nothing;

-- ---------------------------------------------------------------- stories (توسيع)
alter table public.stories
  add column if not exists author        text not null default '',
  add column if not exists project_slug  text,
  add column if not exists images        text[] not null default '{}';

-- -------------------------------------------------------- row-level safety
alter table public.areas        enable row level security;
alter table public.organization enable row level security;

create policy "public read areas"        on public.areas        for select using (true);
create policy "public read organization" on public.organization for select using (true);