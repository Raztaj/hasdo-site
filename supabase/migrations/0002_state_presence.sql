-- حضور المنظمة في الولايات/المحليات — يتحكم في مؤشرات الخريطة
-- مقر رئيسي واحد فقط (الخرطوم)؛ لا فروع ثانوية.
-- ● معبأة = المقر الرئيسي، ○ مفرغة = موقع عمل
create table if not exists public.state_presence (
  code        text primary key,                 -- كود الولاية أو المحلية (SD01, SD01001…)
  office_kind text
              check (office_kind = 'country')   -- null = موقع عمل (لا مقر)
);

alter table public.state_presence enable row level security;

create policy "state_presence public read"
  on public.state_presence
  for select
  using (true);