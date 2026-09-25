import { CANELO } from '../config/canelo.js';
import { isWithinInteractionRange } from './createRabbitNpc.js';

export function createCaneloNpc(scene) {
  const key = 'canelo-idle';
  if (!scene.textures.exists(key)) {
    const image = scene.textures.get('canelo-source').getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Only edge-connected black is background; nose and eyes stay intact.
    const seen = new Uint8Array(canvas.width * canvas.height);
    const queue = new Int32Array(seen.length);
    let head = 0, tail = 0;
    const add = n => {
      if (n < 0 || n >= seen.length || seen[n]) return;
      const p = n * 4;
      if (pixels.data[p + 3] && Math.max(...pixels.data.subarray(p, p + 3)) > 22) return;
      seen[n] = 1; queue[tail++] = n;
    };
    for (let x = 0; x < canvas.width; x++) { add(x); add((canvas.height - 1) * canvas.width + x); }
    for (let y = 0; y < canvas.height; y++) { add(y * canvas.width); add(y * canvas.width + canvas.width - 1); }
    while (head < tail) {
      const n = queue[head++], x = n % canvas.width;
      pixels.data[n * 4 + 3] = 0;
      if (x) add(n - 1);
      if (x < canvas.width - 1) add(n + 1);
      add(n - canvas.width); add(n + canvas.width);
    }
    ctx.putImageData(pixels, 0, 0);
    const sheet = scene.textures.createCanvas(key, 8 * 64, 64);
    sheet.context.imageSmoothingEnabled = false;
    for (let i = 0; i < 8; i++) {
      const x0 = Math.round(i % 4 * canvas.width / 4), x1 = Math.round((i % 4 + 1) * canvas.width / 4);
      const y0 = Math.round(Math.floor(i / 4) * canvas.height / 2), y1 = Math.round((Math.floor(i / 4) + 1) * canvas.height / 2);
      let left = x1, right = x0, top = y1, bottom = y0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
        if (pixels.data[(y * canvas.width + x) * 4 + 3] < 100) continue;
        left = Math.min(left, x); right = Math.max(right, x);
        top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
      const w = right - left + 1, h = bottom - top + 1;
      if (w > 0 && h > 0) {
        sheet.context.drawImage(canvas, left, top, w, h, i * 64 + 10, 12, 44, 48);
      }
      sheet.add(i, 0, i * 64, 0, 64, 64);
    }
    sheet.refresh();
  }
  createCaneloDialoguePortraits(scene);
  if (!scene.anims.exists(key)) scene.anims.create({ key, repeat: -1, frameRate: 8,
    frames: [[0, 700], [1, 220], [4, 220], [1, 220], [0, 600], [2, 140], [0, 500], [5, 320], [6, 200], [0, 500]]
      .map(([frame, duration]) => ({ key, frame, duration })) });
  const sprite = scene.physics.add.staticSprite(CANELO.position.x, CANELO.position.y, key, 0)
    .setOrigin(.5, 60 / 64).setDepth(CANELO.position.y).setInteractive({ useHandCursor: true });
  sprite.refreshBody(); sprite.body.setSize(26, 14).setOffset(19, 48);
  sprite.play(key);
  return { sprite, isPlayerNearby: player => isWithinInteractionRange(player, sprite, 88) };
}

function createCaneloDialoguePortraits(scene) {
  if (scene.textures.exists('canelo-portraits')) return;
  const image = scene.textures.get('canelo-dialogue-source').getSourceImage();
  const source = document.createElement('canvas');
  source.width = image.width;
  source.height = image.height;
  const context = source.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, source.width, source.height);
  const { data, width, height } = pixels;
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(seen.length);
  let head = 0, tail = 0;
  const add = n => {
    if (n < 0 || n >= seen.length || seen[n]) return;
    const p = n * 4;
    if (data[p + 3] > 20 && Math.max(data[p], data[p + 1], data[p + 2]) > 28) return;
    seen[n] = 1;
    queue[tail++] = n;
  };
  for (let x = 0; x < width; x++) { add(x); add((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { add(y * width); add(y * width + width - 1); }
  while (head < tail) {
    const n = queue[head++], x = n % width;
    data[n * 4 + 3] = 0;
    if (x) add(n - 1);
    if (x < width - 1) add(n + 1);
    add(n - width);
    add(n + width);
  }
  context.putImageData(pixels, 0, 0);
  const texture = scene.textures.createCanvas('canelo-portraits', 6 * 128, 128);
  texture.context.imageSmoothingEnabled = false;
  for (let frame = 0; frame < 6; frame++) {
    const sx = Math.round((frame % 3) * width / 3);
    const sy = Math.round(Math.floor(frame / 3) * height / 2);
    const sw = Math.round((frame % 3 + 1) * width / 3) - sx;
    const sh = Math.round((Math.floor(frame / 3) + 1) * height / 2) - sy;
    texture.context.drawImage(source, sx, sy, sw, sh, frame * 128, 0, 128, 128);
    texture.add(frame, 0, frame * 128, 0, 128, 128);
  }
  texture.refresh();
}
