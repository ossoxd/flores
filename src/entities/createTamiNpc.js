import { TAMI } from '../config/tami.js';
import { isWithinInteractionRange } from './createRabbitNpc.js';

export function createTamiNpc(scene) {
  // A shared scale and paw baseline keep the twelve poses planted in place.
  if (!scene.textures.exists('tami-idle-sheet')) {
    const image = scene.textures.get('tami-sheet').getSourceImage();
    const source = document.createElement('canvas');
    source.width = image.width;
    source.height = image.height;
    const context = source.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, source.width, source.height).data;
    const poses = Array.from({ length: 12 }, (_, index) => {
    const x0 = Math.round((index % 4) * image.width / 4);
    const x1 = Math.round((index % 4 + 1) * image.width / 4);
    const y0 = Math.round(Math.floor(index / 4) * image.height / 3);
    const y1 = Math.round((Math.floor(index / 4) + 1) * image.height / 3);
    let left = x1, right = x0, top = y1, bottom = y0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      if (pixels[(y * source.width + x) * 4 + 3] < 128) continue;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
    let pawLeft = right, pawRight = left;
    for (let y = bottom - 22; y <= bottom; y++) for (let x = left; x <= right; x++) {
      if (pixels[(y * source.width + x) * 4 + 3] < 128) continue;
      pawLeft = Math.min(pawLeft, x); pawRight = Math.max(pawRight, x);
    }
    return { left, top, width: right - left + 1, height: bottom - top + 1, center: (pawLeft + pawRight) / 2 };
    });
    const scale = Math.min(54 / Math.max(...poses.map(p => p.height)),
      30 / Math.max(...poses.map(p => Math.max(p.center - p.left, p.left + p.width - p.center))));
    const texture = scene.textures.createCanvas('tami-idle-sheet', 64 * 12, 64);
    texture.context.imageSmoothingEnabled = false;
    poses.forEach((pose, index) => {
      const height = Math.round(pose.height * scale);
      texture.context.drawImage(source, pose.left, pose.top, pose.width, pose.height,
        index * 64 + Math.round(32 - (pose.center - pose.left) * scale), 62 - height,
        Math.round(pose.width * scale), height);
      texture.add(index, 0, index * 64, 0, 64, 64);
    });
    // The high-tail source poses also blink. Keep one deliberate blink while
    // using the open-eyed head on the other two high-tail poses.
    const head = document.createElement('canvas');
    head.width = 34; head.height = 36;
    const headContext = head.getContext('2d');
    for (const [target, neutral] of [[2, 0], [10, 8]]) {
      headContext.clearRect(0, 0, 34, 36);
      headContext.drawImage(texture.canvas, neutral * 64 + 14, 0, 34, 36, 0, 0, 34, 36);
      texture.context.clearRect(target * 64 + 14, 0, 34, 36);
      texture.context.drawImage(head, target * 64 + 14, 0);
    }
    texture.refresh();
  }
  if (!scene.anims.exists('tami-idle')) {
    // Each wag climbs from low to high and returns through the middle pose.
    // One brief blink and a short rest make the cycle feel alive, not frantic.
    const sequence = [[0,240],[1,150],[2,190],[1,150],[3,280],
      [0,240],[1,150],[2,190],[1,150],[0,300],
      [4,220],[5,150],[6,160],[5,150],[7,360],
      [8,260],[9,150],[10,190],[9,150],[11,500],[0,850]];
    scene.anims.create({ key: 'tami-idle', frameRate: 10, repeat: -1,
      frames: sequence.map(([frame, duration]) => ({ key: 'tami-idle-sheet', frame, duration: duration - 100 })) });
  }
  const sprite = scene.physics.add.staticSprite(TAMI.position.x, TAMI.position.y, 'tami-idle-sheet', 0)
    .setOrigin(0.5, 62 / 64).setDepth(TAMI.position.y);
  sprite.refreshBody();
  sprite.body.setSize(24, 14).setOffset(20, 48);
  sprite.play('tami-idle');
  scene.tweens.add({
    targets: sprite,
    scaleY: 1.035,
    duration: 1450,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: -1
  });
  return { sprite, isPlayerNearby: player => isWithinInteractionRange(player, sprite, 86) };
}
