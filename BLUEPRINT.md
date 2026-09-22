# HASDO Website Blueprint — Full IA + UX Specification

> Source of truth for information architecture, UX flow, content model, and design
> boundaries. Saved from the client's master spec. `DESIGN.md` remains the visual
> design-system reference; this file governs structure and content.

---

# HASDO Website Structure

### Arabic-first humanitarian platform

**Primary language:** العربية
**Secondary:** English
**Core visual:** Blue Sudan map + documentary photography + clean institutional typography
**Main idea:** *Show where HASDO works, what it does, and what has changed.*

---

# SECTION 01 — GLOBAL STRUCTURE

## Main navigation

Desktop:

```text
[HASDO LOGO]

الرئيسية
من نحن
مجالات العمل
أين نعمل
مشاريعنا
الأثر
من الميدان
الموارد

[شارك معنا]

العربية / English
```

Keep the navigation relatively compact. Don't put 14 things in the navbar.

### Mobile

```text
HASDO                         ☰
```

Opening:

```text
الرئيسية

من نحن
مجالات العمل
   الشباب
   التعليم
   تقوية روابط المجتمع

أين نعمل

مشاريعنا

الأثر

من الميدان

الموارد

شارك معنا

English
```

---

# SECTION 02 — HOMEPAGE

The homepage should **tell HASDO's story without requiring the visitor to understand the organization first.**

The sequence:

```text
HERO
 ↓
QUICK IMPACT STRIP
 ↓
SUDAN MAP
 ↓
WHO WE ARE
 ↓
AREAS OF WORK
 ↓
PROJECTS
 ↓
IMPACT
 ↓
FIELD STORIES
 ↓
VOLUNTEERING
 ↓
TRANSPARENCY
 ↓
CTA
 ↓
FOOTER
```

---

## 2.1 HERO

First impression.

### Arabic headline (placeholder until official messaging)

> **العمل الإنساني يبدأ من الإنسان، والتنمية تبدأ من المجتمع.**

Supporting copy:

> منظمة تعمل من أجل دعم المجتمعات وتعزيز دور الشباب والتعليم وبناء روابط مجتمعية أكثر قوة.

### Buttons

**اكتشف أعمالنا**

**استكشف خريطة السودان**

### Visual

Large Sudan map. States with HASDO activity appear in **blue**.
No red. No rainbow map. No unnecessary pins everywhere.

Highlighted areas correspond to actual HASDO activity once data is available.

---

## 2.2 QUICK IMPACT STRIP

Immediately underneath. Not giant fake-looking counters. Restrained:

```text
المشاريع المنفذة     المجتمعات       المستفيدون       المتطوعون
       —                —                —               —
```

Until real numbers arrive:

> **24** مشروعاً
> **12** مجتمعاً
> **18,400** مستفيد
> **320** متطوعاً

Only verified numbers.

---

# SECTION 03 — THE SUDAN MAP

Signature feature of the entire website.

## أين نعمل؟

Headline:

> **حضورنا في السودان**

Supporting:

> استكشف مواقع عمل HASDO والمشاريع المنفذة في مختلف الولايات.

Large interactive map.

### State interaction

Hover:

```text
ولاية الخرطوم
```

Click:

```text
ولاية الخرطوم

المشاريع
04

المستفيدون
—

المجالات
الشباب • التعليم
```

Then:

**استكشف أعمالنا في الولاية →**

---

### State page (generated, not hand-designed per state)

### ولاية الخرطوم

**نظرة عامة** — placeholder for verified HASDO description.

```text
04
مشاريع

—
مستفيدون

02
مجالات عمل
```

### المشاريع في الولاية

Cards (e.g. إعمار المدارس — التعليم — منفذ).

### الصور

Field photography from that location.

---

# SECTION 04 — من نحن

Identity page.

## 4.1 مقدمة / من نحن؟ — official description (no invented NGO-speak)
## 4.2 رؤيتنا — official vision
## 4.3 رسالتنا — official mission
## 4.4 كيف نعمل؟

```text
الاستجابة → التعافي → تمكين المجتمع → التنمية المستدامة
```

Only concepts HASDO officially uses.

## 4.5 قيمنا (placeholders, not claims)

```text
الإنسان · المجتمع · المشاركة · المسؤولية · الاستدامة
```

---

# SECTION 05 — مجالات العمل

Three baseline areas: **الشباب** · **التعليم** · **تقوية روابط المجتمع**

