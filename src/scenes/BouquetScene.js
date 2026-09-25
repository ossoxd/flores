export class BouquetScene extends globalThis.Phaser.Scene {
  constructor() {
    super("bouquet");
  }

  init(data) {
    this.state = data.state;
  }

  create() {
    this.ready = false;
    this.cameras.main.setBackgroundColor("#fff2c6");
    this.add.circle(480, 275, 250, 0xffe7a1, 0.55);
    this.add.circle(480, 275, 205, 0xfff8df, 0.72);
    const title = this.add.text(480, 64, "Estas flores son para ti", {
      fontFamily: "Georgia, serif",
      fontSize: "42px",
      color: "#6b3c2a"
    }).setOrigin(0.5).setAlpha(0);

    for (let index = 0; index < 18; index += 1) {
      const petal = this.add.image(
        globalThis.Phaser.Math.Between(120, 840),
        globalThis.Phaser.Math.Between(-80, 80),
        "petal"
      ).setScale(globalThis.Phaser.Math.FloatBetween(0.025, 0.05)).setAlpha(0.9);
      this.tweens.add({
        targets: petal,
        y: globalThis.Phaser.Math.Between(420, 620),
        x: petal.x + globalThis.Phaser.Math.Between(-100, 100),
        angle: globalThis.Phaser.Math.Between(-220, 220),
        duration: globalThis.Phaser.Math.Between(1800, 3100),
        delay: globalThis.Phaser.Math.Between(0, 800),
        repeat: -1
      });
    }

    const bouquet = this.add.image(480, 245, "bouquet").setScale(0.04).setAlpha(0);
    const button = this.add.rectangle(480, 482, 310, 62, 0xf4c542)
      .setStrokeStyle(4, 0xb77a15)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0);
    const label = this.add.text(480, 482, "Leer la carta", {
      fontFamily: "Georgia, serif",
      fontSize: "26px",
      color: "#3f2d1d"
    }).setOrigin(0.5).setAlpha(0);

    const openLetter = () => {
      if (!this.ready) return;
      this.scene.start("letter", { state: this.state });
    };
    button.on("pointerup", openLetter);
    this.input.keyboard.on("keydown-ENTER", openLetter);
    this.input.keyboard.on("keydown-SPACE", openLetter);

    this.tweens.add({
      targets: bouquet,
      alpha: 1,
      scale: 0.31,
      duration: 900,
      ease: "Back.Out",
      onComplete: () => {
        this.ready = true;
        this.tweens.add({ targets: [button, label], alpha: 1, duration: 260 });
        this.tweens.add({ targets: title, alpha: 1, duration: 350 });
      }
    });
  }
}
