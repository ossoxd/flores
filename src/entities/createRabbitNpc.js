export function isWithinInteractionRange(player, rabbit, range = 86) {
  return Math.hypot(player.x - rabbit.x, player.y - rabbit.y) <= range;
}

export function createRabbitNpc(scene, position) {
  const animationKey = "rabbit-idle-down";
  if (!scene.anims.exists(animationKey)) {
    scene.anims.create({
      key: animationKey,
      frames: scene.anims.generateFrameNumbers("rabbit", { start: 4, end: 7 }),
      frameRate: 3,
      repeat: -1
    });
  }

  const sprite = scene.physics.add.staticSprite(position.x, position.y, "rabbit", 0)
    .setScale(2)
    .setOrigin(0.5, 1)
    .setDepth(4);
  sprite.play(animationKey);
  sprite.refreshBody();
  sprite.body.setSize(24, 14).setOffset(20, 46);

  return {
    sprite,
    isPlayerNearby(player, range = 86) {
      return isWithinInteractionRange(player, sprite, range);
    }
  };
}
