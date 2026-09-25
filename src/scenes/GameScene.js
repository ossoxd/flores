import { CONTENT } from "../config/content.js";
import { collectFlower, createGameState, markDialogueSeen } from "../core/gameState.js";
import { createFlowers } from "../entities/createFlowers.js";
import { animatePlayer, createPlayer } from "../entities/createPlayer.js";
import { createRabbitNpc } from "../entities/createRabbitNpc.js";
import { createGardenMap } from "../map/createGardenMap.js";
import { GARDEN_LAYOUT } from "../map/gardenLayout.js";
import { DialogueBox } from "../ui/DialogueBox.js";
import { TouchControls } from "../ui/TouchControls.js";
import { TAMI } from "../config/tami.js";
import { createTamiNpc } from "../entities/createTamiNpc.js";
import { TamiQuiz } from "../ui/TamiQuiz.js";
import { awardTamiFragment, hasTamiReward } from "../core/tamiQuest.js";
import { COCO } from "../config/coco.js";
import { createCocoNpc } from "../entities/createCocoNpc.js";
import { CocoPuzzle } from "../ui/CocoPuzzle.js";
import { awardCocoPuzzle, hasCocoPuzzleReward } from "../core/cocoQuest.js";
import { normalizeCocoPortraits } from "../entities/normalizeCocoPortraits.js";
import { CANELO } from '../config/canelo.js';
import { createCaneloNpc } from '../entities/createCaneloNpc.js';
import { awardCaneloFragment, hasCaneloReward } from '../core/heartCatch.js';
import { MICKY } from '../config/micky.js';
import { createMickyNpc } from '../entities/createMickyNpc.js';
import { awardMickyFragment, hasMickyReward } from '../core/mickyRace.js';
import { MAX } from '../config/max.js';
import { createMaxNpc } from '../entities/createMaxNpc.js';
import { createKeyPedestal, KEY_ORDER } from '../entities/createKeyPedestal.js';
import { createMagicDoor } from '../entities/createMagicDoor.js';
import { showKeyReward } from '../ui/showKeyReward.js';

export class GameScene extends globalThis.Phaser.Scene {
  constructor() {
    super("game");
  }

  init(data) {
    this.state = { ...createGameState(), ...(data.state || {}) };
    this.spawnAtLastFlower = data.spawnAtLastFlower === true;
  }

