import { registerGardenFrames } from './createGardenMap.js';
import { createRomanticDetails } from './createRomanticDetails.js';
import { FINAL_ISLAND } from '../config/finalIsland.js';

export function createFinalIsland(scene) {
  registerGardenFrames(scene);
  const texture = 'autumn-tileset';
  for (let y = 0; y < 544; y += 32) for (let x = 0; x < 960; x += 32) {
    scene.add.image(x, y, texture, 'water').setOrigin(0).setScale(2).setDepth(-30);
  }
  const waves = scene.add.graphics().setDepth(-29);
  for (let i = 0; i < 85; i++) {
    const x = (i * 137 + 21) % 944, y = (i * 79 + 17) % 526;
    waves.fillStyle(0xd9ffe5, .55).fillRect(x, y, 12, 2);
    waves.fillStyle(0xadebdc, .6).fillRect(x + 4, y + 4, 6, 2);
  }
  scene.tweens.add({ targets: waves, alpha: .25, x: 4, duration: 2600, yoyo: true, repeat: -1 });

  const { land, centerX } = FINAL_ISLAND;
  for (let row = 0; row < land.rows; row++) for (let col = 0; col < land.columns; col++) {
    const sx = col === 0 ? 0 : col === land.columns - 1 ? 2 : 1;
    const sy = row === 0 ? 0 : row === land.rows - 1 ? 2 : 1;
    scene.add.image(land.x + col * 32, land.y + row * 32, texture, `shore-${sx}-${sy}`)
      .setOrigin(0).setScale(2).setDepth(-20);
  }
  for (const area of FINAL_ISLAND.paths) {
    for (let y = area.y; y < area.y + area.height; y += 32) {
      for (let x = area.x; x < area.x + area.width; x += 32) {
        scene.add.image(x, y, texture, 'path-fill')
          .setOrigin(0).setDisplaySize(32, 32).setDepth(-15);
      }
    }
  }
  createRomanticDetails(scene);

  // Mirrored tree groups frame the view without covering the pergola or flowers.
  for (const side of [-1, 1]) {
    for (const [distance, y, scale] of [[330, 186, 2.4], [218, 156, 2.2], [332, 454, 2.4]]) {
      scene.add.image(centerX + side * distance, y, texture, 'tree')
        .setOrigin(.5, 1).setScale(scale).setFlipX(side === 1).setDepth(y);
    }
  }
}
