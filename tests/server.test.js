import assert from 'node:assert/strict';
import http from 'node:http';
import { createServer } from './server.js';

const results = [];

async function check(name, fn) {
  try {
    await fn();
    results.push(['PASS', name]);
  } catch (e) {
    results.push(['FAIL', name + ' -> ' + e.message]);
  }
}

function request(port, rawPath, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: rawPath, method }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf8')
        });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

const server = createServer();
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const { port } = server.address();

try {
  await check('serves index.html at /', async () => {
    const res = await request(port, '/');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /^text\/html/);
    assert.match(res.body, /LoneStar Gate Solutions/);
  });

  await check('serves css and js with correct content types', async () => {
    const css = await request(port, '/css/style.css');
    const js = await request(port, '/js/main.js');
    assert.equal(css.status, 200);
    assert.match(css.headers['content-type'], /^text\/css/);
    assert.equal(js.status, 200);
    assert.match(js.headers['content-type'], /^application\/javascript/);
  });

  await check('sets security headers', async () => {
    const res = await request(port, '/');
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
    assert.equal(res.headers['x-frame-options'], 'DENY');
    assert.equal(res.headers['referrer-policy'], 'strict-origin-when-cross-origin');
    assert.match(res.headers['permissions-policy'], /camera=\(\)/);

    const csp = res.headers['content-security-policy'];
    assert.ok(csp, 'missing content-security-policy');
    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /frame-ancestors 'none'/);
    assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  });

  await check('serves SEO crawl files and images', async () => {
    const robots = await request(port, '/robots.txt');
    assert.equal(robots.status, 200);
    assert.match(robots.headers['content-type'], /^text\/plain/);
    assert.match(robots.body, /Sitemap:/);

    const sitemap = await request(port, '/sitemap.xml');
    assert.equal(sitemap.status, 200);
    assert.match(sitemap.headers['content-type'], /xml/);
    assert.match(sitemap.body, /<urlset/);

    const og = await request(port, '/images/og-image.jpg');
    assert.equal(og.status, 200);
    assert.match(og.headers['content-type'], /^image\/jpeg/);

    const icon = await request(port, '/favicon.ico');
    assert.equal(icon.status, 200);
  });

  await check('serves self-hosted fonts with correct type', async () => {
    const res = await request(port, '/fonts/inter-latin.woff2');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /^font\/woff2/);
    assert.ok(Number(res.headers['content-length']) > 0);
  });

  await check('CSP no longer allows external font/style origins', async () => {
    const res = await request(port, '/');
    const csp = res.headers['content-security-policy'];
    assert.doesNotMatch(csp, /fonts\.googleapis\.com/);
    assert.doesNotMatch(csp, /fonts\.gstatic\.com/);
    assert.doesNotMatch(csp, /cdnjs\.cloudflare\.com/);
    assert.match(csp, /font-src 'self' data:/);
  });

  await check('sets sensible cache headers', async () => {
    const html = await request(port, '/');
    assert.match(html.headers['cache-control'], /no-cache/);

    const woff = await request(port, '/fonts/inter-latin.woff2');
    assert.match(woff.headers['cache-control'], /immutable/);

    const img = await request(port, '/images/gallery/IMG-20261021-WA0047-thumb.webp');
    assert.match(img.headers['cache-control'], /immutable/);

    const css = await request(port, '/css/style.css');
    assert.match(css.headers['cache-control'], /max-age=604800/);
  });

  await check('returns 404 for missing files', async () => {
    const res = await request(port, '/does-not-exist.html');
    assert.equal(res.status, 404);
  });

  await check('does not crash on malformed URL encoding', async () => {
    const bad = await request(port, '/%E0%A4%A');
    assert.equal(bad.status, 400);
    const after = await request(port, '/');
    assert.equal(after.status, 200);
  });

  await check('rejects NUL bytes', async () => {
    const res = await request(port, '/%00');
    assert.equal(res.status, 400);
  });

  await check('blocks directory traversal', async () => {
    for (const p of ['/../package.json', '/%2e%2e/package.json', '/css/../../package.json']) {
      const res = await request(port, p);
      assert.ok(res.status === 404 || res.status === 400, `${p} returned ${res.status}`);
    }
  });

  await check('does not expose project internals', async () => {
    const paths = [
      '/package.json',
      '/package-lock.json',
      '/.npmrc',
      '/.gitignore',
      '/tests/server.js',
      '/node_modules/jsdom/package.json'
    ];

    for (const p of paths) {
      const res = await request(port, p);
      assert.equal(res.status, 404, `${p} returned ${res.status}`);
    }
  });

  await check('rejects non-GET/HEAD methods', async () => {
    const res = await request(port, '/', 'POST');
    assert.equal(res.status, 405);
    assert.equal(res.headers.allow, 'GET, HEAD');
  });

  await check('supports HEAD without a body', async () => {
    const res = await request(port, '/', 'HEAD');
    assert.equal(res.status, 200);
    assert.equal(res.body, '');
  });

  await check('does not list directories', async () => {
    const res = await request(port, '/images/gallery/');
    assert.equal(res.status, 404);
  });
} finally {
  await new Promise(resolve => server.close(resolve));
}

console.log(results.map(([status, name]) => `${status} ${name}`).join('\n'));
const failed = results.filter(([status]) => status === 'FAIL').length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
