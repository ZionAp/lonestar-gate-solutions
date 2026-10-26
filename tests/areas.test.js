import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const areasDir = path.join(root, 'areas');
const siteUrl = 'https://lonestargate.com';

const cities = [
  ['austin', 'Austin'],
  ['round-rock', 'Round Rock'],
  ['cedar-park', 'Cedar Park'],
  ['pflugerville', 'Pflugerville'],
  ['georgetown', 'Georgetown'],
  ['leander', 'Leander'],
  ['lakeway', 'Lakeway'],
  ['bee-cave', 'Bee Cave'],
  ['westlake-hills', 'Westlake Hills'],
  ['dripping-springs', 'Dripping Springs'],
  ['spicewood', 'Spicewood'],
  ['buda', 'Buda'],
  ['kyle', 'Kyle'],
  ['hutto', 'Hutto'],
  ['manor', 'Manor'],
  ['lago-vista', 'Lago Vista'],
  ['wimberley', 'Wimberley'],
  ['driftwood', 'Driftwood'],
  ['del-valle', 'Del Valle'],
  ['jollyville', 'Jollyville']
];

const read = (file) => fs.readFile(path.join(areasDir, file), 'utf8');
const domFor = (html, url) => new JSDOM(html, { url });

const titles = new Set();
const descriptions = new Set();

for (const [slug, city] of cities) {
  const html = await read(`${slug}.html`);
  const { document } = domFor(html, `${siteUrl}/areas/${slug}.html`).window;

  assert.equal(document.querySelectorAll('h1').length, 1, `${city} should have one h1`);
  assert.match(document.querySelector('h1').textContent, new RegExp(city), `${city} h1 should name the city`);
  assert.equal(document.documentElement.lang, 'en', `${city} should declare English`);
  assert.match(document.title, new RegExp(city), `${city} title should name the city`);
  assert.ok(document.title.length <= 65, `${city} title is ${document.title.length} characters`);
  assert.ok(!titles.has(document.title), `${city} title should be unique`);
  titles.add(document.title);

  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  assert.ok(description.length >= 120 && description.length <= 165, `${city} description is ${description.length} characters`);
  assert.ok(!descriptions.has(description), `${city} description should be unique`);
  descriptions.add(description);

  assert.equal(
    document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    `${siteUrl}/areas/${slug}.html`,
    `${city} canonical should match its URL`
  );

  const article = document.querySelector('article.prose');
  assert.ok(article, `${city} should have an article body`);
  const words = article.textContent.trim().split(/\s+/).filter(Boolean).length;
  assert.ok(words >= 500 && words <= 700, `${city} article has ${words} words (expected 500-700)`);
  assert.ok(article.textContent.includes(city), `${city} article should name the city`);

  const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map(script => JSON.parse(script.textContent));
  const types = schemas.map(schema => schema['@type']);
  for (const type of ['Service', 'BreadcrumbList', 'FAQPage']) {
    assert.ok(types.includes(type), `${city} should include ${type} structured data`);
  }

  const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
  assert.equal(ids.length, new Set(ids).size, `${city} should not contain duplicate ids`);
  assert.equal(document.querySelectorAll('[style]').length, 0, `${city} should not use inline style attributes`);

  for (const link of document.querySelectorAll('a[href^="#"]')) {
    const target = link.getAttribute('href').slice(1);
    assert.ok(document.getElementById(target), `${city} anchor #${target} should exist`);
  }

  for (const element of document.querySelectorAll('a[href], link[href], script[src], img[src]')) {
    const value = element.getAttribute('href') || element.getAttribute('src');
    if (!value || /^(?:https?:|mailto:|tel:|#)/.test(value)) continue;
    const [relative] = value.split(/[?#]/);
    if (!relative || relative.startsWith('//')) continue;
    const target = path.resolve(areasDir, decodeURIComponent(relative));
    await fs.access(target);
  }

  const serviceSchema = schemas.find(schema => schema['@type'] === 'Service');
  assert.equal(serviceSchema.areaServed.name, `${city}, TX`, `${city} schema areaServed should match`);
  assert.equal(serviceSchema.provider.telephone, '+17372654627', `${city} schema phone should match`);
  assert.equal(serviceSchema.provider.email, 'lonestargatesrepair@gmail.com', `${city} schema email should match`);
  assert.ok(html.includes('mailto:lonestargatesrepair@gmail.com'), `${city} should include the new email link`);
}

const hubHtml = await read('index.html');
const { document: hub } = domFor(hubHtml, `${siteUrl}/areas/`).window;
assert.equal(hub.querySelectorAll('h1').length, 1, 'Hub should have one h1');
assert.equal(hub.querySelector('link[rel="canonical"]')?.getAttribute('href'), `${siteUrl}/areas/`, 'Hub canonical should be /areas/');
assert.ok(hub.title.length <= 65, `Hub title is ${hub.title.length} characters`);
const hubDescription = hub.querySelector('meta[name="description"]')?.getAttribute('content') || '';
assert.ok(hubDescription.length >= 120 && hubDescription.length <= 165, `Hub description is ${hubDescription.length} characters`);

const hubSlugs = new Set(
  [...hub.querySelectorAll('.area-grid a')]
    .map(link => link.getAttribute('href'))
    .filter(href => href?.endsWith('.html'))
);
for (const [slug] of cities) {
  assert.ok(hubSlugs.has(`${slug}.html`), `Hub should link to ${slug}.html`);
}

const indexHtml = await fs.readFile(path.join(root, 'index.html'), 'utf8');
const { document: home } = domFor(indexHtml, `${siteUrl}/`).window;
assert.ok(home.querySelector('a[href="areas/index.html"]'), 'Homepage should link to the area hub');
assert.ok(home.querySelector('a[href="areas/austin.html"]'), 'Homepage footer should link to a city guide');
assert.ok(home.querySelector('#areaGuideLink'), 'Homepage should include the dynamic area guide link');

const sitemap = await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8');
assert.ok(sitemap.includes(`${siteUrl}/areas/`), 'Sitemap should include the area hub');
for (const [slug] of cities) {
  assert.ok(sitemap.includes(`${siteUrl}/areas/${slug}.html`), `Sitemap should include ${slug}.html`);
}

console.log(`Areas: ${cities.length} city guides + hub passed`);
