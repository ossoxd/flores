import { MICKY, MICKY_RACE as C } from '../config/micky.js';
import { createRaceState, startRace, tapRace, advanceRace } from '../core/mickyRace.js';
import { DialogueBox } from '../ui/DialogueBox.js';

const START = 142;
const WORLD_WIDTH = START + C.distance + 170;
const CAT_Y = 292;
const ANTO_Y = 398;

export class MickyRaceScene extends globalThis.Phaser.Scene {
  constructor() { super('micky-race'); }

  create() {
    this.race = createRaceState();
    this.returning = false;
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 540).setRoundPixels(true);
    this.drawTrack();
    this.cat = this.add.sprite(START, CAT_Y, 'micky-run', 0).setOrigin(.5, 63 / 64)
      .setScale(1.5).setDepth(30);
    this.anto = this.add.sprite(START, ANTO_Y, 'girlfriend-run-aligned', 8)
      .setOrigin(.5, 240 / 256).setScale(.38).setDepth(31);
    this.catShadow = this.add.ellipse(START, CAT_Y + 1, 65, 10, 0x5a392d, .23).setDepth(18);
    this.antoShadow = this.add.ellipse(START, ANTO_Y + 1, 48, 9, 0x5a392d, .23).setDepth(18);
    if (!this.anims.exists('micky-run-loop')) this.anims.create({ key: 'micky-run-loop',
      frames: this.anims.generateFrameNumbers('micky-run', { start: 0, end: 7 }), frameRate: 12, repeat: -1 });
    this.cat.play('micky-run-loop').anims.pause();
    this.anto.play('run-right').anims.pause();
    this.drawHud();
    this.dialogue = new DialogueBox(this, () => this.showReward());
    this.keys = this.input.keyboard.addKeys('SPACE,ENTER,ESC');
    this.intro = this.add.container(480, 244).setScrollFactor(0).setDepth(100);
    this.intro.add(this.add.rectangle(0, 0, 540, 180, 0xfff0d1).setStrokeStyle(5, 0x955c3a));
    this.intro.add(this.label(0, -53, 'CARRERA CONTRA MICKY', 25).setOrigin(.5));
    this.intro.add(this.label(0, 3, 'Haz click lo más rápido que puedas\npara correr.', 19)
      .setAlign('center').setOrigin(.5));
    this.introButton = this.button(480, 309, '¡EMPEZAR!', () => this.countDown(), 210);
    this.introButton.box.setDepth(120); this.introButton.text.setDepth(121);
    this.countText = this.label(480, 224, '', 74).setOrigin(.5).setScrollFactor(0).setDepth(120).setVisible(false);
    this.events.once('shutdown', () => {
      this.input.keyboard.resetKeys();
      this.tweens.killAll();
      this.time.removeAllEvents();
    });
  }

  label(x, y, value, size = 20, color = '#593b35') {
    return this.add.text(x, y, value, { fontFamily: 'Tami Minecraft, monospace',
      fontSize: `${size}px`, color, align: 'center', lineSpacing: 5 });
  }

  button(x, y, value, action, width = 190, height = 55) {
    const box = this.add.rectangle(x, y, width, height, 0xffe6ad)
      .setStrokeStyle(4, 0x8f523b).setScrollFactor(0).setDepth(100)
      .setInteractive({ useHandCursor: true });
    const text = this.label(x, y, value, 22).setOrigin(.5).setScrollFactor(0).setDepth(101);
    box.on('pointerdown', action);
    box.on('destroy', () => text.destroy());
    return { box, text, setVisible: visible => { box.setVisible(visible); text.setVisible(visible); } };
  }

  drawTrack() {
    const g = this.add.graphics();
    g.fillStyle(0x87d9c2).fillRect(0, 0, WORLD_WIDTH, 540);
    g.fillStyle(0xb9edcd).fillRect(0, 110, WORLD_WIDTH, 92);
    g.fillStyle(0x5dc4b4).fillRect(0, 125, WORLD_WIDTH, 10);
    for (let x = 20; x < WORLD_WIDTH; x += 84) {
      g.fillStyle(x % 3 ? 0xd1f1ce : 0xe0f5cb).fillRect(x, 172, 38, 4);
      g.fillStyle(0xffffff, .32).fillRect(x + 12, 80, 26, 3);
    }
    g.fillStyle(0xdfaa75).fillRect(0, 214, WORLD_WIDTH, 256);
    g.fillStyle(0xffd79c).fillRect(0, 225, WORLD_WIDTH, 224);
    g.fillStyle(0xc98562).fillRect(0, 236, WORLD_WIDTH, 7);
    g.fillStyle(0xc98562).fillRect(0, 344, WORLD_WIDTH, 6);
    g.fillStyle(0xc98562).fillRect(0, 447, WORLD_WIDTH, 7);
    for (let x = 28; x < WORLD_WIDTH; x += 63) {
      g.fillStyle(0xf4bd83).fillRect(x, 263, 20, 3).fillRect(x + 18, 369, 17, 3);
      g.fillStyle(0xf7e4af).fillRect(x + 32, 322, 8, 3).fillRect(x + 7, 423, 8, 3);
    }
    g.fillStyle(0x8d5945).fillRect(START - 13, 203, 6, 257)
      .fillRect(START + C.distance, 203, 7, 257);
    g.fillStyle(0xffffff).fillRect(START - 8, 211, 19, 15)
      .fillRect(START + C.distance - 10, 211, 25, 17);
    for (let y = 236; y < 448; y += 16) {
      g.fillStyle(y % 32 ? 0x493936 : 0xffffff).fillRect(START + C.distance - 9, y, 17, 16);
    }
    g.fillStyle(0x92725a).fillRect(0, 470, WORLD_WIDTH, 70);
    g.fillStyle(0x4ac8ad).fillRect(0, 487, WORLD_WIDTH, 53);
    for (let x = 35; x < WORLD_WIDTH; x += 115) {
      g.fillStyle(0x64d6b5).fillRect(x, 501, 38, 4);
    }
  }

  drawHud() {
    this.add.rectangle(480, 31, 452, 32, 0xffedc8, .95).setStrokeStyle(3, 0xa56c4e)
      .setScrollFactor(0).setDepth(85);
    this.add.rectangle(480, 31, 410, 10, 0xcda782).setScrollFactor(0).setDepth(86);
    this.catProgress = this.add.rectangle(275, 25, 0, 5, 0x504447).setOrigin(0, 0)
      .setScrollFactor(0).setDepth(87);
    this.playerProgress = this.add.rectangle(275, 33, 0, 5, 0xf27879).setOrigin(0, 0)
      .setScrollFactor(0).setDepth(87);
    this.add.rectangle(480, 500, 960, 80, 0x477d68, .35).setScrollFactor(0).setDepth(80);
    this.runButton = this.button(480, 493, '¡CORRER!', () => this.tap(), 258, 57);
    this.runButton.setVisible(false);
    this.closeButton = this.button(917, 32, '×', () => this.leave(), 54, 42);
    this.closeButton.text.setFontSize(30);
    this.quip = this.label(740, 160, '', 18).setOrigin(.5).setScrollFactor(0).setDepth(90).setVisible(false);
  }

  countDown() {
    if (this.race.phase !== 'INTRO') return;
    this.race = { ...this.race, phase: 'COUNTDOWN' };
    this.intro.destroy(); this.introButton.box.destroy();
    this.countElapsed = 0;
    this.countText.setText('3').setVisible(true);
  }

  tap() {
    if (this.race.phase !== 'RACING') return;
    this.race = tapRace(this.race);
    const dust = this.add.rectangle(this.anto.x - 25, ANTO_Y - 7, 5, 5, 0xffefc1).setDepth(24);
    this.tweens.add({ targets: dust, x: dust.x - 28, y: dust.y - 12, alpha: 0,
      duration: 360, onComplete: () => dust.destroy() });
  }

  update(_time, delta) {
    if (globalThis.Phaser.Input.Keyboard.JustDown(this.keys.ESC)) { this.leave(); return; }
    if (this.dialogue?.isOpen) {
      if (globalThis.Phaser.Input.Keyboard.JustDown(this.keys.ENTER)
        || globalThis.Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.dialogue.advance();
      return;
    }
    if (this.race.phase === 'COUNTDOWN') {
      this.countElapsed += Math.min(delta, 100);
      const step = Math.floor(this.countElapsed / C.countdownMs);
      this.countText.setText(step < 3 ? String(3 - step) : '¡YA!');
      if (step >= 3) {
        this.race = startRace(this.race);
        this.runButton.setVisible(true);
        this.cat.anims.resume(); this.anto.anims.resume();
      }
      return;
    }
    if (this.race.phase === 'FINISHING') {
      const dt = Math.min(delta, 100) / 1000;
      this.finishElapsed += dt * 1000;
      if (this.race.winner === 'player') {
        const catX = Math.min(C.distance, this.race.catX + this.race.catSpeed * dt);
        this.race = { ...this.race, catX };
        this.cat.x = START + catX; this.catShadow.x = this.cat.x;
      } else {
        const playerX = Math.min(C.distance, this.race.playerX + this.race.playerSpeed * dt);
        this.race = { ...this.race, playerX };
        this.anto.x = START + playerX; this.antoShadow.x = this.anto.x;
      }
      if (this.finishElapsed >= 1050) this.showResult();
      return;
    }
    if (this.race.phase !== 'RACING') return;
    this.countText.setVisible(false);
    if (globalThis.Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.tap();
    const variation = Math.sin(this.race.elapsed * Math.PI * 2 / (C.variationMs / 1000)) * C.catVariation;
    this.race = advanceRace(this.race, delta / 1000, variation);
    this.cat.x = START + this.race.catX;
    this.anto.x = START + this.race.playerX;
    this.catShadow.x = this.cat.x; this.antoShadow.x = this.anto.x;
    const camera = this.cameras.main;
    const target = globalThis.Phaser.Math.Clamp((this.cat.x + this.anto.x) / 2 - 480, 0, WORLD_WIDTH - 960);
    camera.scrollX += (target - camera.scrollX) * .08;
    this.cat.anims.timeScale = Math.max(.65, this.race.catSpeed / 60);
    this.anto.anims.timeScale = Math.max(.65, this.race.playerSpeed / 65);
    this.catProgress.width = 410 * this.race.catX / C.distance;
    this.playerProgress.width = 410 * this.race.playerX / C.distance;
    const gap = this.race.catX - this.race.playerX;
    if (this.race.elapsed > 5 && this.race.elapsed < 8 && gap > 0 && gap < 70) {
      this.quip.setText('mrr…').setVisible(true);
    } else if (Math.max(this.race.catX, this.race.playerX) > C.distance * .84 && Math.abs(gap) < 90) {
      this.quip.setText('¡CASI!').setVisible(true);
    } else this.quip.setVisible(false);
    if (this.race.winner) this.finishRace();
  }

  finishRace() {
    this.runButton.setVisible(false); this.quip.setVisible(false);
    this.anto.anims.pause(); this.cat.anims.pause();
    this.finishElapsed = 0;
  }

  showResult() {
    if (this.returning || this.race.phase !== 'FINISHING') return;
    this.race = { ...this.race, phase: 'RESULT_DIALOGUE' };
    if (this.race.winner === 'player') this.confetti();
    this.dialogue.open([this.race.winner === 'player' ? MICKY.win : MICKY.lose]);
  }

  confetti() {
    for (let i = 0; i < 42; i++) {
      const side = i % 2 ? 0 : 960;
      const particle = this.add.rectangle(side, 120 + Math.random() * 240, 7, 7,
        [0xf48397, 0xffe07f, 0xffffff, 0x8bdbb5][i % 4]).setScrollFactor(0).setDepth(95);
      this.tweens.add({ targets: particle, x: 180 + Math.random() * 600,
        y: 80 + Math.random() * 330, angle: 180, alpha: 0, delay: i * 24,
        duration: C.confettiMs, onComplete: () => particle.destroy() });
    }
  }

  showReward() {
    if (this.returning || this.race.phase !== 'RESULT_DIALOGUE') return;
    this.race = { ...this.race, phase: 'REWARD' };
    const count = this.scene.get('game').completeMickyRace();
    this.reward = this.add.container(480, 252).setScrollFactor(0).setDepth(120);
    this.reward.add(this.add.rectangle(0, 0, 520, 205, 0xffefd0).setStrokeStyle(5, 0xa06843));
    this.reward.add(this.label(0, -50, 'PIEZA DE LLAVE OBTENIDA', 26).setOrigin(.5));
    this.reward.add(this.label(0, 7, `${count} / 4`, 32, '#ad7150').setOrigin(.5));
    this.continueButton = this.button(480, 329, 'Continuar', () => this.leave(), 200, 48);
    this.continueButton.box.setDepth(125); this.continueButton.text.setDepth(126);
  }

  leave() {
    if (this.returning) return;
    this.returning = true;
    const map = this.scene.get('game');
    map.input.keyboard.resetKeys();
    map.touch.direction = { x: 0, y: 0 };
    map.touch.consumeInteract(); map.touch.consumeJump();
    this.scene.resume('game'); this.scene.stop();
  }
}
