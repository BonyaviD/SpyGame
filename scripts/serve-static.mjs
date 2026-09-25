// Serves the static site from `nuxt generate` (.output/public) like Netlify does:
// "/setup" → setup/index.html, unknown paths → 404.html with a 404 status.
// Used by the E2E tests so they run against exactly what gets deployed.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../.output/public/", import.meta.url).pathname.replace(/^\/(\w:)/, "$1");
const PORT = Number(process.env.PORT ?? 3100);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain",
};

const tryRead = (path) => readFile(join(ROOT, normalize(path))).catch(() => null);

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const candidates = extname(path) ? [path] : [join(path, "index.html"), `${path}.html`];

  for (const candidate of candidates) {
    const body = await tryRead(candidate);
    if (body) {
      res.writeHead(200, {
        "content-type": TYPES[extname(candidate)] ?? "application/octet-stream",
      });
      res.end(body);
      return;
    }
  }
  res.writeHead(404, { "content-type": TYPES[".html"] });
  res.end((await tryRead("404.html")) ?? "Not found");
}).listen(PORT, () => console.log(`Serving .output/public on http://localhost:${PORT}`));