Each area intro waits for official material.

### Individual area page

```text
الشباب
[Intro]
01 المجال [Description]
المشاريع المرتبطة
  — التدريب الحرفي للشباب [Photo] [Description]
  — شباب من أجل التعليم [Photo] [Description]
Impact [verified statistics]
```

Creates the relationship: **Area → Projects → Impact**

---

# SECTION 06 — المشاريع

> **مشاريعنا** — تعرف على المشاريع التي نفذتها HASDO والمجتمعات التي عملت معها.

## Filters

```text
كل المشاريع
المجال [الشباب ▼] · الموقع [كل الولايات ▼] · الحالة [منفذ ▼] · السنة [2026 ▼]
```

Mobile: filter drawers.

## Project cards

Title, area(s), 📍 location, status, short description, **استكشف المشروع →**

Known projects (first content records, not permanent structure):

- إعمار المدارس (التعليم)
- شباب من أجل التعليم (الشباب · التعليم)
- التدريب الحرفي للشباب (الشباب)
- مشروع التعافي والدعم النفسي (تقوية روابط المجتمع / التعافي)

---

# SECTION 07 — INDIVIDUAL PROJECT PAGE

```text
[Hero]
التعليم / إعمار المدارس
📍 الموقع · 📅 تاريخ التنفيذ · ✓ الحالة
```

- عن المشروع — full description
- التحدي — problem addressed
- ماذا فعلت HASDO؟ — actual activities
- النتائج — numbers (مدارس/طلاب/متطوعون/مجتمعات)
- الأثر — narrative
- من الميدان — photos
- Related projects

---

# SECTION 08 — الأثر

Dedicated page, not just homepage sprinkles.

> ماذا تغير نتيجة العمل؟

## Impact overview

المشاريع المنفذة · المستفيدون · المتطوعون · الولايات · المجتمعات

## Impact by area

الشباب / التعليم / تقوية روابط المجتمع — with per-area metrics.

## Impact by location

Second Sudan map showing **impact rather than presence**, metric switcher:

```text
عرض حسب:
● المشاريع
○ المستفيدين
○ المجتمعات
```

---

# SECTION 09 — من الميدان

> **من الميدان** — قصص وتجارب من المجتمعات والمتطوعين والعاملين مع HASDO.

- Large editorial story cards (title, photo, date, location)
- Field gallery grid → click opens: image, location, date, project, caption
  (No Pinterest garbage.)

---

# SECTION 10 — المتطوعون / شارك معنا

> **وقتك، مهارتك، وخبرتك يمكن أن تكون جزءاً من العمل.**

Three pathways:

1. **تطوع** — شارك في تنفيذ الأنشطة والمبادرات → **تطوع معنا**
2. **مهارات وخبرات** — professional expertise (tech, education, design, comms, logistics — only once confirmed)
3. **شراكة** — organizations/institutions → **ابدأ محادثة**

---

# SECTION 11 — الموارد

Resource center:

- **التقارير** (annual report, project reports — PDF)
- **المستندات** (policies/organizational docs)
- **الأخبار والتحديثات**
- **Media kit** — logo, brand assets, profile, official photographs

---

# SECTION 12 — ABOUT THE PEOPLE

**فريق HASDO** — simple name + role lists. Separate فريق العمل / المتطوعون if wanted.
Never expose personal info that shouldn't be public.

---

# SECTION 13 — PARTNERS

**شركاؤنا** — logo grid. Click → organization name, nature of partnership, related projects.
Only official/verified relationships.

---

# SECTION 14 — TRANSPARENCY & ACCOUNTABILITY

**الشفافية والمساءلة** — categories depend on HASDO policies:

التقارير · السياسات · الشكاوى والملاحظات · الحماية · المساءلة المجتمعية

---

# SECTION 15 — CONTACT

## تواصل معنا

- المقر — official address
- البريد — official email
- الهاتف — official numbers
- Social media — official accounts

### Contact form

```text
الاسم · البريد الإلكتروني · نوع التواصل · الرسالة · [إرسال]
```

نوع التواصل: استفسار عام · تطوع · شراكة · إعلام · مشروع · أخرى

---

# SECTION 16 — FOOTER

Minimal:

```text
HASDO
منظمة العمل الإنساني والتنمية المستدامة

[الرئيسية][من نحن][مجالات العمل][أين نعمل][مشاريعنا][الأثر][من الميدان][الموارد]

تواصل معنا — Facebook / Instagram / LinkedIn / YouTube ...

العربية | English

© HASDO 2026
سياسة الخصوصية · شروط الاستخدام
```

