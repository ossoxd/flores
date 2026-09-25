export const KEY_ORDER = ['tami', 'coco', 'canelo', 'micky'];
// Center of the two-tile path leading into the upper-left clearing.
export const PEDESTAL_POSITION = { x: 1504, y: 650 };

const SLOTS = {
  tami: { x: -39, y: -82, w: 20, h: 22 },
  coco: { x: -15, y: -79, w: 16, h: 19 },
  canelo: { x: 13, y: -83, w: 14, h: 26 },
  micky: { x: 39, y: -80, w: 18, h: 20 }
};

export function createKeyPedestal(scene, state) {
  const { x, y } = PEDESTAL_POSITION;
  scene.add.image(x, y, 'key-podium').setOrigin(.5, 1)
    .setDisplaySize(52, 52).setDepth(y - 2);

  const pieces = {};
  for (const [index, id] of KEY_ORDER.entries()) {
    const slot = SLOTS[id];
    pieces[id] = scene.add.image(x + slot.x, y + slot.y, `key-${id}`)
      .setDisplaySize(slot.w, slot.h).setAngle(-90).setDepth(y - 1)
      .setVisible((state.placedFragments ?? []).includes(id) && !state.hasCompleteKey);
    scene.tweens.add({ targets: pieces[id], y: y + slot.y - 4,
      duration: 1050 + index * 95, delay: index * 130,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });
  }
  const complete = scene.add.image(x, y - 81, 'key-full')
    .setDisplaySize(31, 56).setAngle(-90).setDepth(y)
    .setVisible(Boolean(state.keyAssembled && !state.hasCompleteKey));
  const completeHover = scene.tweens.add({ targets: complete, y: y - 86,
    duration: 1250, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });
  const prompt = scene.add.text(x + 38, y - 15, 'Enter', {
    fontSize: '13px', color: '#3f2d1d', backgroundColor: '#fff7e8', padding: { x: 4, y: 2 }
  }).setOrigin(.5).setDepth(1050).setVisible(false).setInteractive({ useHandCursor: true });
  return {
    x, y, pieces, complete, prompt,
    isPlayerNearby: player => Math.hypot(player.x - x, player.y - y) < 95,
    showPiece: id => pieces[id].setVisible(true),
    hidePieces: () => KEY_ORDER.forEach(id => pieces[id].setVisible(false)),
    stopCompleteHover: () => completeHover.stop()
  };
}
