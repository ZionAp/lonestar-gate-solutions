import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const publicFiles = new Set(['index.html', 'favicon.ico', 'robots.txt', 'sitemap.xml']);
const publicDirs = new Set(['css', 'js', 'images']);

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com data:",
    "img-src 'self' data:",
    "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ')
};

function respond(res, status, message, headers = {}) {
  res.writeHead(status, {
    ...securityHeaders,
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
    ...headers
  });
  res.end(message);
}

function isContained(relativePath) {
  return relativePath !== '' &&
    relativePath !== '..' &&
    !relativePath.startsWith('..' + path.sep) &&
    !path.isAbsolute(relativePath);
}

async function resolvePublicFile(pathname) {
  const relative = pathname.replace(/^\/+/, '') || 'index.html';
  const segments = relative.split('/');

  if (segments.some(segment => segment.startsWith('.'))) return null;

  let candidate = path.resolve(root, relative);
  if (!isContained(path.relative(root, candidate))) return null;

  let stat;
  try {
    stat = await fs.stat(candidate);
  } catch {
    return null;
  }

  if (stat.isDirectory()) {
    candidate = path.join(candidate, 'index.html');
    try {
      stat = await fs.stat(candidate);
    } catch {
      return null;
    }
  }

  if (!stat.isFile()) return null;

  const relativeFile = path.relative(root, candidate);
  const fileSegments = relativeFile.split(path.sep);
  const topLevel = fileSegments[0];
  const isPublic = publicFiles.has(relativeFile) || publicDirs.has(topLevel);
  const hasType = Object.hasOwn(types, path.extname(candidate));
  const hasHiddenSegment = fileSegments.some(segment => segment.startsWith('.'));

  if (!isPublic || !hasType || hasHiddenSegment) return null;

  try {
    const realRoot = await fs.realpath(root);
    const realFile = await fs.realpath(candidate);
    if (!isContained(path.relative(realRoot, realFile))) return null;
  } catch {
    return null;
  }

  return candidate;
}

async function handleRequest(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return respond(res, 405, 'Method Not Allowed\n', { Allow: 'GET, HEAD' });
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return respond(res, 400, 'Bad Request\n');
  }

  if (pathname.includes('\0') || pathname.includes('\\')) {
    return respond(res, 400, 'Bad Request\n');
  }

  const filePath = await resolvePublicFile(pathname);
  if (!filePath) return respond(res, 404, 'Not Found\n');

  let data;
  try {
    data = await fs.readFile(filePath);
  } catch {
    return respond(res, 404, 'Not Found\n');
  }

  res.writeHead(200, {
    ...securityHeaders,
    'Content-Type': types[path.extname(filePath)],
    'Content-Length': data.length,
    'Cache-Control': 'no-cache'
  });
  res.end(data);
}

export function createServer() {
  return http.createServer((req, res) => {
    handleRequest(req, res).catch(() => {
      if (res.headersSent) {
        res.destroy();
      } else {
        respond(res, 500, 'Internal Server Error\n');
      }
    });
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const port = Number(process.env.PORT) || 8080;
  const host = process.env.HOST || '0.0.0.0';

  createServer().listen(port, host, () => {
    console.log(`Serving ${root} at http://localhost:${port}`);
  });
}
