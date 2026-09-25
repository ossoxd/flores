import { MAX } from '../config/max.js';
import { isWithinInteractionRange } from './createRabbitNpc.js';

export function createMaxNpc(scene) {
  if (!scene.anims.exists('max-idle-loop')) {
    scene.anims.create({
      key: 'max-idle-loop',
      frames: scene.anims.generateFrameNumbers('max-idle', { start: 0, end: 15 }),
      frameRate: 8, repeat: -1
    });
  }
  if (!scene.anims.exists('max-walk-loop')) {
    scene.anims.create({
      key: 'max-walk-loop',
      frames: scene.anims.generateFrameNumbers('max-walk', { start: 0, end: 15 }),
      frameRate: 12, repeat: -1
    });
  }
  const sprite = scene.physics.add.staticSprite(MAX.position.x, MAX.position.y, 'max-idle', 0)
    .setOrigin(.5, 61 / 64).setScale(.82).setDepth(MAX.position.y).setInteractive({ useHandCursor: true });
  sprite.refreshBody();
  sprite.body.setSize(21, 11).setOffset(16, 39);
  sprite.play('max-idle-loop');
  return { sprite, isPlayerNearby: player => isWithinInteractionRange(player, sprite, 88) };
}