  create() {
    const { width, height } = GARDEN_LAYOUT.world;
    this.physics.world.setBounds(0, 0, width, height);
    const garden = createGardenMap(this, GARDEN_LAYOUT);

    const playerPosition = this.spawnAtLastFlower
      ? GARDEN_LAYOUT.flowers[GARDEN_LAYOUT.flowers.length - 1]
      : GARDEN_LAYOUT.player;
    this.player = createPlayer(this, playerPosition);
    garden.obstacles.forEach((obstacle) => this.physics.add.collider(this.player, obstacle));

    this.rabbit = createRabbitNpc(this, GARDEN_LAYOUT.rabbit);
    this.rabbit.sprite.setDepth(this.rabbit.sprite.y);
    this.physics.add.collider(this.player, this.rabbit.sprite);
    this.talkPrompt = this.add.text(this.rabbit.sprite.x, this.rabbit.sprite.y - 54, "Enter · Hablar", {
      fontSize: "16px",
      color: "#3f2d1d",
      backgroundColor: "#fff7e8",
      padding: { x: 8, y: 5 }
    }).setOrigin(0.5).setDepth(1050);

    normalizeCocoPortraits(this);
    this.dialogue = new DialogueBox(this, () => this.handleDialogueClosed());
    this.quiz = new TamiQuiz(this, passed => this.reviewTamiQuiz(passed), () => this.input.keyboard.resetKeys());
    this.tami = createTamiNpc(this);
    this.physics.add.collider(this.player, this.tami.sprite);
    this.tamiVisit = 0;
    this.tamiPrompt = this.add.text(TAMI.position.x, TAMI.position.y - 66, 'Enter · Tami', {
      fontSize: '16px', color: '#3f2d1d', backgroundColor: '#fff7e8', padding: { x: 8, y: 5 }
    }).setOrigin(0.5).setDepth(1050).setVisible(false).setInteractive({ useHandCursor: true });
    this.tami.sprite.setInteractive({ useHandCursor: true }).on('pointerup', () => this.openTamiDialogue());
    this.tamiPrompt.on('pointerup', () => this.openTamiDialogue());
    this.coco = createCocoNpc(this);
    this.physics.add.collider(this.player, this.coco.sprite);
    this.cocoVisit = 0;
    this.cocoPrompt = this.add.text(COCO.position.x, COCO.position.y - 64, 'Enter · Coco', {
      fontSize: '16px', color: '#3f2d1d', backgroundColor: '#fff7e8', padding: { x: 8, y: 5 }
    }).setOrigin(0.5).setDepth(1050).setVisible(false).setInteractive({ useHandCursor: true });
    this.coco.sprite.on('pointerup', () => this.openCocoDialogue());
    this.cocoPrompt.on('pointerup', () => this.openCocoDialogue());
    this.cocoPuzzle = new CocoPuzzle(this,
      () => this.completeCocoPuzzle(),
      () => this.input.keyboard.resetKeys());
    this.canelo = createCaneloNpc(this);
    this.physics.add.collider(this.player, this.canelo.sprite);
    this.caneloVisit = 0;
    this.caneloPrompt = this.add.text(CANELO.position.x, CANELO.position.y - 66, 'Enter · Canelo', {
      fontSize: '16px', color: '#3f2d1d', backgroundColor: '#fff7e8', padding: { x: 8, y: 5 }
    }).setOrigin(.5).setDepth(1050).setVisible(false).setInteractive({ useHandCursor: true });
    this.canelo.sprite.on('pointerup', () => this.openCaneloDialogue());
    this.caneloPrompt.on('pointerup', () => this.openCaneloDialogue());
    this.micky = createMickyNpc(this);
    this.physics.add.collider(this.player, this.micky.sprite);
    this.mickyPrompt = this.add.text(MICKY.position.x, MICKY.position.y - 66, 'Enter · Micky', {
      fontSize: '16px', color: '#3f2d1d', backgroundColor: '#fff7e8', padding: { x: 8, y: 5 }
    }).setOrigin(.5).setDepth(1050).setVisible(false).setInteractive({ useHandCursor: true });
    this.micky.sprite.on('pointerup', () => this.openMickyDialogue());
    this.mickyPrompt.on('pointerup', () => this.openMickyDialogue());
    this.max = createMaxNpc(this);
    this.maxPrompt = this.add.text(MAX.position.x, MAX.position.y - 66, 'Enter · Max', {
      fontSize: '16px', color: '#3f2d1d', backgroundColor: '#fff7e8', padding: { x: 8, y: 5 }
    }).setOrigin(.5).setDepth(1050).setVisible(false).setInteractive({ useHandCursor: true });
    this.max.sprite.on('pointerup', () => this.openMaxDialogue());
    this.maxPrompt.on('pointerup', () => this.openMaxDialogue());
    if (this.state.maxCleared) {
      this.max.sprite.body.enable = false;
      this.max.sprite.setVisible(false);
    } else {
      this.maxGate = this.add.zone(1230, 704, 26, 64);
      this.physics.add.existing(this.maxGate, true);
      this.physics.add.collider(this.player, this.maxGate);
      this.physics.add.collider(this.player, this.max.sprite);
    }
    this.pedestal = createKeyPedestal(this, this.state);
    this.magicDoor = createMagicDoor(this, () => this.enterFinalIsland());
    this.pedestal.prompt.on('pointerup', () => this.usePedestal());
    this.events.on('resume', () => {
      if (this.pendingReward) {
        const id = this.pendingReward;
        this.pendingReward = null;
        this.time.delayedCall(80, () => this.presentKeyReward(id));
      }
    });
    this.rabbitVisit = 0;
    this.openRabbitDialogue = () => {
      if (this.finishing || this.quiz.isOpen || this.cocoPuzzle.isOpen || this.dialogue.isOpen
        || !this.rabbit.isPlayerNearby(this.player)) return;
      this.player.setVelocity(0, 0);
      this.talkPrompt.setVisible(false);
      const lines = this.state.dialogueSeen
        ? [CONTENT.rabbitRepeat[this.rabbitVisit++ % CONTENT.rabbitRepeat.length]]
        : CONTENT.rabbit;
      this.dialoguePurpose = 'rabbit';
      this.dialogue.open(lines);
    };
    this.rabbit.sprite.setInteractive({ useHandCursor: true }).on("pointerup", this.openRabbitDialogue);
    this.talkPrompt.setInteractive({ useHandCursor: true }).on("pointerup", this.openRabbitDialogue);

    this.flowers = createFlowers(this, GARDEN_LAYOUT.flowers, this.state.flowerIds);
    this.counter = this.add.text(20, 20, `✿  Flores: ${this.state.flowerIds.length}/10`, {
      fontFamily: "Georgia, serif",
      fontSize: "24px",
      color: "#3f2d1d",
      backgroundColor: "#fff7e8",
      padding: { x: 13, y: 9 }
    }).setScrollFactor(0).setDepth(1100).setStroke("#fff7e8", 1)
      .setVisible(this.state.dialogueSeen && !this.state.flowersDelivered);
    this.keyCounter = this.add.text(940, 20, `Llave · ${(this.state.keyFragments ?? []).length}/4`, {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#4a3426', backgroundColor: '#fff7e8', padding: { x: 13, y: 9 }
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1100)
      .setVisible(this.state.dialogueSeen);
    this.rabbitNotice = this.add.text(20, 20, 'Habla con el conejo', {
      fontFamily: 'Georgia, serif', fontSize: '21px', color: '#3f2d1d',
      backgroundColor: '#fff7e8', padding: { x: 13, y: 9 }
    }).setScrollFactor(0).setDepth(1100).setVisible(!this.state.dialogueSeen);

    this.physics.add.overlap(this.player, this.flowers, (_player, flower) => {
      if (!this.state.dialogueSeen || this.dialogue.isOpen || this.quiz.isOpen
        || this.cocoPuzzle.isOpen || this.finishing) return;
      const nextState = collectFlower(this.state, flower.getData("flowerId"));
      if (nextState === this.state) return;
      this.state = nextState;
      flower.destroy();
      this.counter.setText(`✿  Flores: ${this.state.flowerIds.length}/10`);
      this.tweens.add({ targets: this.counter, scale: 1.16, duration: 120, yoyo: true });
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D,ENTER");
    this.touch = new TouchControls(this);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBounds(0, 0, width, height).setRoundPixels(true);
    this.finishing = false;
    this.rewardActive = false;
    this.pedestalBusy = false;
  }

  update(_time, delta) {
    this.magicDoor.update(this.player, delta, !this.finishing && !this.dialogue.isOpen
      && !this.quiz.isOpen && !this.cocoPuzzle.isOpen && !this.rewardActive && !this.pedestalBusy);
    if (this.finishing) return;

    const blocked = this.dialogue.isOpen || this.quiz.isOpen || this.cocoPuzzle.isOpen || this.rewardActive || this.pedestalBusy;
    if (this.rewardActive || this.pedestalBusy) {
      this.player.setVelocity(0, 0);
      animatePlayer(this.player, 0, 0);
      this.talkPrompt.setVisible(false);
      this.tamiPrompt.setVisible(false);
      this.cocoPrompt.setVisible(false);
      this.caneloPrompt.setVisible(false);
      this.mickyPrompt.setVisible(false);
      this.maxPrompt.setVisible(false);
      this.pedestal.prompt.setVisible(false);
      return;
    }
    this.touch.objects.forEach(object => object.setVisible(!blocked));
    if (this.quiz.isOpen) {
      this.player.setVelocity(0, 0);
      animatePlayer(this.player, 0, 0);
      this.talkPrompt.setVisible(false);
      this.tamiPrompt.setVisible(false);
      this.cocoPrompt.setVisible(false);
      this.caneloPrompt.setVisible(false);
      this.mickyPrompt.setVisible(false);
      this.maxPrompt.setVisible(false);
      this.pedestal.prompt.setVisible(false);
      return;
    }

    if (this.cocoPuzzle.isOpen) {
      this.player.setVelocity(0, 0);
      animatePlayer(this.player, 0, 0);
      this.talkPrompt.setVisible(false);
      this.tamiPrompt.setVisible(false);
      this.cocoPrompt.setVisible(false);
      this.caneloPrompt.setVisible(false);
      this.mickyPrompt.setVisible(false);
      this.maxPrompt.setVisible(false);
      this.pedestal.prompt.setVisible(false);
      return;
    }

    const spacePressed = globalThis.Phaser.Input.Keyboard.JustDown(this.cursors.space);
    const interactPressed = globalThis.Phaser.Input.Keyboard.JustDown(this.keys.ENTER)
      || this.touch.consumeInteract();

    if (this.dialogue.isOpen) {
      this.player.setVelocity(0, 0);
      animatePlayer(this.player, 0, 0);
      this.talkPrompt.setVisible(false);
      this.tamiPrompt.setVisible(false);
      this.cocoPrompt.setVisible(false);
      this.caneloPrompt.setVisible(false);
      this.mickyPrompt.setVisible(false);
      this.maxPrompt.setVisible(false);
      this.pedestal.prompt.setVisible(false);
      if (interactPressed || spacePressed) this.dialogue.advance();
      return;
    }

    const nearRabbit = this.rabbit.isPlayerNearby(this.player);
    if (interactPressed && this.magicDoor.tryEnter()) return;
    const nearTami = this.tami.isPlayerNearby(this.player);
    const nearCoco = this.coco.isPlayerNearby(this.player);
    const nearCanelo = this.canelo.isPlayerNearby(this.player);
    const nearMicky = this.micky.isPlayerNearby(this.player);
    const nearMax = !this.state.maxCleared && this.max.isPlayerNearby(this.player);
    const nearPedestal = this.state.maxCleared && this.pedestal.isPlayerNearby(this.player);
    this.talkPrompt.setVisible(nearRabbit);
    this.tamiPrompt.setVisible(nearTami);
    this.cocoPrompt.setVisible(nearCoco);
    this.caneloPrompt.setVisible(nearCanelo);
    this.mickyPrompt.setVisible(nearMicky);
    this.maxPrompt.setVisible(nearMax);
    this.pedestal.prompt.setVisible(nearPedestal && !this.state.hasCompleteKey);
    if (nearPedestal && interactPressed) {
      this.usePedestal();
      return;
    }
    if (nearMax && interactPressed) {
      this.openMaxDialogue();
      return;
    }
    if (nearMicky && interactPressed) {
      this.openMickyDialogue();
      return;
    }
    if (nearCanelo && interactPressed) {
      this.openCaneloDialogue();
      return;
    }
    if (nearTami && interactPressed) {
      this.openTamiDialogue();
      return;
    }
    if (nearCoco && interactPressed) {
      this.openCocoDialogue();
      return;
    }
    if (nearRabbit && interactPressed) {
      this.openRabbitDialogue();
      return;
    }

    const touch = this.touch.getDirection();
    const x = Number(this.cursors.right.isDown || this.keys.D.isDown)
      - Number(this.cursors.left.isDown || this.keys.A.isDown)
      + touch.x;
    const y = Number(this.cursors.down.isDown || this.keys.S.isDown)
      - Number(this.cursors.up.isDown || this.keys.W.isDown)
      + touch.y;
    const vector = new globalThis.Phaser.Math.Vector2(x, y);
    if (vector.lengthSq()) vector.normalize();
    this.player.setVelocity(vector.x * 180, vector.y * 180);
    animatePlayer(this.player, vector.x, vector.y);

    const jumpPressed = this.touch.consumeJump()
      || spacePressed;
    if (this.player.jumpStarted === null && jumpPressed) {
      this.player.jumpStarted = this.time.now;
      this.player.visual.play(`jump-${this.player.lastDirection}`, true);
    }
  }

  openTamiDialogue() {
    if (this.finishing || this.dialogue.isOpen || this.quiz.isOpen || this.cocoPuzzle.isOpen
      || !this.tami.isPlayerNearby(this.player)) return;
    this.player.setVelocity(0, 0);
    this.tamiPrompt.setVisible(false);
    if (hasTamiReward(this.state)) {
      this.dialoguePurpose = 'tami-repeat';
      this.dialogue.open([TAMI.repeat[this.tamiVisit++ % TAMI.repeat.length]]);
    } else {
      this.dialoguePurpose = 'tami-intro';
      this.dialogue.open(this.state.tamiIntroSeen ? [TAMI.intro.at(-1)] : TAMI.intro);
    }
  }

  openCocoDialogue() {
    if (this.finishing || this.dialogue.isOpen || this.quiz.isOpen || this.cocoPuzzle.isOpen
      || !this.coco.isPlayerNearby(this.player)) return;
    this.player.setVelocity(0, 0);
    this.cocoPrompt.setVisible(false);
    if (hasCocoPuzzleReward(this.state)) {
      this.dialoguePurpose = 'coco-repeat';
      this.dialogue.open([COCO.repeat[this.cocoVisit++ % COCO.repeat.length]]);
    } else if (this.state.cocoIntroSeen) {
      this.dialoguePurpose = 'coco-reminder';
      this.dialogue.open(COCO.reminder);
    } else {
      this.dialoguePurpose = 'coco-intro';
      this.dialogue.open(COCO.intro);
    }
  }

  openCaneloDialogue() {
    if (this.finishing || this.dialogue.isOpen || this.quiz.isOpen || this.cocoPuzzle.isOpen
      || this.scene.isActive('heart-catch') || !this.canelo.isPlayerNearby(this.player)) return;
    this.player.setVelocity(0, 0);
    this.caneloPrompt.setVisible(false);
    if (hasCaneloReward(this.state)) {
      this.dialoguePurpose = 'canelo-repeat';
      this.dialogue.open([CANELO.repeat[this.caneloVisit++ % CANELO.repeat.length]]);
    } else {
      this.dialoguePurpose = 'canelo-intro';
      this.dialogue.open(this.state.caneloIntroSeen ? [CANELO.intro.at(-1)] : CANELO.intro);
    }
  }

  openMickyDialogue() {
    if (this.finishing || this.dialogue.isOpen || this.quiz.isOpen || this.cocoPuzzle.isOpen
      || this.scene.isActive('micky-race') || !this.micky.isPlayerNearby(this.player)) return;
    this.player.setVelocity(0, 0);
    this.mickyPrompt.setVisible(false);
    if (hasMickyReward(this.state)) {
      this.dialoguePurpose = 'micky-repeat';
      this.dialogue.open(MICKY.repeat);
    } else {
      this.dialoguePurpose = 'micky-intro';
      this.dialogue.open(this.state.mickyIntroSeen ? [MICKY.intro.at(-1)] : MICKY.intro);
    }
  }

  openMaxDialogue() {
    if (this.finishing || this.dialogue.isOpen || this.quiz.isOpen || this.cocoPuzzle.isOpen
      || this.state.maxCleared || !this.max.isPlayerNearby(this.player)) return;
    this.player.setVelocity(0, 0);
    this.maxPrompt.setVisible(false);
    if (!this.state.maxIntroSeen) {
      this.dialoguePurpose = 'max-intro';
      this.dialogue.open(MAX.intro);
    } else if (this.state.flowerIds.length === 10) {
      this.dialoguePurpose = 'max-thanks';
      this.dialogue.open(MAX.thanks);
    } else {
      this.dialoguePurpose = 'max-waiting';
      this.dialogue.open(MAX.waiting);
    }
  }

  releaseMax() {
    this.state = { ...this.state, flowersDelivered: true, maxCleared: true };
    this.counter.setVisible(false);
    this.maxPrompt.setVisible(false);
    this.maxGate?.destroy();
    this.max.sprite.body.enable = false;
    this.max.sprite.play('max-walk-loop');
    this.tweens.add({
      targets: this.max.sprite,
      x: MAX.destination.x, y: MAX.destination.y,
      duration: 3500, ease: 'Linear',
      onUpdate: () => this.max.sprite.setDepth(this.max.sprite.y),
      onComplete: () => this.max.sprite.setVisible(false)
    });
  }

  presentKeyReward(id) {
    if (this.rewardActive) return;
    this.rewardActive = true;
    this.player.setVelocity(0, 0);
    showKeyReward(this, id, () => { this.rewardActive = false; });
  }

  usePedestal() {
    if (!this.state.maxCleared || this.state.hasCompleteKey || this.pedestalBusy
      || this.rewardActive || this.dialogue.isOpen || !this.pedestal.isPlayerNearby(this.player)) return;
    const id = KEY_ORDER.find(part => (this.state.keyFragments ?? []).includes(part)
      && !(this.state.placedFragments ?? []).includes(part));
    if (!id) {
      this.pedestal.prompt.setText('Aún faltan piezas');
      this.time.delayedCall(1300, () => this.pedestal.prompt.setText('Enter'));
      return;
    }
    this.pedestalBusy = true;
    this.player.setVelocity(0, 0);
    const slot = this.pedestal.pieces[id];
    const piece = this.add.image(this.player.x, this.player.y - 28, `key-${id}`)
      .setDisplaySize(slot.displayWidth, slot.displayHeight).setAngle(-90).setDepth(1800);
    this.tweens.add({ targets: piece, x: slot.x, y: slot.y, duration: 650,
      ease: 'Cubic.easeOut', onComplete: () => {
        piece.destroy();
        this.pedestal.showPiece(id);
        this.state = { ...this.state, placedFragments: [...(this.state.placedFragments ?? []), id] };
        if (this.state.placedFragments.length === 4) this.assembleKey();
        else this.pedestalBusy = false;
      } });
  }

  assembleKey() {
    this.pedestal.hidePieces();
    showKeyReward(this, 'full', () => {
      this.state = { ...this.state, keyAssembled: true };
      const full = this.pedestal.complete;
      full.setVisible(true).setAlpha(1).setDepth(1801);
      this.time.delayedCall(700, () => {
        this.pedestal.stopCompleteHover();
        this.tweens.add({
          targets: full, x: this.player.x, y: this.player.y - 30,
          scale: .28, alpha: 0, duration: 900, ease: 'Cubic.easeInOut',
          onComplete: () => {
            full.setVisible(false);
            this.state = { ...this.state, hasCompleteKey: true };
            this.keyCounter.setText('Llave completa');
            this.pedestal.prompt.setVisible(false);
            this.pedestalBusy = false;
          }
        });
      });
    });
  }

  openMickyRace() {
    if (hasMickyReward(this.state) || this.finishing || this.scene.isActive('micky-race')) return;
    this.player.setVelocity(0, 0);
    animatePlayer(this.player, 0, 0);
    this.input.keyboard.resetKeys();
    this.touch.direction = { x: 0, y: 0 };
    this.touch.consumeInteract(); this.touch.consumeJump();
    this.mickyPrompt.setVisible(false);
    this.scene.launch('micky-race');
    this.scene.pause();
  }

  completeMickyRace() {
    const previous = this.state;
    this.state = awardMickyFragment(this.state);
    if (this.state !== previous) this.pendingReward = 'micky';
    const count = this.state.keyFragments.length;
    this.keyCounter.setText(`Llave · ${count}/4`);
    return count;
  }

  openHeartCatch() {
    if (hasCaneloReward(this.state) || this.finishing || this.scene.isActive('heart-catch')) return;
    this.player.setVelocity(0, 0);
    animatePlayer(this.player, 0, 0);
    this.input.keyboard.resetKeys();
    this.touch.direction = { x: 0, y: 0 };
    this.touch.consumeInteract(); this.touch.consumeJump();
    this.caneloPrompt.setVisible(false);
    this.scene.launch('heart-catch');
    this.scene.pause();
  }

  completeCaneloGame() {
    const previous = this.state;
    this.state = awardCaneloFragment(this.state);
    if (this.state !== previous) this.pendingReward = 'canelo';
    const count = this.state.keyFragments.length;
    this.keyCounter.setText(`Llave · ${count}/4`);
    return count;
  }

  openCocoPuzzle() {
    if (hasCocoPuzzleReward(this.state) || this.finishing) return;
    this.player.setVelocity(0, 0);
    this.input.keyboard.resetKeys();
    this.touch.direction = { x: 0, y: 0 };
    this.touch.consumeJump();
    this.touch.consumeInteract();
    this.cocoPuzzle.open();
  }

  completeCocoPuzzle() {
    if (hasCocoPuzzleReward(this.state)) return;
    this.input.keyboard.resetKeys();
    this.state = awardCocoPuzzle(this.state);
    this.keyCounter.setText(`Llave · ${this.state.keyFragments.length}/4`);
    this.presentKeyReward('coco');
  }

  openTamiQuiz() {
    if (hasTamiReward(this.state)) return;
    this.player.setVelocity(0, 0);
    this.input.keyboard.resetKeys();
    this.touch.direction = { x: 0, y: 0 };
    this.touch.consumeJump();
    this.touch.consumeInteract();
    this.quiz.open();
  }

  reviewTamiQuiz(passed) {
    this.input.keyboard.resetKeys();
    if (passed) {
      this.state = awardTamiFragment(this.state);
      this.keyCounter.setText(`Llave · ${this.state.keyFragments.length}/4`);
    }
    this.dialoguePurpose = passed ? 'tami-success' : 'tami-failure';
    this.dialogue.open(passed ? TAMI.success : TAMI.failure);
  }

  handleDialogueClosed() {
    const purpose = this.dialoguePurpose;
    this.dialoguePurpose = null;
    if (purpose === 'rabbit') {
      this.state = markDialogueSeen(this.state);
      this.rabbitNotice.setVisible(false);
      this.counter.setVisible(!this.state.flowersDelivered);
      this.keyCounter.setVisible(true);
    }
    if (purpose === 'max-intro') this.state = { ...this.state, maxIntroSeen: true };
    if (purpose === 'max-thanks') this.releaseMax();
    if (purpose === 'tami-intro') {
      this.state = { ...this.state, tamiIntroSeen: true };
      this.openTamiQuiz();
    } else if (purpose === 'tami-failure') {
      this.openTamiQuiz();
    } else if (purpose === 'tami-success') {
      this.presentKeyReward('tami');
    } else if (purpose === 'coco-intro') {
      this.state = { ...this.state, cocoIntroSeen: true };
      this.openCocoPuzzle();
    } else if (purpose === 'coco-reminder') {
      this.openCocoPuzzle();
    } else if (purpose === 'canelo-intro') {
      this.state = { ...this.state, caneloIntroSeen: true };
      this.openHeartCatch();
    } else if (purpose === 'micky-intro') {
      this.state = { ...this.state, mickyIntroSeen: true };
      this.openMickyRace();
    }
  }

  enterFinalIsland() {
    if (this.finishing || !this.state.hasCompleteKey) return;
    this.finishing = true;
    this.player.setVelocity(0, 0);
    animatePlayer(this.player, 0, 0);
    this.input.keyboard.resetKeys();
    this.touch.objects.forEach(object => object.setVisible(false));
    for (const prompt of [this.talkPrompt, this.tamiPrompt, this.cocoPrompt, this.caneloPrompt,
      this.mickyPrompt, this.maxPrompt, this.pedestal.prompt, this.counter, this.keyCounter]) prompt.setVisible(false);
    this.cameras.main.fadeOut(800, 212, 225, 255);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('final-island', { state: this.state }));
  }

  finishGame() {
    if (this.finishing) return;
    this.finishing = true;
    this.player.setVelocity(0, 0);
    this.talkPrompt.setVisible(false);
    this.tamiPrompt.setVisible(false);
    this.cocoPrompt.setVisible(false);
    this.caneloPrompt.setVisible(false);
    this.mickyPrompt.setVisible(false);
    for (let index = 0; index < 14; index += 1) {
      const petal = this.add.image(this.player.x, this.player.y - 20, "petal")
        .setScale(0.035)
        .setDepth(2000);
      this.tweens.add({
        targets: petal,
        x: this.player.x + globalThis.Phaser.Math.Between(-180, 180),
        y: this.player.y + globalThis.Phaser.Math.Between(-150, 150),
        angle: globalThis.Phaser.Math.Between(-180, 180),
        alpha: 0,
        duration: globalThis.Phaser.Math.Between(650, 950)
      });
    }
    this.time.delayedCall(700, () => this.cameras.main.fadeOut(550, 255, 247, 232));
    this.time.delayedCall(1300, () => this.scene.start("bouquet", { state: this.state }));
  }
}
