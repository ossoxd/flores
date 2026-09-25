import { HEART_CATCH as CONFIG } from '../config/canelo.js';
import { createCatchState, catchItem, catchDifficulty } from '../core/heartCatch.js';
import { createCatchArt, drawCatchGarden } from '../minigames/heartCatchArt.js';

export class HeartCatchScene extends globalThis.Phaser.Scene {
  constructor() { super('heart-catch'); }

  create() {
    this.round = createCatchState();
    this.stage = 'intro';
    this.items = [];
    this.spawnAt = 0;
    this.messageQueue = [];
    this.messageUntil = 0;
    this.pointerTarget = null;
    this.touchDirection = 0;
    this.lastSpawnX = null;
    this.returning = false;
    this.cameras.main.setRoundPixels(true);
    createCatchArt(this);
    drawCatchGarden(this);
    this.add.rectangle(122, 45, 224, 70, 0xfff0d2, .87).setStrokeStyle(3, 0x9c6c50);
    this.scoreText = this.label(26, 16, '♥  0 / 30', 23);
    this.comboText = this.label(26, 49, 'COMBO x1', 16, '#bd5b68');
    this.statusText = this.label(26, 86, '', 16);
    this.button(897, 25, '×', () => this.leave(), 40);
    this.canelo = this.add.sprite(860, 470, 'canelo-idle', 0)
      .setOrigin(.5, 60 / 64).setScale(1.5).setDepth(19).play('canelo-idle');
    this.shadow = this.add.ellipse(480, CONFIG.playerY, 48, 12, 0x563c37, .3);
    this.player = this.add.sprite(480, CONFIG.playerY, 'girlfriend-idle-aligned', 0)
      .setOrigin(.5, 240 / 256).setScale(.32).setDepth(20).play('idle-down');
    this.basket = this.add.image(480, CONFIG.playerY - 8, 'catch-basket').setScale(4, 3).setDepth(21);
    this.catchText = this.label(480, 381, '', 18, '#fff2b1').setOrigin(.5).setDepth(30);
    this.message = this.add.text(750, 300, '', { fontFamily: 'Tami Minecraft, monospace',
      fontSize: '16px', color: '#593b38', backgroundColor: '#fff0d7', padding: { x: 12, y: 8 },
      wordWrap: { width: 250 }, align: 'center' }).setOrigin(.5, 1).setDepth(80).setVisible(false);
    this.keys = this.input.keyboard.addKeys('A,D,LEFT,RIGHT,ESC,ENTER');
    const movePointer = pointer => {
      if (pointer.isDown && pointer.x >= CONFIG.left && pointer.x <= CONFIG.right && pointer.y >= 180) {
        this.pointerTarget = pointer.x;
      }
    };
    this.input.on('pointerdown', movePointer);
    this.input.on('pointermove', movePointer);
    const left = this.button(52, 515, '←', () => {}, 64);
    const right = this.button(908, 515, '→', () => {}, 64);
    left.on('pointerdown', () => { this.touchDirection = -1; this.pointerTarget = null; });
    right.on('pointerdown', () => { this.touchDirection = 1; this.pointerTarget = null; });
    const release = () => { this.touchDirection = 0; };
    this.input.on('pointerup', release);
    this.input.on('gameout', release);
    this.events.once('shutdown', () => {
      this.input.off('pointerdown', movePointer); this.input.off('pointermove', movePointer);
      this.input.off('pointerup', release); this.input.off('gameout', release);
      this.items = []; this.messageQueue = [];
    });
    this.intro = this.add.container(480, 260).setDepth(100);
    this.intro.add(this.add.rectangle(0, 0, 484, 175, 0xffefd3).setStrokeStyle(4, 0xae7855));
    this.countdownText = this.label(0, -48, 'ATRAPA MIS CORAZONES', 24).setOrigin(.5);
    this.intro.add(this.countdownText);
    this.introHint = this.label(0, 20, 'Atrapa los corazones\ny evita la basura.', 20).setOrigin(.5);
    this.intro.add(this.introHint);
    this.time.delayedCall(CONFIG.introMs, () => this.countDown(3));
    document.fonts.load('18px "Tami Minecraft"').then(() => {
      if (!this.scene.isActive()) return;
      const redraw = objects => objects.forEach(object => {
        if (object.type === 'Text') object.updateText();
        if (object.type === 'Container') redraw(object.list);
      });
      redraw(this.children.list);
    }).catch(() => {});
  }

