import { TILE, ISLANDS, BRIDGES, DECOR, isLand, isPath } from "./gardenLayout.js";
import { terrainColliders } from "./terrainGeometry.js";
import { bridgeCollisions } from "./bridgeCollisions.js";
import { waterTileDetails } from "./waterDetails.js";

const TEXTURE = "autumn-tileset";
export function registerGardenFrames(scene) {
  const texture = scene.textures.get(TEXTURE);
  const add = (name, x, y, w, h) => {
    if (!texture.has(name)) texture.add(name, 0, x, y, w, h);
  };
  // Original 192 x 192 atlas. Coordinates are native pixels, never enlarged-sheet estimates.
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
    add(`shore-${x}-${y}`, 64 + x * 16, 144 + y * 16, 16, 16);
  }
  add("water", 144, 144, 16, 16);
  add("tree", 0, 72, 48, 56);
  add("stump", 16, 128, 16, 16);
  add("log", 112, 96, 32, 16);
  add("rock", 144, 96, 16, 16);
  add("leaf", 112, 120, 16, 16);
  add("bridge-v", 0, 32, 32, 32);
  add("bridge-v-half", 0, 32, 32, 16);
  add("bridge-h", 56, 32, 16, 32);
  add("post", 48, 32, 8, 32);
  // Nine-slice path edges from the original 32 px path tile.
  const offsets = [0, 8, 24], sizes = [8, 16, 8];
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
    add(`path-${x}-${y}`, 64 + offsets[x], offsets[y], sizes[x], sizes[y]);
  }
  add("path-fill", 176, 48, 8, 16);
}

