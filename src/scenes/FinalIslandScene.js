import { createFinalIsland } from '../map/createFinalIsland.js';
import { createPlayer, animatePlayer } from '../entities/createPlayer.js';
import { DialogueBox } from '../ui/DialogueBox.js';
import { SERGIO_DIALOGUE } from '../config/sergio.js';
import { FINAL_ISLAND } from '../config/finalIsland.js';

export class FinalIslandScene extends globalThis.Phaser.Scene {
  constructor() { super('final-island'); }

  init(data) { this.state = { ...(data.state || {}) }; }

  create() {
    this.phase = 'arrival';
    createFinalIsland(this);
    this.physics.world.setBounds(0, 0, 960, 540);
    const { meeting, sergioStartX } = FINAL_ISLAND;
    this.anto = createPlayer(this, { x: meeting.antoX, y: meeting.y });
    this.anto.visual.setScale(.27);
    this.anto.lastDirection = 'left';
    animatePlayer(this.anto, 0, 0);
    for (const [key, start, end, frameRate] of [['sergio-idle', 0, 7, 5], ['sergio-walk', 8, 15, 10]]) {
      if (!this.anims.exists(key)) this.anims.create({ key,
        frames: this.anims.generateFrameNumbers('sergio', { start, end }), frameRate, repeat: -1 });
    }
    this.sergio = this.add.sprite(sergioStartX, meeting.y, 'sergio').setOrigin(.5, 61 / 64).setScale(1.14).setDepth(meeting.y + 1);
    this.sergio.play('sergio-idle');
    this.shadow = this.add.ellipse(sergioStartX, meeting.y - 2, 25, 8, 0x593b34, .24).setDepth(meeting.y - 1);
    this.bouquet = this.add.image(0, 0, 'bouquet').setDisplaySize(33, 40).setDepth(meeting.y + 5);
    this.syncBouquet();
    this.dialogue = new DialogueBox(this, () => this.giveBouquet());
    this.input.keyboard.on('keydown-ENTER', event => { if (!event.repeat) this.dialogue.advance(); });
    this.input.keyboard.on('keydown-SPACE', event => { if (!event.repeat) this.dialogue.advance(); });
    this.cameras.main.fadeIn(850, 224, 242, 255);
    this.time.delayedCall(1200, () => {
      this.phase = 'approach';
      this.sergio.play('sergio-walk');
      this.tweens.add({ targets: this.sergio, x: meeting.sergioX, duration: 2200,
        onComplete: () => {
          this.sergio.play('sergio-idle');
          this.phase = 'dialogue';
          this.time.delayedCall(450, () => this.dialogue.open(SERGIO_DIALOGUE));
        }
      });
    });
  }

  syncBouquet() {
    this.shadow.x = this.sergio.x;
    if (this.phase !== 'handoff' && this.phase !== 'complete') {
      this.bouquet.setPosition(this.sergio.x + 19, this.sergio.y - 22);
    }
  }

  update() { this.syncBouquet(); }

  giveBouquet() {
    if (this.phase !== 'dialogue') return;
    this.phase = 'handoff';
    this.tweens.add({ targets: this.bouquet, x: this.anto.x - 12, y: this.anto.y - 23,
      duration: 1100, ease: 'Sine.easeInOut', onComplete: () => {
        this.phase = 'complete';
        this.state = { ...this.state, bouquetReceived: true, gameCompleted: true };
        for (let i = 0; i < 20; i++) {
          const petal = this.add.image(FINAL_ISLAND.centerX, FINAL_ISLAND.meeting.y - 30, 'petal').setScale(.022).setDepth(500);
          this.tweens.add({ targets: petal, x: FINAL_ISLAND.centerX + Math.cos(i * 2.4) * (50 + i * 3),
            y: FINAL_ISLAND.meeting.y - 130 + (i * 23) % 170, angle: i * 36, alpha: 0,
            duration: 1800, delay: i * 35, onComplete: () => petal.destroy() });
        }
        this.time.delayedCall(2100, () => {
          this.cameras.main.fadeOut(850, 255, 247, 224);
          this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('bouquet', { state: this.state }));
        });
      }
    });
  }
}