  label(x, y, text, size = 18, color = '#654335') {
    return this.add.text(x, y, text, { fontFamily: 'Tami Minecraft, monospace', fontSize: `${size}px`,
      color, lineSpacing: 7 });
  }

  button(x, y, text, action, width = 150) {
    const box = this.add.rectangle(x, y, width, 34, 0xf3d6a9).setStrokeStyle(3, 0x9c6c50)
      .setDepth(110).setInteractive({ useHandCursor: true });
    const label = this.label(x, y, text, 17).setOrigin(.5).setDepth(111);
    box.on('pointerup', action);
    box.on('destroy', () => label.destroy());
    return box;
  }

  countDown(value) {
    this.countdownText.setText(value ? String(value) : '¡YA!').setFontSize(40);
    this.introHint.setText('');
    if (value) this.time.delayedCall(CONFIG.countdownMs, () => this.countDown(value - 1));
    else this.time.delayedCall(500, () => {
      this.intro.destroy(); this.stage = 'playing'; this.spawnAt = this.time.now + 200;
    });
  }

  update(_time, delta) {
    if (this.returning) return;
    if (globalThis.Phaser.Input.Keyboard.JustDown(this.keys.ESC)) { this.leave(); return; }
    if (this.stage === 'won') {
      if (globalThis.Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) this.leave();
      return;
    }
    if (this.stage !== 'playing') return;
    const dt = Math.min(delta, 50) / 1000;
    const now = this.time.now;
    let direction = Number(this.keys.D.isDown || this.keys.RIGHT.isDown)
      - Number(this.keys.A.isDown || this.keys.LEFT.isDown) || this.touchDirection;
    if (direction) this.pointerTarget = null;
    const speed = CONFIG.playerSpeed * (now < this.round.slowUntil ? CONFIG.rockSlowFactor : 1);
    if (!direction && this.pointerTarget !== null) {
      const distance = this.pointerTarget - this.player.x;
      direction = Math.abs(distance) > 3 ? Math.sign(distance) : 0;
      if (Math.abs(distance) < speed * dt) this.pointerTarget = null;
    }
    this.player.x = globalThis.Phaser.Math.Clamp(this.player.x + direction * speed * dt, CONFIG.left + 20, CONFIG.right - 20);
    this.player.play(direction ? `run-${direction < 0 ? 'left' : 'right'}` : 'idle-down', true);
    this.basket.x = this.shadow.x = this.player.x;
    this.statusText.setText(now < this.round.slowUntil ? 'Pasito lento…' : '');
    if (this.round.phase === 'playing' && now >= this.spawnAt) {
      const difficulty = catchDifficulty(this.round.hearts);
      this.spawnAt = now + difficulty.interval;
      const bad = Math.random() < difficulty.badChance;
      const type = bad ? difficulty.trash[Math.floor(Math.random() * difficulty.trash.length)] : 'heart';
      this.spawn(type, difficulty.speed);
    }
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i], previousY = item.sprite.y;
      item.sprite.y += item.speed * dt;
      if (item.type === 'heart') item.sprite.setTint(Math.floor(now / 140) % 3 === 0 ? 0xffdce6 : 0xffffff);
      else if (item.type !== 'key') item.sprite.setAngle(Math.floor(now / 250) % 2 ? 9 : -9);
      if (item.type === 'key' && now >= item.sparkAt) {
        item.sparkAt = now + 180; this.sparkles(item.sprite.x, item.sprite.y, 0xffefaa, 1);
      }
      const catchY = CONFIG.playerY - 19;
      if (Math.abs(item.sprite.x - this.player.x) < CONFIG.basketHalfWidth + CONFIG.itemRadius
        && item.sprite.y + CONFIG.itemRadius >= catchY - CONFIG.basketHalfHeight
        && previousY - CONFIG.itemRadius <= catchY + CONFIG.basketHalfHeight) {
        this.items.splice(i, 1); item.sprite.destroy(); this.collect(item.type);
        if (this.round.phase !== 'playing') break;
      } else if (item.sprite.y > 495) {
        this.items.splice(i, 1); item.sprite.destroy();
        if (item.type === 'key') this.spawn('key', CONFIG.keyFallSpeed, this.player.x);
      }
    }
    if (now >= this.messageUntil) {
      if (this.messageQueue.length) {
        this.message.setText(this.messageQueue.shift()).setVisible(true);
        this.messageUntil = now + 1500;
      } else this.message.setVisible(false);
    }
  }

  spawn(type, speed, fixedX) {
    let x = fixedX ?? globalThis.Phaser.Math.Between(CONFIG.left + 22, CONFIG.right - 22);
    if (fixedX === undefined && this.round.hearts >= 20 && type === 'heart' && Math.random() < .4) {
      x = globalThis.Phaser.Math.Clamp(this.player.x + globalThis.Phaser.Math.Between(-105, 105), CONFIG.left + 22, CONFIG.right - 22);
    }
    if (fixedX === undefined && this.lastSpawnX !== null && Math.abs(x - this.lastSpawnX) < 36) {
      x = x > 480 ? Math.max(CONFIG.left + 22, x - 62) : Math.min(CONFIG.right - 22, x + 62);
    }
    this.lastSpawnX = x;
    const sprite = type === 'heart' || type === 'key'
      ? this.add.image(x, CONFIG.spawnY, `catch-${type}`).setScale(type === 'key' ? 3 : 2.2)
      : this.add.image(x, CONFIG.spawnY, `catch-hazard-${type}`).setDisplaySize(40, 40);
    sprite.setDepth(40);
    this.items.push({ type, speed, sprite, sparkAt: 0 });
  }

  collect(type) {
    const result = catchItem(this.round, type, this.time.now);
    this.round = result.state;
    this.messageQueue.push(...result.messages);
    this.scoreText.setText(`♥  ${this.round.hearts} / ${CONFIG.heartGoal}`);
    this.comboText.setText(`COMBO x${this.round.combo}`);
    if (type === 'heart') {
      this.sparkles(this.player.x, CONFIG.playerY - 25, 0xffd4dc, 4, this.round.hearts >= 27);
      this.tone(520 + Math.min(this.round.combo, 12) * 28, .09);
      this.catchText.setPosition(this.player.x, 380).setText('+1').setAlpha(1);
      this.tweens.killTweensOf(this.catchText);
      this.tweens.add({ targets: this.catchText, y: 355, alpha: 0, duration: 450 });
      this.tweens.killTweensOf(this.comboText);
      this.comboText.setScale(1.12);
      this.time.delayedCall(100, () => this.comboText.setScale(1));
      if (this.round.hearts === 27) this.messageQueue.unshift('¡LLUVIA DE CORAZONES!');
      if (this.round.phase === 'key') {
        this.clearItems(); this.messageQueue = ['¡30 corazones! Atrapa la pieza de llave.'];
        this.messageUntil = 0; this.spawn('key', CONFIG.keyFallSpeed, this.player.x);
      }
    } else if (type === 'key' && this.round.phase === 'won') this.win();
  }

  sparkles(x, y, color, count, hearts = false) {
    for (let i = 0; i < count; i++) {
      const particle = hearts
        ? this.add.image(x, y, 'catch-heart').setTint(color).setDepth(60)
        : this.add.rectangle(x, y, 4, 4, color).setDepth(60);
      this.tweens.add({ targets: particle, x: x + globalThis.Phaser.Math.Between(-27, 27),
        y: y - globalThis.Phaser.Math.Between(12, 40), alpha: 0, duration: 400,
        onUpdate: () => { particle.x = Math.round(particle.x); particle.y = Math.round(particle.y); },
        onComplete: () => particle.destroy() });
    }
  }

  tone(frequency, duration) {
    const ctx = this.sound.context;
    if (!ctx || ctx.state !== 'running' || this.sound.mute) return;
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.035 * this.sound.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
    oscillator.connect(gain); gain.connect(ctx.destination);
    oscillator.start(); oscillator.stop(ctx.currentTime + duration);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }

  win() {
    this.stage = 'won'; this.clearItems(); this.message.setVisible(false);
    this.player.play('idle-down', true);
    const map = this.scene.get('game');
    const count = map.completeCaneloGame();
    this.sparkles(this.player.x, CONFIG.playerY - 30, 0xffef96, 14);
    this.tone(880, .35);
    this.add.rectangle(480, 275, 500, 238, 0xffefd3).setStrokeStyle(5, 0xc8954b).setDepth(90);
    this.label(480, 190, 'PIEZA DE LLAVE OBTENIDA', 23).setOrigin(.5).setDepth(100);
    this.add.image(480, 244, 'catch-key').setScale(4).setDepth(100);
    this.label(480, 292, `${count} / 4`, 25, '#bd724b').setOrigin(.5).setDepth(100);
    this.label(480, 331, 'Una parte menos para descubrir qué abre esta llave…', 14).setOrigin(.5).setDepth(100);
    this.button(480, 373, 'Continuar', () => this.leave(), 170);
  }

  clearItems() { for (const item of this.items) item.sprite.destroy(); this.items = []; }

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