export function createGardenMap(scene, layout) {
  registerGardenFrames(scene);
  const obstacles = [];
  const solid = (x, y, w, h) => {
    const zone = scene.add.zone(x + w / 2, y + h / 2, w, h);
    scene.physics.add.existing(zone, true);
    obstacles.push(zone);
  };
  for (let y = 0; y < layout.world.height; y += 32) {
    for (let x = 0; x < layout.world.width; x += 32) {
      scene.add.image(x, y, TEXTURE, "water").setOrigin(0).setScale(2).setDepth(-30);
    }
  }
  const shoreline = scene.add.graphics().setDepth(-29);
  const ripples = [scene.add.graphics().setDepth(-28), scene.add.graphics().setDepth(-28)];
  const drawRipple = (graphics, px, py, tx, ty) => {
    const offsetX = 6 + (tx * 11 + ty * 3) % 12;
    const offsetY = 7 + (tx * 5 + ty * 7) % 14;
    graphics.fillStyle(0xcaffdf, .57).fillRect(px + offsetX, py + offsetY, 10, 2);
    graphics.fillStyle(0xa5edd8, .48).fillRect(px + offsetX + 3, py + offsetY + 4, 7, 2);
  };
  for (let y = 0; y < layout.world.height / TILE; y++) {
    for (let x = 0; x < layout.world.width / TILE; x++) {
      const detail = waterTileDetails(x, y, 0);
      if (!detail) continue;
      const px = x * TILE, py = y * TILE;
      shoreline.fillStyle(0xc5f7d0, .42);
      if (detail.shore.north) shoreline.fillRect(px + 4, py, 24, 4);
      if (detail.shore.east) shoreline.fillRect(px + 28, py + 4, 4, 24);
      if (detail.shore.south) shoreline.fillRect(px + 4, py + 28, 24, 4);
      if (detail.shore.west) shoreline.fillRect(px, py + 4, 4, 24);
      if (detail.wave) drawRipple(ripples[0], px, py, x, y);
      if (waterTileDetails(x, y, 2).wave) drawRipple(ripples[1], px, py, x, y);
    }
  }
  ripples[1].setAlpha(.15);
  scene.tweens.add({ targets: ripples[0], alpha: .15, duration: 2100, yoyo: true, repeat: -1 });
  scene.tweens.add({ targets: ripples[1], alpha: 1, duration: 2100, yoyo: true, repeat: -1 });
  for (const island of ISLANDS) {
    for (let y = 0; y < island.h; y++) for (let x = 0; x < island.w; x++) {
      const sx = x === 0 ? 0 : x === island.w - 1 ? 2 : 1;
      const sy = y === 0 ? 0 : y === island.h - 1 ? 2 : 1;
      scene.add.image((island.x + x) * TILE, (island.y + y) * TILE, TEXTURE, `shore-${sx}-${sy}`)
        .setOrigin(0).setScale(2).setDepth(-20);
    }
  }
  for (let y = 0; y < layout.world.height / TILE; y++) for (let x = 0; x < layout.world.width / TILE; x++) {
    if (!isPath(x, y) || !isLand(x, y)) continue;
    const left = !isPath(x - 1, y), right = !isPath(x + 1, y);
    const top = !isPath(x, y - 1), bottom = !isPath(x, y + 1);
    // Fill first, then thin irregular edges; adjacent cells meet without rounded overlaps.
    scene.add.image(x * TILE, y * TILE, TEXTURE, "path-fill").setOrigin(0).setDisplaySize(32, 32).setDepth(-15);
    if (left) scene.add.image(x * TILE, y * TILE, TEXTURE, "path-0-1").setOrigin(0).setDisplaySize(8, 32).setDepth(-14);
    if (right) scene.add.image(x * TILE + 24, y * TILE, TEXTURE, "path-2-1").setOrigin(0).setDisplaySize(8, 32).setDepth(-14);
    if (top) scene.add.image(x * TILE, y * TILE, TEXTURE, "path-1-0").setOrigin(0).setDisplaySize(32, 8).setDepth(-14);
    if (bottom) scene.add.image(x * TILE, y * TILE + 24, TEXTURE, "path-1-2").setOrigin(0).setDisplaySize(32, 8).setDepth(-14);
  }
  for (const r of terrainColliders()) solid(r.x, r.y, r.w, r.h);
  for (const b of BRIDGES) {
    for(const r of bridgeCollisions(b)) solid(r.x,r.y,r.w,r.h);
    const vertical = b.direction === "vertical";
    for (let i = 0; i < (vertical ? b.h : b.w); i += vertical ? 2 : 1) {
      scene.add.image((b.x + (vertical ? 0 : i)) * TILE, (b.y + (vertical ? i : 0)) * TILE,
        TEXTURE, vertical ? (b.h-i === 1 ? "bridge-v-half" : "bridge-v") : "bridge-h").setOrigin(0).setScale(2).setDepth(-5);
    }
    if (vertical) {
      // Finish on the bank, not with an abrupt repeated middle slice.
      for (const px of [b.x*TILE, (b.x+b.w)*TILE-16]) {
        scene.add.image(px, (b.y+b.h)*TILE-48, TEXTURE, "post")
          .setOrigin(0).setScale(2).setDepth(-4);
        solid(px, (b.y+b.h)*TILE-16, 16, 32);
      }
    } else {
      for (const px of [b.x, b.x + b.w - 0.5]) scene.add.image(px * TILE, b.y * TILE, TEXTURE, "post").setOrigin(0).setScale(2).setDepth(-4);
    }
  }
  const decor = DECOR.map(([kind, tx, ty]) => {
    const x = tx * TILE + 16, y = ty * TILE + 24;
    const sprite = scene.add.image(x, y, TEXTURE, kind).setOrigin(0.5, 1).setScale(2).setDepth(y);
    if (kind === "tree") solid(x - 16, y - 25, 32, 24);
    if (kind === "log") solid(x - 28, y - 25, 56, 24);
    if (kind === "rock" || kind === "stump") solid(x - 14, y - 21, 28, 20);
    if (kind === "leaf") sprite.setDepth(-10);
    return sprite;
  });
  return { obstacles, decor };
}
