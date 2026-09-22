# منظمة العمل الإنساني والتنمية المستدامة (HASDO)

موقع ميداني تفاعلي لمنظمة غير حكومية تعمل في السودان: نظام صفحات عربية بالكامل (RTL)،
خريطة تفاعلية لولايات السودان الـ18 مع تعمّق داخل محليات الخرطوم، ولوحة بيانات تدير كل محتوى الموقع.

## التقنيات
- **Next.js 15** (App Router, TypeScript) — `next`
- **Supabase** (Postgres + Auth) — قراءة عامة عبر `anon`، كتابة عبر مفتاح `service_role` حصرياً من خوادم الإدارة
- **d3-geo** — رسم الخريطة من بيانات OCHA COD-AB (ملفات JSON محلية في `public/data/`)
- **IBM Plex Sans Arabic + IBM Plex Sans** عبر Google Fonts

## التشغيل محلياً
```bash
npm install
npm run dev
```
الموقع يعمل فوراً ببيانات تجريبية حتى يُربط Supabase.

## ربط Supabase
1. أنشئ مشروعاً على supabase.com (الخطة المجانية تكفي).
2. شغّل ملف الترحيل `supabase/migrations/0001_init.sql` من *SQL Editor*.
3. انسخ `.env.example` إلى `.env.local` وضع بيانات URL ومفاتيح `anon` و`service_role`.
4. أنشئ المستخدم الإداري الأول (قد تسجل الدخول من `Authentication → Users` أو عبر):
   ```bash
   node scripts/seed-admin.mjs
   ```
5. افتح `/admin/login` لتسجيل الدخول، وقرِ الموقع من لوحة البيانات.

لا ترسل مفتاح `service_role` إلى أي مكان عام — لا يُستخدم إلا داخل خوادم الإدارة.

## بيانات الخريطة
- `scripts/prepare-map.mjs` — يجلب ويُنظّف ملفي GeoJSON:
  - `public/data/sudan-states.json` (18 ولاية)
  - `public/data/sdn-khartoum-localities.json` (7 محليات للخرطوم)
- المصدر: Humanitarian Data Exchange (COD-AB / OCHA).

## النشر على Vercel (مجاني)
1. ارفع المشروع إلى GitHub (الحساب مجاني).
2. في `vercel.com` اختر *Import* المشروع.
3. أضف المتغيرات من `.env.local` في إعدادات Vercel (Environment Variables).
4. Deploy — الرابط النهائي يُتاح مباشرة.

## البنية
```
app/
  (public)/          صفحات الموقع العامة (9 صفحات + تفاصيل المشروع)
  admin/             لوحة البيانات: دخول، نظرة عامة، مشاريع، قصص، موارد، شركاء، إعدادات
components/
  SudanMap / MapExplorer   الخريطة التفاعلية
  PublicHeader/PublicFooter ...
lib/
  data.ts          قراءة البيانات مع بديل تجريبي عند غياب Supabase
  supabase/        خوادم Supabase (env مشترك، خادم جلسات، خادم service_role)
legacy-static/     النسخة الثابتة الأولى (احتياطي تاريخي)
supabase/migrations/0001_init.sql
```
## الأصول
شعار المنظمة وألوانها من ملف `Humanitarian Action and Sustainable LOGO.pdf`
(أزرق `#0E5CAD` أساسي، مع أخضر وذهبي ووردي وأحمر)، وخط الواسم Calisto MT.