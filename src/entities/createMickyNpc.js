import { MICKY } from '../config/micky.js';
import { isWithinInteractionRange } from './createRabbitNpc.js';

export function createMickyNpc(scene) {
  if (!scene.anims.exists('micky-idle-loop')) {
    scene.anims.create({ key: 'micky-idle-loop', repeat: -1, frameRate: 4,
      frames: [[0, 900], [0, 650], [1, 130], [0, 800], [2, 190], [0, 500], [3, 190], [0, 950]]
        .map(([frame, duration]) => ({ key: 'micky-idle', frame, duration })) });
  }
  if (!scene.anims.exists('micky-run-loop')) {
    scene.anims.create({ key: 'micky-run-loop', frames: scene.anims.generateFrameNumbers('micky-run', { start: 0, end: 7 }),
      frameRate: 12, repeat: -1 });
  }
  const sprite = scene.physics.add.staticSprite(MICKY.position.x, MICKY.position.y, 'micky-idle', 0)
    .setOrigin(.5, 63 / 64).setDepth(MICKY.position.y).setInteractive({ useHandCursor: true });
  sprite.refreshBody();
  sprite.body.setSize(24, 12).setOffset(20, 51);
  sprite.play('micky-idle-loop');
  return { sprite, isPlayerNearby: player => isWithinInteractionRange(player, sprite, 88) };
}
