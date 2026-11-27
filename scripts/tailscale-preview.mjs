import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { handleAi } from "./preview-ai-handler.mjs";

const host = process.env.INOVA_PREVIEW_HOST ?? "";
const port = Number(process.env.INOVA_PREVIEW_PORT ?? 4175);
const parts = host.split(".").map(Number);
if (!/^100\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) || parts[1] < 64 || parts[1] > 127 || parts.some((n) => n > 255) || !Number.isInteger(port) || port < 1024 || port > 65535)
  throw Error("Set INOVA_PREVIEW_HOST to this computer's Tailscale IPv4 address and use a valid port.");
const origin = `http://${host}:${port}`;
const root = resolve(fileURLToPath(new URL("../dist/", import.meta.url)));
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".json": "application/json", ".ico": "image/x-icon" };

createServer(async (request, response) => {
  if (request.headers.host !== `${host}:${port}`) { response.writeHead(403).end(); return; }
  const pathname = new URL(request.url, origin).pathname;
  if (pathname === "/api/local-ai") { await handleAi(request, response, origin); return; }
  if (request.method !== "GET" && request.method !== "HEAD") { response.writeHead(405).end(); return; }
  try {
    const path = resolve(root, `.${decodeURIComponent(pathname === "/" ? "/index.html" : pathname)}`);
    if (!path.startsWith(root + sep)) throw Error("Invalid path.");
    const content = await readFile(path);
    response.writeHead(200, { "Content-Type": mime[extname(path)] ?? "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch { response.writeHead(404).end(); }
}).listen(port, host, () => process.stdout.write(`Inova preview: ${origin}\n`));
