/*
 * HASDO site build
 * Stitches src/pages/*.html with partials and writes the site to dist/.
 *
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

const header = fs.readFileSync(path.join(SRC, 'partials', 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(SRC, 'partials', 'footer.html'), 'utf8');

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });

// Copy static assets
for (const dir of ['css', 'js']) {
  const from = path.join(SRC, 'assets', dir);
  fs.cpSync(from, path.join(DIST, 'assets', dir), { recursive: true });
}

// Any other top-level static dirs of src/assets are copied too
if (fs.existsSync(path.join(SRC, 'assets'))) {
  for (const entry of fs.readdirSync(path.join(SRC, 'assets'))) {
    const from = path.join(SRC, 'assets', entry);
    if (entry === 'css' || entry === 'js') continue;
    fs.cpSync(from, path.join(DIST, 'assets', entry), { recursive: true });
  }
}

const pagesDir = path.join(SRC, 'pages');
const pages = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'));

for (const file of pages) {
  let html = fs.readFileSync(path.join(pagesDir, file), 'utf8');

  const activeMatch = html.match(/<!--\s*active:\s*([a-z0-9-]+)\s*-->/);
  const active = activeMatch ? activeMatch[1] : '';

  const titleMatch = html.match(/<!--\s*title:\s*(.+?)\s*-->/);
  const title = titleMatch ? titleMatch[1] : '';

  html = html
    .replace('{{HEADER}}', header.replace('__TITLE__', title))
    .replace('{{FOOTER}}', footer);

  // Activate the matching nav token, drop the rest
  html = html.replace(new RegExp('\\{\\{ACTIVE:' + active + '\\}\\}', 'g'), ' is-active');
  html = html.replace(/\{\{ACTIVE:[^}]*\}\}/g, '');

  fs.writeFileSync(path.join(DIST, file), html);
  console.log('built ' + file);
}

console.log('Done. Site at ' + DIST);