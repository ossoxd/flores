import { KEY_DOOR_POSITION } from '../map/gardenLayout.js';

const PORTAL_COLORS = [0x090d63, 0x1823a6, 0x5325c8, 0x9b35e6, 0x176de0, 0x27c6f4, 0xa3f8ff];

export function createMagicDoor(scene, onEnter) {
  const { x, y } = KEY_DOOR_POSITION;
  const sprite = scene.add.sprite(x, y, 'magic-door', 0)
    .setOrigin(0.5, 1).setDisplaySize(84, 112).setDepth(y + 2);
  const portal = scene.add.graphics().setDepth(y + 3);
  const collision = scene.add.zone(x, y - 13, 74, 30);
  scene.physics.add.existing(collision, true);
  const hint = scene.add.text(x, y + 25, '', {
    fontSize: '12px', color: '#4a3426', backgroundColor: '#fff7e8', padding: { x: 5, y: 3 }
  }).setOrigin(.5).setDepth(1050).setVisible(false).setInteractive({ useHandCursor: true });
  let openness = 0;
  let portalTime = 0;
  let open = false;
  let enabled = false;
  let travelling = false;
  const tryEnter = () => {
    if (travelling || !enabled || openness < 6.85 || !scene.state.hasCompleteKey
      || Math.hypot(scene.player.x - x, scene.player.y - y) > 88) return false;
    travelling = true;
    hint.setVisible(false);
    onEnter();
    return true;
  };
  scene.physics.add.collider(scene.player, collision, tryEnter);
  hint.on('pointerup', tryEnter);

  return {
    sprite,
    tryEnter,
    update(player, delta, canInteract = true) {
      enabled = canInteract;
      const distance = Math.hypot(player.x - x, player.y - y);
      hint.setVisible(enabled && !travelling && distance < 98)
        .setText(scene.state.hasCompleteKey ? 'Enter' : 'Necesitas la llave completa');
      if (!open && distance < 110) open = true;
      else if (open && distance > 136) open = false;

      openness = Phaser.Math.Clamp(openness + (open ? 1 : -1) * delta / 85, 0, 7);
      sprite.setFrame(Math.round(openness));
      portal.clear();
      if (openness < 6.85) return;

      portalTime += delta * 0.003;
      for (let row = 0; row < 18; row++) {
        const ry = -78 + row * 4;
        const halfWidth = row < 3 ? 9 + row * 3 : 18;
        for (let rx = -halfWidth; rx < halfWidth; rx += 4) {
          const angle = Math.atan2(row - 9, rx * 0.52);
          const radius = Math.hypot(rx * 0.52, row - 9);
          const wave = Math.sin(angle * 2.3 + radius * 0.65 - portalTime * 3.4);
          const colorIndex = Phaser.Math.Clamp(Math.floor((wave + 1) * 2.6 + (9 - radius) * 0.13), 0, PORTAL_COLORS.length - 1);
          portal.fillStyle(PORTAL_COLORS[colorIndex], 1).fillRect(x + rx, y + ry, 4, 4);
        }
      }
      for (let i = 0; i < 5; i++) {
        const sx = x + Math.round(Math.sin(portalTime * 1.4 + i * 2.5) * 12);
        const sy = y - 17 - ((portalTime * 22 + i * 17) % 58);
        portal.fillStyle(i % 2 ? 0xffffff : 0xb7f7ff, 1).fillRect(sx, sy, 2, 2);
      }
    }
  };
}
