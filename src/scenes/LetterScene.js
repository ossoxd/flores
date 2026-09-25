import { CONTENT } from "../config/content.js";
import { resetGameState } from "../core/gameState.js";

export class LetterScene extends globalThis.Phaser.Scene {
  constructor() {
    super("letter");
  }

  init(data) {
    this.state = data.state;
  }

  createButton(x, label, callback) {
    const button = this.add.rectangle(x, 462, 265, 56, 0xf4c542)
      .setStrokeStyle(3, 0xb77a15)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, 462, label, {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#3f2d1d"
    }).setOrigin(0.5);
    button.on("pointerup", callback);
    return button;
  }

  create() {
    this.actionsVisible = false;
    this.cameras.main.setBackgroundColor("#f5df9c");
    this.add.rectangle(480, 270, 800, 450, 0xfffbef)
      .setStrokeStyle(6, 0xe6b83f);
    this.add.text(480, 82, "Una carta para ti", {
      fontFamily: "Georgia, serif",
      fontSize: "40px",
      color: "#6b3c2a"
    }).setOrigin(0.5);
    const body = this.add.text(155, 145, "", {
      fontFamily: "Georgia, serif",
      fontSize: "23px",
      color: "#4a3426",
      wordWrap: { width: 650 },
      lineSpacing: 9
    });
    this.add.text(480, 410, "R: ver el ramo · Enter: jugar de nuevo", {
      fontSize: "16px",
      color: "#8a6548"
    }).setOrigin(0.5).setVisible(false).setName("letter-hint");

    let index = 0;
    const revealAll = () => {
      index = CONTENT.letter.length;
      body.setText(CONTENT.letter);
      this.revealActions();
    };
    this.typewriter = this.time.addEvent({
      delay: 24,
      repeat: CONTENT.letter.length - 1,
      callback: () => {
        index += 1;
        body.setText(CONTENT.letter.slice(0, index));
        if (index === CONTENT.letter.length) this.revealActions();
      }
    });
    this.input.keyboard.once("keydown-SPACE", () => {
      if (index < CONTENT.letter.length) {
        this.typewriter.remove(false);
        revealAll();
      }
    });
  }

  revealActions() {
    if (this.actionsVisible) return;
    this.actionsVisible = true;
    this.children.getByName("letter-hint").setVisible(true);
    const showBouquet = () => this.scene.start("bouquet", { state: this.state });
    const restart = () => this.scene.start("game", { state: resetGameState(this.state) });
    this.createButton(325, "Ver el ramo otra vez", showBouquet);
    this.createButton(635, "Jugar de nuevo", restart);
    this.input.keyboard.on("keydown-R", showBouquet);
    this.input.keyboard.on("keydown-ENTER", restart);
  }
}