---

# SECTION 17 — THE CONTENT SYSTEM (CMS / DATA MODEL)

**Don't hardcode around today's four projects.** Build the data model so HASDO can
add projects without code changes.

### Organization
```text
name · description · mission · vision · logo · contact · social_links
```

### Area
```text
name_ar · name_en · description_ar · description_en · cover_image
```

### Project
```text
title_ar · title_en
area[] · state · location
status · start_date · end_date
description_ar · description_en
challenge · activities · results · impact
beneficiaries · volunteers · schools · communities
cover_image · gallery[]
documents[]
```

### Story
```text
title · project · location · date · author · content · images[]
```

### Resource
```text
title · type · date · file · category
```

The frontend becomes **a system**, not a collection of manually designed pages.

---

# SECTION 18 — THE SIGNATURE EXPERIENCE

## "Explore HASDO's work" — dedicated full-screen map

1. Sudan appears
2. Active states illuminate in blue
3. User clicks a state
4. Projects slide in from the side (state name, N مشاريع, project list with areas)
5. Click project → project information appears
6. User can return to the map

Communicates: **Geography → Work → Project → Impact** — the site's core story.

---

# SECTION 19 — DESIGN LANGUAGE

### Colors
- Primary: **HASDO blue from the logo**
- Secondary: **Deep navy / charcoal**
- Background: **Warm off-white**
- Supporting: **Soft blue-gray**
- No red as the primary geographic indicator.

### Typography
Arabic first. Test the logo against: **IBM Plex Sans Arabic · Noto Sans Arabic ·
Tajawal · Cairo**. Pick final family **after inspecting the actual logo lettering**;
pair with its closest English counterpart.

---

# SECTION 20 — RESPONSIVE DESIGN

- **Desktop:** large map, large photography, editorial layouts
- **Tablet:** two-column → one; map stays interactive but smaller
- **Mobile** (critical — most real users):

```text
Hero → Impact → Map → Areas → Projects → Stories → Volunteer → Resources
```

Map: **tap state → bottom sheet**, never a cramped desktop map on a 390px screen.

---

# SECTION 21 — WHAT WE DO NOT DO (BANNED)

❌ Stock-photo humanitarian clichés
❌ Giant "DONATE NOW" buttons everywhere
❌ Generic gradient blobs
❌ Glassmorphism
❌ Excessive rounded cards
❌ Fake statistics
❌ AI-generated people
❌ 15 different blue shades
❌ Huge mission paragraphs
❌ Generic "Together We Can Change The World" copy
❌ English-first layout with Arabic slapped onto it
❌ Animations that exist purely because CSS allows them

The website should feel **humanitarian but technically sophisticated**.

---

# SECTION 22 — THE FINAL SITE TREE

```text
HASDO
│
├── الرئيسية
│
├── من نحن
│   ├── من نحن
│   ├── رؤيتنا
│   ├── رسالتنا
│   ├── منهجيتنا
│   ├── قيمنا
│   └── فريقنا
│
├── مجالات العمل
│   ├── الشباب
│   ├── التعليم
│   └── تقوية روابط المجتمع
│
├── أين نعمل
│   ├── خريطة السودان
│   └── [ولاية]
│       └── مشاريع الولاية
│
├── مشاريعنا
│   ├── جميع المشاريع
│   └── [المشروع]
│
├── الأثر
│   ├── نظرة عامة
│   ├── حسب المجال
│   └── حسب الموقع
│
├── من الميدان
│   ├── القصص
│   ├── الأخبار والتحديثات
│   └── معرض الصور
│
├── الموارد
│   ├── التقارير
│   ├── المستندات
│   └── مركز التحميل
│
├── شركاؤنا
│
├── الشفافية والمساءلة
│
├── شارك معنا
│   ├── تطوع
│   └── شراكة
│
└── تواصل معنا
```

And underneath all of this:

**CMS → Projects → States → Areas → Impact → Stories → Resources**

---

## Content rollout note

The four known projects (إعمار المدارس، شباب من أجل التعليم، التدريب الحرفي للشباب،
ومشروع التعافي والدعم النفسي) become the **first real content records**, not the
permanent structure of the website. Full HASDO information and numbers populate this
architecture later; terminology then matches their official language.
