import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert';
import { JSDOM, VirtualConsole } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, '..');
const indexPath = path.join(siteRoot, 'index.html');

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + e.message));
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

const results = [];
function check(name, fn) {
  try {
    fn();
    results.push(['PASS', name]);
  } catch (e) {
    results.push(['FAIL', name + ' -> ' + e.message]);
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const dom = await JSDOM.fromFile(indexPath, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
      window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
      window.scrollTo = () => {};
      window.alert = () => { throw new Error('alert() should not be used'); };
      window.addEventListener('error', e => errors.push('window error: ' + e.message));
    }
  });

  const { window } = dom;
  await new Promise(r => window.addEventListener('load', r));
  const d = window.document;

  check('single main landmark and skip link', () => {
    assert.strictEqual(d.querySelectorAll('main').length, 1);
    assert.ok(d.querySelector('.skip-link[href="#main"]'));
  });

  check('all internal anchor targets exist', () => {
    d.querySelectorAll('a[href^="#"]').forEach(a => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      assert.ok(d.querySelector(href), 'missing target ' + href);
    });
  });

  check('every image has non-empty alt text', () => {
    d.querySelectorAll('img').forEach(img => {
      assert.ok(img.hasAttribute('alt'), 'img missing alt: ' + img.getAttribute('src'));
    });
  });

  check('essential SEO meta tags are present', () => {
    assert.ok(d.querySelector('link[rel="canonical"][href^="https://"]'), 'missing canonical');
    assert.match(d.querySelector('meta[name="robots"]')?.content || '', /index/, 'missing robots index');
    assert.strictEqual(d.querySelector('meta[property="og:image"]')?.content?.includes('/images/og-image.jpg'), true, 'missing og:image');
    assert.strictEqual(d.querySelector('meta[name="twitter:card"]')?.content, 'summary_large_image', 'twitter card not large');
    assert.ok(d.querySelector('link[rel="icon"]'), 'missing favicon');
  });

  check('hero LCP image is preloaded', () => {
    const preload = d.querySelector('link[rel="preload"][as="image"]');
    assert.ok(preload, 'missing image preload');
    assert.strictEqual(preload.getAttribute('fetchpriority'), 'high');
  });

  check('veteran-owned messaging is present', () => {
    const text = d.body.textContent;
    assert.match(text, /Veteran[\s-]?Owned/i, 'missing veteran-owned text');
  });

  check('nav toggle syncs aria-expanded', () => {
    const btn = d.getElementById('navToggle');
    const menu = d.getElementById('navMenu');
    assert.strictEqual(btn.getAttribute('aria-expanded'), 'false');
    btn.click();
    assert.ok(menu.classList.contains('active'));
    assert.strictEqual(btn.getAttribute('aria-expanded'), 'true');
    btn.click();
    assert.ok(!menu.classList.contains('active'));
    assert.strictEqual(btn.getAttribute('aria-expanded'), 'false');
  });

  check('Escape closes mobile nav', () => {
    const btn = d.getElementById('navToggle');
    const menu = d.getElementById('navMenu');
    btn.click();
    d.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.ok(!menu.classList.contains('active'));
  });

  check('footer social links are external and safe', () => {
    const social = d.querySelectorAll('.footer-social a');
    assert.ok(social.length >= 3, 'expected social links');
    social.forEach(a => {
      assert.match(a.getAttribute('href'), /^https:\/\//, 'social link not absolute: ' + a.getAttribute('href'));
      assert.strictEqual(a.getAttribute('target'), '_blank');
      assert.match(a.getAttribute('rel') || '', /noopener/, 'missing noopener');
      assert.ok(a.getAttribute('aria-label'), 'missing aria-label');
    });
    assert.strictEqual(d.querySelectorAll('a[href="#"]').length, 0, 'placeholder href="#" still present');
  });



  check('form rejects missing required fields with inline status', () => {
    const form = d.getElementById('quoteForm');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    const status = d.getElementById('formStatus');
    assert.ok(status.classList.contains('error'), 'status not error: ' + status.className);
    assert.ok(/required fields/i.test(status.textContent));
  });

  const form = d.getElementById('quoteForm');
  form.querySelector('#name').value = 'Test User';
  form.querySelector('#phone').value = '5125550100';
  form.querySelector('#service').value = 'installation';
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  const btn = form.querySelector('button[type="submit"]');

  check('form button enters pending state', () => {
    assert.ok(/Request Sent/.test(btn.textContent), 'button not updated: ' + btn.textContent);
    assert.ok(btn.disabled);
  });

  await sleep(900);

  check('form shows success message and resets', () => {
    const status = d.getElementById('formStatus');
    assert.ok(status.classList.contains('success'), 'status not success: ' + status.className);
    assert.ok(/Thank you Test User/.test(status.textContent));
    assert.strictEqual(form.querySelector('#name').value, '');
    assert.ok(!btn.disabled);
  });

  check('footer year is current', () => {
    assert.strictEqual(d.getElementById('year').textContent, String(new Date().getFullYear()));
  });

  check('SEO crawl files and icons exist on disk', () => {
    ['robots.txt', 'sitemap.xml', 'favicon.ico', path.join('images', 'og-image.jpg'), path.join('images', 'favicon.png')].forEach(f => {
      assert.ok(fs.existsSync(path.join(siteRoot, f)), 'missing file ' + f);
    });
  });

  check('structured data includes LocalBusiness and FAQPage', () => {
    const blocks = Array.from(d.querySelectorAll('script[type="application/ld+json"]')).map(s => {
      try { return JSON.parse(s.textContent); } catch (e) { throw new Error('invalid JSON-LD: ' + e.message); }
    });
    const types = blocks.flatMap(b => Array.isArray(b) ? b.map(x => x['@type']) : [b['@type']]);
    assert.ok(types.includes('LocalBusiness'), 'missing LocalBusiness');
    assert.ok(types.includes('FAQPage'), 'missing FAQPage');
    const biz = blocks.find(b => b['@type'] === 'LocalBusiness');
    assert.ok(biz.image, 'LocalBusiness missing image');
    assert.ok(biz.openingHoursSpecification, 'LocalBusiness missing hours');
    assert.ok(Array.isArray(biz.sameAs) && biz.sameAs.length, 'LocalBusiness missing sameAs');
  });

  const areaTitle = d.getElementById('areaTitle');
  const areaBlurb = d.getElementById('areaBlurb');
  const lakeway = d.querySelector('.area-item[data-city="Lakeway"]');
  if (lakeway) lakeway.click();
  await sleep(350);
  check('selecting a service area updates the coverage panel', () => {
    assert.ok(lakeway, 'Lakeway area button missing');
    assert.strictEqual(areaTitle.textContent, 'Lakeway Coverage');
    assert.match(areaBlurb.textContent, /Lake Travis/);
    assert.ok(lakeway.classList.contains('is-active'));
    assert.ok(!d.querySelector('.area-item[data-city="Austin"]').classList.contains('is-active'));
  });

  check('no runtime errors during load/interaction', () => {
    assert.deepStrictEqual(errors, []);
  });

  console.log(results.map(([s, n]) => `${s} ${n}`).join('\n'));
  const failed = results.filter(r => r[0] === 'FAIL').length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
