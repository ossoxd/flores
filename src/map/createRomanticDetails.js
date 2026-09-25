import { FINAL_ISLAND } from '../config/finalIsland.js';

function decorateGround(scene) {
  const ground = scene.add.graphics().setDepth(-16);
  const colors = [0xffedb9, 0xffd776, 0xf7975d, 0xea7655];
  for (let i = 0; i < 170; i++) {
    const x = 94 + (i * 137 + i * i * 6) % 772;
    const y = 78 + (i * 97 + i * i * 2) % 390;
    // Leave the floral heart and central walkway easy to read.
    if (x > 328 && x < 632 && y < 280) continue;
    if (FINAL_ISLAND.paths.some(r => x > r.x - 8 && x < r.x + r.width + 8
      && y > r.y - 8 && y < r.y + r.height + 8)) continue;
    const px = Math.floor(x / 2) * 2, py = Math.floor(y / 2) * 2;
    ground.fillStyle(colors[i % colors.length], .8);
    if (i % 4 === 0) {
      ground.fillRect(px, py, 4, 6).fillRect(px + 2, py - 2, 4, 6);
      ground.fillStyle(0xffc46a).fillRect(px + 2, py, 2, 2);
    } else {
      ground.fillRect(px, py, 2, 2);
      if (i % 3 === 0) ground.fillRect(px + 2, py - 2, 2, 6).fillRect(px + 4, py, 2, 2);
    }
  }
}

function decoratePath(scene) {
  const paving = scene.add.graphics().setDepth(-13);
  for (const [areaIndex, area] of FINAL_ISLAND.paths.entries()) {
    for (let row = 0; row < area.height / 16; row++) {
      const offset = row % 2 * 16;
      for (let col = 0; col < area.width / 32; col++) {
        const x = area.x + col * 32 + offset + 2, y = area.y + row * 16 + 2;
        const width = Math.min(28, area.x + area.width - x - 2);
        if (width < 4) continue;
        paving.fillStyle((col + row + areaIndex) % 3 ? 0xffe9af : 0xf5d998, .7);
        paving.fillRect(x, y, width, 12);
        paving.fillStyle(0xfff0c3, .8).fillRect(x + 2, y, width - 4, 2);
        if ((col + row) % 3 === 0) {
          paving.fillStyle(0xd9b57d, .55).fillRect(x + 4, y + 12, width - 8, 2);
        }
      }
    }
  }
}

function addLantern(scene, x) {
  // The lantern sprite is 18 × 60: an integer scale preserves its chunky pixels.
  const glow = scene.add.graphics().setDepth(-7);
  glow.fillStyle(0xffe59b, .08).fillRect(x - 26, 176, 52, 54);
  glow.fillStyle(0xffefac, .14).fillRect(x - 16, 182, 32, 40);
  scene.tweens.add({ targets: glow, alpha: .5, duration: 1700, yoyo: true, repeat: -1 });
  const base = scene.add.graphics().setDepth(-9);
  base.fillStyle(0xd0a178).fillRect(x - 25, 276, 50, 10);
  base.fillStyle(0xffe9b4).fillRect(x - 25, 268, 50, 10);
  scene.add.image(x, 280, 'romantic-lantern').setOrigin(.5, 1).setScale(2).setDepth(280);
}

export function createRomanticDetails(scene) {
  const cx = FINAL_ISLAND.centerX;
  decorateGround(scene);
  decoratePath(scene);

  scene.add.image(cx, 292, 'romantic-pergola').setOrigin(.5, 1).setScale(2).setDepth(292);
  scene.add.image(cx, 192, 'romantic-heart').setScale(2).setDepth(291);

  for (const side of [-1, 1]) {
    const lampX = cx + side * 204;
    addLantern(scene, lampX);
    // Taller pots flank the lamps, with smaller companions on the inner side.
    scene.add.image(cx + side * 262, 272, 'romantic-pot')
      .setOrigin(.5, 1).setScale(2).setFlipX(side === 1).setDepth(272);
    scene.add.image(cx + side * 158, 276, 'romantic-pot')
      .setOrigin(.5, 1).setScale(1).setFlipX(side === -1).setDepth(276);

    // Curved beds frame the plaza; mixed low planters flank the entrance.
    scene.add.image(cx + side * 196, 374, 'romantic-curve')
      .setOrigin(.5, 1).setScale(2).setFlipX(side === 1).setDepth(380);
    scene.add.image(cx + side * 176, 448, 'romantic-row')
      .setOrigin(.5, 1).setScale(2).setFlipX(side === 1).setDepth(448);
    scene.add.image(cx + side * 124, 380, 'romantic-border')
      .setOrigin(.5, 1).setScale(1).setFlipX(side === 1).setDepth(380);
  }

  const motes = scene.add.graphics().setDepth(500);
  for (let i = 0; i < 18; i++) {
    const x = 206 + i * 113 % 550, y = 110 + i * 61 % 200;
    motes.fillStyle(i % 3 ? 0xfff6d7 : 0xffffff, .55).fillRect(x, y, 2, 2);
  }
  scene.tweens.add({ targets: motes, alpha: .15, y: -8, duration: 2800, yoyo: true, repeat: -1 });
}
