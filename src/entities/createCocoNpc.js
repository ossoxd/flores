import { COCO } from '../config/coco.js';
import { isWithinInteractionRange } from './createRabbitNpc.js';

export function createCocoNpc(scene) {
  const textureKey = 'coco-idle-aligned';
  if (!scene.textures.exists(textureKey)) {
    const image = scene.textures.get('coco-source').getSourceImage();
    const source = document.createElement('canvas');
    source.width = image.width;
    source.height = image.height;
    const sourceContext = source.getContext('2d', { willReadFrequently: true });
    sourceContext.imageSmoothingEnabled = false;
    sourceContext.drawImage(image, 0, 0);
    const pixels = sourceContext.getImageData(0, 0, source.width, source.height).data;
    // Every pose uses one scale and one foot line, keeping Coco's size steady.
    const bounds = [];
    for (let index = 0; index < 12; index += 1) {
      const x0 = Math.round((index % 4) * image.width / 4);
      const x1 = Math.round(((index % 4) + 1) * image.width / 4);
      const y0 = Math.round(Math.floor(index / 4) * image.height / 3);
      const y1 = Math.round((Math.floor(index / 4) + 1) * image.height / 3);
      let left = x1, right = x0, top = y1, bottom = y0;
      for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) {
        if (pixels[(y * source.width + x) * 4 + 3] < 96) continue;
        left = Math.min(left, x); right = Math.max(right, x);
        top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
      bounds.push({ left, right, top, bottom });
    }
    const base = bounds[0];
    const baseWidth = base.right - base.left + 1;
    const baseHeight = base.bottom - base.top + 1;
    const scale = Math.min(48 / baseHeight, 34 / baseWidth);
    const drawWidth = Math.round(baseWidth * scale);
    const drawHeight = Math.round(baseHeight * scale);
    const drawX = Math.round((64 - drawWidth) / 2);
    const drawY = 60 - drawHeight;
    const texture = scene.textures.createCanvas(textureKey, 64 * 18, 64);
    texture.context.imageSmoothingEnabled = false;

    for (let index = 0; index < 18; index += 1) {
      const { left, right, top, bottom } = bounds[index % 12];
      if (right >= left && bottom >= top) {
        const width = right - left + 1;
        const height = bottom - top + 1;
        const lift = index >= 12 ? 1 : 0;
        texture.context.drawImage(source, left, top, width, height,
          index * 64 + drawX, drawY - lift, drawWidth, drawHeight);
        if (lift) {
          // Repaint paws at their resting position; only the top breathes.
          texture.context.save();
          texture.context.beginPath();
          texture.context.rect(index * 64, 46, 64, 18);
          texture.context.clip();
          texture.context.drawImage(source, base.left, base.top, baseWidth, baseHeight,
            index * 64 + drawX, drawY, drawWidth, drawHeight);
          texture.context.restore();
        }
      }
      texture.add(index, 0, index * 64, 0, 64, 64);
    }
    texture.refresh();
  }

  if (!scene.anims.exists('coco-idle')) {
    const sequence = [[0, 420], [12, 460], [0, 320], [1, 220], [13, 360],
      [0, 460], [2, 180], [14, 360], [0, 520], [1, 220], [13, 360], [0, 440]];
    scene.anims.create({ key: 'coco-idle', frameRate: 10, repeat: -1,
      frames: sequence.map(([frame, duration]) => ({ key: textureKey, frame, duration })) });
  }

  const sprite = scene.physics.add.staticSprite(COCO.position.x, COCO.position.y, textureKey, 0)
    .setOrigin(0.5, 60 / 64).setDepth(COCO.position.y);
  sprite.refreshBody();
  sprite.body.setSize(24, 14).setOffset(20, 48);
  sprite.play('coco-idle');
  sprite.setInteractive({ useHandCursor: true });
  return { sprite, isPlayerNearby: player => isWithinInteractionRange(player, sprite, 88) };
}
