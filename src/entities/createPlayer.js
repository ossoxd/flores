import { jumpPose } from "../core/characterMotion.js";
import { normalizeCharacterSheet } from "./normalizeCharacterSheet.js";
const ROWS = { down: 0, left: 1, right: 2, up: 3 };

export function createPlayer(scene, position) {
  const runTexture = normalizeCharacterSheet(scene, "girlfriend-run", 16);
  const idleTexture = normalizeCharacterSheet(scene, "girlfriend-idle", 16);
  for (const [direction, row] of Object.entries(ROWS)) {
    const animations = [
      { key: `run-${direction}`, texture: runTexture, frames: 4, frameRate: 8, repeat: -1 },
      { key: `idle-${direction}`, texture: idleTexture, frames: 4, frameRate: 3, repeat: -1 },
      { key: `jump-${direction}`, texture: "girlfriend-jump", frames: 3, frameRate: 8, repeat: 0 }
    ];
    for (const animation of animations) {
      if (scene.anims.exists(animation.key)) continue;
      scene.anims.create({
        key: animation.key,
        frames: scene.anims.generateFrameNumbers(animation.texture, {
          start: row * animation.frames,
          end: row * animation.frames + (animation.count || animation.frames) - 1
        }),
        frameRate: animation.frameRate,
        repeat: animation.repeat
      });
    }
  }
  const player = scene.physics.add.sprite(position.x, position.y, "girlfriend-idle", 0).setScale(0.22).setOrigin(0.5, 240/256).setVisible(false);
  player.body.setSize(64, 32).setOffset(96, 208);
  player.visual = scene.add.sprite(position.x, position.y, idleTexture, 0).setOrigin(0.5, 240/256).setScale(0.22);
  player.shadow = scene.add.ellipse(position.x, position.y - 2, 21, 8, 0x593b34, 0.24);
  player.jumpStarted = null;
  player.setCollideWorldBounds(true);
  player.lastDirection = "down";
  player.visual.play("idle-down");
  const syncVisual = () => {
    const elapsed = player.jumpStarted === null ? 0 : scene.time.now - player.jumpStarted;
    const pose = jumpPose(elapsed);
    const height = player.jumpStarted === null ? 0 : pose.height;
    if (player.jumpStarted !== null) {
      player.visual.anims.stop();
      player.visual.setTexture("girlfriend-jump", ROWS[player.lastDirection]*3+pose.frame);
      if (pose.finished) {
        player.jumpStarted = null;
        animatePlayer(player, player.body.velocity.x, player.body.velocity.y);
      }
    }
    player.visual.setPosition(player.x, player.y - height).setDepth(player.y + 1);
    player.shadow.setPosition(player.x, player.y - 2).setDepth(player.y - 1).setScale(1 - height / 90);
  };
  scene.events.on("postupdate", syncVisual);
  scene.events.once("shutdown", () => scene.events.off("postupdate", syncVisual));
  return player;
}

export function animatePlayer(player, x, y) {
  if (player.jumpStarted !== null) return;
  if (x || y) {
    player.lastDirection = Math.abs(x) > Math.abs(y) ? (x < 0 ? "left" : "right") : (y < 0 ? "up" : "down");
    player.visual.play(`run-${player.lastDirection}`, true);
  } else {
    player.visual.play(`idle-${player.lastDirection}`, true);
  }
}
