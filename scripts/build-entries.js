// ============================================================
// entries/ ディレクトリをスキャンして entries.json を生成する
// Usage: node scripts/build-entries.js
// ============================================================

const fs = require('fs');
const path = require('path');

const ENTRIES_DIR = path.join(__dirname, '..', 'entries');
const OUTPUT_FILE = path.join(__dirname, '..', 'viewer-fireworks', 'entries.json');

function buildEntries() {
  const dirs = fs.readdirSync(ENTRIES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const entries = [];

  for (const dir of dirs) {
    const sketchPath = path.join(ENTRIES_DIR, dir, 'sketch.js');
    if (!fs.existsSync(sketchPath)) continue;

    const code = fs.readFileSync(sketchPath, 'utf-8');

    // メタデータ抽出
    const titleMatch = code.match(/const\s+TITLE\s*=\s*["'`](.+?)["'`]/);
    const authorMatch = code.match(/const\s+AUTHOR\s*=\s*["'`](.+?)["'`]/);

    // アイコン検出
    const iconExtensions = ['png', 'jpg', 'gif', 'webp'];
    let icon = null;
    for (const ext of iconExtensions) {
      const iconPath = path.join(ENTRIES_DIR, dir, `icon.${ext}`);
      if (fs.existsSync(iconPath)) {
        icon = `icon.${ext}`;
        break;
      }
    }

    const entry = {
      id: dir,
      title: titleMatch ? titleMatch[1] : dir,
      author: authorMatch ? authorMatch[1] : 'Anonymous'
    };
    if (icon) entry.icon = icon;

    entries.push(entry);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(entries, null, 2));
  console.log(`Generated entries.json with ${entries.length} entries.`);
}

buildEntries();
