import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { resolveStaticRequest } from "../src/core/staticPaths.js";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 5173);
const defaultGeneratedRoot = process.env.USERPROFILE
  ? join(process.env.USERPROFILE, ".codex", "generated_images", "01a0c40f-b479-7102-8612-2eb0ea0d17a6")
  : null;
const generatedRoot = process.env.FLORES_GENERATED_ASSETS
  ? resolve(process.env.FLORES_GENERATED_ASSETS)
  : defaultGeneratedRoot;
const generatedFallbacks = {
  "/assets/custom/girlfriend/girlfriend-run-v2.png": "prepared-character/girlfriend-run-v2.png",
  "/assets/custom/girlfriend/girlfriend-idle-v2.png": "prepared-character/girlfriend-idle-v2.png",
  "/assets/custom/girlfriend/girlfriend-jump-v2.png": "prepared-character/girlfriend-jump-v2.png",
  "/assets/custom/girlfriend/girlfriend-run.png": "prepared-character/girlfriend-run.png",
  "/assets/custom/girlfriend/girlfriend-idle.png": "prepared-character/girlfriend-idle.png",
  "/assets/custom/girlfriend/girlfriend-jump.png": "prepared-character/girlfriend-jump.png",
  "/assets/custom/flowers/yellow-flower.png": "exec-034ffc47-cce2-499b-89b6-54dc2a2bc546.png",
  "/assets/custom/bouquet/bouquet.png": "exec-44d9c798-5483-4043-9212-61bede9382c0.png",
  "/assets/custom/bouquet/petal.png": "exec-dc3b5129-fd05-4f07-bad7-de99aeb7e7ed.png",
  "/assets/custom/ui/dialogue-panel.png": "exec-23f3fb1a-e488-42fc-9b14-d42be2a29d29.png"
};
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

createServer(async (request, response) => {
  try {
    const rawPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const requested = resolveStaticRequest(rawPath);
    let filePath = normalize(join(root, requested));
    if (!filePath.startsWith(root)) throw new Error("Ruta invÃ¡lida");
    let fileInfo;
    try {
      fileInfo = await stat(filePath);
    } catch (error) {
      const fallback = generatedRoot && generatedFallbacks[rawPath];
      if (!fallback) throw error;
      filePath = normalize(join(generatedRoot, fallback));
      if (!filePath.startsWith(generatedRoot)) throw new Error("Ruta fallback invÃ¡lida");
      fileInfo = await stat(filePath);
    }
    if (!fileInfo.isFile()) throw new Error("No es un archivo");
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("No encontrado");
  }
}).listen(port, "0.0.0.0", () => {
  console.log("Juego disponible en http://localhost:" + port);
});

