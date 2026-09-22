-- منظمة العمل الإنساني والتنمية المستدامة
-- Schema initial (Postgres / Supabase)

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------- projects
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name_ar         text not null,
  name_en         text not null default '',
  state_code      text,
  locality        text not null default '',
  areas           text[] not null default '{}',
  status          text not null default 'planned'
                    check (status in ('planned','active','completed')),
  start_date      date,
  end_date        date,
  duration_months integer,
  description_ar  text not null default '',
  objective_ar    text not null default '',
  activities_ar   text not null default '',
  impact_ar       text not null default '',
  beneficiaries   integer not null default 0 check (beneficiaries >= 0),
  communities     integer not null default 0 check (communities >= 0),
  volunteers      integer not null default 0 check (volunteers >= 0),
  partners        text[] not null default '{}',
  cover_url       text not null default '',
  gallery         text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- stories
create table if not exists public.stories (
  id           uuid primary key default gen_random_uuid(),
  type         text not null default 'story'
                 check (type in ('story','news','update')),
  title_ar     text not null,
  title_en     text not null default '',
  body_ar      text not null default '',
  image_url    text not null default '',
  state_code   text,
  published_at timestamptz not null default now()
);

-- --------------------------------------------------------------- resources
create table if not exists public.resources (
  id            uuid primary key default gen_random_uuid(),
  category      text not null default 'reports'
                  check (category in ('reports','policies','documents')),
  title_ar      text not null,
  title_en      text not null default '',
  description_ar text not null default '',
  file_url      text not null default '',
  file_size     bigint not null default 0,
  published_at  timestamptz not null default now()
);

-- --------------------------------------------------------------- partners
create table if not exists public.partners (
  id      uuid primary key default gen_random_uuid(),
  name_ar text not null,
  kind    text not null default '',
  website text not null default ''
);

-- ------------------------------------------------------------ site_stats
create table if not exists public.site_stats (
  key       text primary key,
  label_ar  text not null default '',
  value_num bigint not null default 0,
  value     text not null default ''
);

insert into public.site_stats (key, label_ar, value_num) values
  ('beneficiaries', 'شخص تم الوصول إليهم', 0),
  ('projects', 'مشروعاً منفذاً', 0),
  ('communities', 'مجتمعات', 0),
  ('states', 'ولايات', 0),
  ('volunteers', 'متطوع', 0)
on conflict (key) do nothing;

-- -------------------------------------------------------- row-level safety
alter table public.projects  enable row level security;
alter table public.stories   enable row level security;
alter table public.resources enable row level security;
alter table public.partners  enable row level security;
alter table public.site_stats enable row level security;

-- public read for the website; writes happen only via the service-role key
-- (server actions), which bypasses RLS.
create policy "public read projects" on public.projects  for select using (true);
create policy "public read stories"  on public.stories   for select using (true);
create policy "public read resources" on public.resources for select using (true);
create policy "public read partners" on public.partners  for select using (true);
create policy "public read site_stats" on public.site_stats for select using (true);