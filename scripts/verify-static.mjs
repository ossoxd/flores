import { access, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const requiredProjectFiles = [
  "index.html",
  "src/main.js",
  "src/styles.css",
  "src/config/gameConfig.js",
  "public/assets/carrot-island/carrot island - free pack/carrot island - free pack/tileset/autumn.png",
  "public/assets/carrot-island/carrot island - free pack/carrot island - free pack/character/bunnyidle.png",
  "public/assets/carrot-island/carrot island - free pack/carrot island - free pack/character/bunnyrun.png"
];

const customAssets = [
  ["public/assets/custom/girlfriend/girlfriend-run-v2.png", "prepared-character/girlfriend-run-v2.png"],
  ["public/assets/custom/girlfriend/girlfriend-idle-v2.png", "prepared-character/girlfriend-idle-v2.png"],
  ["public/assets/custom/girlfriend/girlfriend-jump-v2.png", "prepared-character/girlfriend-jump-v2.png"],
  ["public/assets/custom/flowers/yellow-flower.png", "exec-034ffc47-cce2-499b-89b6-54dc2a2bc546.png"],
  ["public/assets/custom/bouquet/bouquet.png", "exec-44d9c798-5483-4043-9212-61bede9382c0.png"],
  ["public/assets/custom/bouquet/petal.png", "exec-dc3b5129-fd05-4f07-bad7-de99aeb7e7ed.png"],
  ["public/assets/custom/ui/dialogue-panel.png", "exec-23f3fb1a-e488-42fc-9b14-d42be2a29d29.png"]
];

const fallbackRoot = process.env.FLORES_GENERATED_ASSETS
  ? resolve(process.env.FLORES_GENERATED_ASSETS)
  : process.env.USERPROFILE
    ? join(process.env.USERPROFILE, ".codex", "generated_images", "01a0c40f-b479-7102-8612-2eb0ea0d17a6")
    : null;

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

for (const file of requiredProjectFiles) {
  await access(file);
}

for (const [projectPath, fallbackPath] of customAssets) {
  if (await exists(projectPath)) continue;
  if (!fallbackRoot || !(await exists(join(fallbackRoot, fallbackPath)))) {
    throw new Error(`Falta el asset personalizado: ${projectPath}`);
  }
}

const sourceFiles = (await readdir("src", { recursive: true }))
  .filter((file) => file.endsWith(".js"))
  .map((file) => join("src", file));

for (const file of sourceFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status || 1);
  }
}

console.log(
  `Proyecto estático verificado: ${sourceFiles.length} módulos, ${requiredProjectFiles.length} archivos base y ${customAssets.length} assets personalizados.`
);
