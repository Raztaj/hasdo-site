/*
 * prepare-map.mjs
 * Downloads Sudan admin-1 (state) boundaries from HDX COD-AB (OCHA, CC BY-IGO),
 * keeps the 18 official states with Arabic/English names, and writes a compact
 * FeatureCollection to public/data/sudan-states.json.
 *
 * Usage: npm run map
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'data');
const OUT_FILE = path.join(OUT_DIR, 'sudan-states.json');
const OUT_KH = path.join(OUT_DIR, 'sdn-khartoum-localities.json');
const OUT_MAP = path.join(OUT_DIR, 'sudan-map.json');

// HDX COD-AB Sudan — GeoJSON resource (dataset a66a4b6c-92de-4507-9546-aa1900474180)
const DOWNLOAD = 'https://data.humdata.org/dataset/a66a4b6c-92de-4507-9546-aa1900474180/resource/018af991-4aa7-4043-a0d5-e429a55851fb/download/sdn_admin_boundaries.geojson.zip';

// Official 18 states keyed by English admin-1 name (Arabic name preserved from the data).
const OFFICIAL = new Set([
  'Khartoum', 'Aj Jazirah', 'Blue Nile', 'Central Darfur', 'East Darfur',
  'Gedaref', 'Kassala', 'North Darfur', 'North Kordofan', 'Northern',
  'Red Sea', 'River Nile', 'Sennar', 'South Darfur', 'South Kordofan',
  'West Darfur', 'West Kordofan', 'White Nile',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Downloading Sudan boundaries from HDX…');
  const res = await fetch(DOWNLOAD, { headers: { 'user-agent': 'hasdo-map-prep' } });
  if (!res.ok) throw new Error('Download failed: ' + res.status + ' ' + res.statusText);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log('Got', (buf.length / 1024).toFixed(0), 'KB (zip)');

  const zip = new AdmZip(buf);
  const entries = zip.getEntries();
  const findEntry = (re) => entries.find((e) => re.test(e.entryName));
  const admin1Entry = findEntry(/admin1\.geojson$/i) ?? findEntry(/admin1\.(json|geojson)$/i);
  const admin2Entry = findEntry(/admin2\.geojson$/i) ?? findEntry(/admin2\.(json|geojson)$/i);

  // الولايات من ملف ADM1 (لا من ADM2 الذي يمثل المحليات)
  const fc = JSON.parse(zip.readAsText(admin1Entry));
  console.log('Source adm1 has', fc.features.length, 'features');

  const seen = new Set();
  const features = [];
  for (const f of fc.features) {
    const p = f.properties || {};
    const nameEn = p.adm1_name || p.NAME_1 || p.name || '';
    if (!OFFICIAL.has(nameEn)) continue;
    if (seen.has(nameEn)) continue;
    seen.add(nameEn);
    features.push({
      type: 'Feature',
      properties: {
        code: p.adm1_pcode || p.ADM1_PCODE || ('SD-' + nameEn),
        name_ar: p.adm1_name1 || p.NAME_1_AR || nameEn,
        name_en: nameEn,
      },
      geometry: f.geometry,
    });
  }

  if (features.length !== 18) {
    console.warn('WARNING: expected 18 states, got', features.length);
    console.warn('Missing:', [...OFFICIAL].filter((n) => !seen.has(n)));
  }

  const out = { type: 'FeatureCollection', name: 'sudan-states', crs: fc.crs, features };
  fs.writeFileSync(OUT_FILE, JSON.stringify(out));
  console.log('Wrote', OUT_FILE, '(' + (fs.statSync(OUT_FILE).size / 1024).toFixed(0), 'KB /', features.length, 'states)');

  // محليات الخرطوم (Admin 2) — يظهر عليها تفصيل في الخريطة
  if (admin2Entry) {
    const fc2 = JSON.parse(zip.readAsText(admin2Entry));
    const khLocalities = fc2.features
      .filter((f) => (f.properties || {}).adm1_name === 'Khartoum')
      .map((f) => {
        const p = f.properties;
        return {
          type: 'Feature',
          properties: {
            code: p.adm2_pcode,
            name_ar: p.adm2_name1 || p.adm2_name,
            name_en: p.adm2_name,
          },
          geometry: f.geometry,
        };
      });
    console.log('Khartoum (adm2) found:', khLocalities.length, 'localities');

    if (khLocalities.length > 0) {
      fs.writeFileSync(OUT_KH, JSON.stringify({ type: 'FeatureCollection', name: 'sdn-khartoum-localities', features: khLocalities }));
      console.log('Wrote', OUT_KH, '(' + (fs.statSync(OUT_KH).size / 1024).toFixed(0), 'KB /', khLocalities.length, 'localities)');
      console.log('  localities:', khLocalities.map((f) => f.properties.name_ar).join('، '));
    } else {
      console.warn('No Khartoum localities found');
    }
  }

  // مسارات معروضة مسبقاً — إسقاط يدوي مبسط (أرقام ثابتة عبر البيئات) بدل d3
  // في المتصفح؛ يُكتب مرة واحدة هنا وتُستورد كـ JSON.
  const MERCIER = { width: 520, height: 600 };
  const PAD = 24;
  const DEG = 180 / Math.PI;
  const R2 = (n) => Math.round(n * 100) / 100;
  const merc = (lat) => DEG * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  const merciers = (fc, w, h, pad = PAD) => {
    let lonMin = 1e9, lonMax = -1e9, latMin = 1e9, latMax = -1e9;
    for (const f of fc.features) {
      const nums = JSON.stringify(f.geometry).match(/-?\d+(?:\.\d+)?/g).map(Number);
      for (let i = 0; i + 1 < nums.length; i += 2) {
        lonMin = Math.min(lonMin, nums[i]); lonMax = Math.max(lonMax, nums[i]);
        latMin = Math.min(latMin, nums[i + 1]); latMax = Math.max(latMax, nums[i + 1]);
      }
    }
    const yTop = merc(latMax), yBot = merc(latMin);
    const sx = (w - 2 * pad) / (lonMax - lonMin);
    const sy = (h - 2 * pad) / (yTop - yBot);
    return {
      sx, sy, lonMin, latMax,
      yTop, // قاعدة الإسقاط
      project(lon, lat) {
        return [pad + (lon - lonMin) * sx, pad + (yTop - merc(lat)) * sy];
      },
    };
  };

  const toPath = (fc, proj) =>
    fc.features
      .map((f) => {
        const out = [];
        const walk = (o) => {
          if (Array.isArray(o) && typeof o[0] === 'number') out.push(proj.project(o[0], o[1]));
          else if (Array.isArray(o)) for (const c of o) walk(c);
        };
        walk(f.geometry.coordinates);
        if (!out.length) return null;
        // أقصى حلقة خارجية لتثبيت النقطة الداخلية (نقطة/ملصق) — centroid تقريبي
        let cx = 0, cy = 0;
        for (const p of out) { cx += p[0]; cy += p[1]; }
        cx /= out.length; cy /= out.length;
        let d = `M${R2(out[0][0])},${R2(out[0][1])}`;
        for (let i = 1; i < out.length; i++) d += `L${R2(out[i][0])},${R2(out[i][1])}`;
        return { d, cx: R2(cx), cy: R2(cy) };
      })
      .filter(Boolean);

  try {
    const pw = merciers(out, MERCIER.width, MERCIER.height);
    const states = out.features.map((f, i) => {
      const p = toPath({ type: 'FeatureCollection', features: [f] }, pw)[0];
      return { code: f.properties.code, name_ar: f.properties.name_ar, ...p };
    });

    const localities = [];
    if (admin2Entry) {
      const fc2 = JSON.parse(zip.readAsText(admin2Entry));
      const kh = fc2.features.filter((f) => (f.properties || {}).adm1_name === 'Khartoum');
      const lp = merciers({ type: 'FeatureCollection', features: kh }, MERCIER.width, MERCIER.height);
      for (const f of kh) {
        const p = toPath({ type: 'FeatureCollection', features: [f] }, lp)[0];
        const isEven = f.properties.adm1_name === 'Khartoum';
        localities.push({ code: f.properties.adm2_pcode, name_ar: f.properties.adm2_name1 || f.properties.adm2_name, ...p });
      }
    }

    fs.writeFileSync(OUT_MAP, JSON.stringify({ ...MERCIER, states, localities }));
    console.log('Wrote', OUT_MAP, `(states ${states.length}, localities ${localities.length})`);
  } catch (e) {
    console.warn('Skipping precomputed map paths:', e.message);
  }
}

/** tiny standalone zip reader fallback if adm-zip missing */
async function _zipFallback() {
  console.error('Install adm-zip first: npm i -D adm-zip');
  process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });