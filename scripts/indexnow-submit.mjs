// Submit all sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver, etc.)
// Usage: node scripts/indexnow-submit.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const keyFile = fs.readdirSync(root).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('No IndexNow key file found in site root.');
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, '');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const host = new URL((sitemap.match(/<loc>(https?:\/\/[^/]+)/) || [])[1]).host;
const keyLocation = `https://${host}/${keyFile}`;
const urlList = [...sitemap.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((m) => m[1]);

const payload = {
  host,
  key,
  keyLocation,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});
console.log(`IndexNow: ${res.status} ${res.statusText}`);
console.log(await res.text());
console.log(`Submitted ${urlList.length} URLs for ${host}`);
