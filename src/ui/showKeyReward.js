// Screen-space ceremony with deterministic phases and self-contained cleanup.
export function showKeyReward(scene, id, onClosed = () => {}) {
  const assembly = id === 'full';
  const root = scene.add.container(0, 0).setScrollFactor(0).setDepth(1900);
  const dim = scene.add.rectangle(480, 270, 960, 540, 0x080d22, 0);
  const light = scene.add.graphics(), motes = scene.add.graphics();
  const flash = scene.add.rectangle(480, 270, 960, 540, 0xfff5d9, 0);
  const hero = scene.add.image(480, -130, `key-${id}`).setAlpha(0);
  const baseScale = assembly
    ? Math.min(140 / hero.height, 100 / hero.width)
    : Math.min(180 / hero.width, 190 / hero.height);
  hero.setScale(baseScale).setAngle(assembly ? -90 : 0);
  const title = scene.add.text(480, 397, assembly ? 'LLAVE COMPLETA' : 'LLAVE CONSEGUIDA', {
    fontFamily: 'Georgia, serif', fontSize: '30px', color: '#fff1c8',
    stroke: '#292440', strokeThickness: 4, letterSpacing: 4
  }).setOrigin(.5).setAlpha(0);
  root.add([dim, light, motes, hero]);
  const parts = assembly ? ['tami', 'coco', 'canelo', 'micky'].map(part => {
    const sprite = scene.add.image(480, 226, `key-${part}`).setAlpha(0);
    sprite.setScale(Math.min(86 / sprite.width, 100 / sprite.height));
    root.add(sprite);
    return sprite;
  }) : [];
  root.add([flash, title]);
  const started = scene.time.now;
  const impactAt = assembly ? 3100 : 2150;
  const endAt = impactAt + 3150;
  const smooth = value => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
  const pixel = value => Math.round(value / 2) * 2;
  let finished = false;
  const cleanup = () => {
    if (finished) return;
    finished = true;
    scene.events.off('update', render);
    scene.events.off('shutdown', cleanup);
    root.destroy(true);
  };
  const render = () => {
    const ms = scene.time.now - started, t = ms / 1000;
    const entry = smooth(ms / 650), after = Math.max(0, ms - impactAt);
    root.setAlpha(1 - smooth((ms - endAt + 650) / 650));
    dim.setFillStyle(0x080d22, entry * .88);
    light.clear(); motes.clear();
    // Layered moonlight opens from above, before the fragment becomes visible.
    for (let layer = 6; layer >= 1; layer--) {
      const w = (18 + layer * 24) * entry;
      light.fillStyle(0xbbdfff, .012 + (7 - layer) * .006);
      light.fillRect(pixel(480 - w / 2), 0, pixel(w), 300);
    }
    const power = after ? .8 + Math.sin(t * 2) * .1 : smooth(ms / impactAt) * .55;
    for (let ring = 7; ring >= 1; ring--) {
      light.fillStyle(ring % 2 ? 0xb3caff : 0xffe7a0, power * .018);
      light.fillCircle(480, 226, 27 + ring * 17 + Math.sin(t * 1.7) * 3);
    }
    for (let ray = 0; ray < 10; ray++) {
      const a = ray * Math.PI / 5 + t * .085;
      const length = 155 + Math.sin(ray * 7) * 45 + (after ? 40 : 0);
      light.fillStyle(ray % 2 ? 0xc8dcff : 0xffe3a1, power * .13);
      light.fillTriangle(480 + Math.cos(a) * 37, 226 + Math.sin(a) * 37,
        480 + Math.cos(a - .055) * length, 226 + Math.sin(a - .055) * length,
        480 + Math.cos(a + .055) * length, 226 + Math.sin(a + .055) * length);
    }
    for (let i = 0; i < 62; i++) {
      const phase = (t * (24 + i % 5 * 8) + i * 41) % 360;
      const x = 480 + Math.sin(i * 9.7 + t * .35) * (50 + i % 7 * 25), y = 405 - phase;
      const alpha = Math.sin(phase / 360 * Math.PI) * entry * .75;
      const size = i % 5 === 0 ? 4 : 2;
      motes.fillStyle(i % 3 ? 0xffe7a0 : 0xb8dfff, alpha);
      motes.fillRect(pixel(x), pixel(y), size, size);
      if (i % 5 === 0) {
        motes.fillRect(pixel(x - 3), pixel(y + 1), 10, 2);
        motes.fillRect(pixel(x + 1), pixel(y - 3), 2, 10);
      }
    }
    if (assembly && ms < impactAt) {
      const merge = smooth((ms - 1700) / 1400);
      parts.forEach((part, i) => {
        const angle = i * Math.PI / 2 + t * .7, r = 160 * (1 - merge);
        part.setPosition(480 + Math.cos(angle) * r, 226 + Math.sin(angle) * r * .65)
          .setAlpha(entry * (1 - smooth((ms - impactAt + 200) / 200)))
          .setAngle(Math.sin(t + i) * 6 * (1 - merge));
      });
      hero.setAlpha(0);
    } else {
      parts.forEach(part => part.setVisible(false));
      const descent = smooth((ms - 450) / (impactAt - 450));
      hero.setPosition(480, assembly ? 226 : -100 + descent * 326);
      hero.setAlpha(assembly ? smooth(after / 250) : smooth((ms - 400) / 550));
      if (after) hero.y = 226 + Math.sin(after / 600) * 5;
      hero.setScale(baseScale * (1 + (after ? Math.exp(-after / 190) * .12 : 0)));
    }
    flash.setFillStyle(0xfff5d9, after > 0 && after < 400 ? .6 * (1 - after / 400) : 0);
    if (after > 0) {
      const burst = Math.min(1, after / 1250);
      for (let i = 0; i < 36; i++) {
        const a = i * Math.PI * 2 / 36, r = 30 + Math.pow(burst, .65) * (170 + i % 4 * 18);
        motes.fillStyle(i % 2 ? 0xffe09a : 0xe1efff, (1 - burst) * .95);
        motes.fillRect(pixel(480 + Math.cos(a) * r), pixel(226 + Math.sin(a) * r + burst * burst * 55), 4, 4);
      }
    }
    title.setAlpha(smooth((after - 220) / 600)).setY(407 - smooth((after - 220) / 600) * 10);
    if (ms >= endAt) { cleanup(); onClosed(); }
  };
  scene.events.on('update', render);
  scene.events.once('shutdown', cleanup);
  render();
}
