export class MenuScene extends globalThis.Phaser.Scene {
  constructor() { super("menu"); }
  create() {
    this.cameras.main.setBackgroundColor("#fff2c6");
    this.add.circle(140, 110, 105, 0xffe29a, 0.4);
    this.add.circle(820, 430, 130, 0xffe29a, 0.36);
    for (const [x, y, angle] of [[120, 115, -15], [835, 415, 18], [875, 110, 8]]) {
      this.add.image(x, y, "yellow-flower").setScale(0.065).setAngle(angle).setAlpha(0.9);
    }
    this.add.text(480, 155, "Un jardín para ti", { fontFamily: "Georgia", fontSize: "52px", color: "#653f2c" }).setOrigin(0.5);
    this.add.text(480, 225, "Recolecta diez flores amarillas", { fontSize: "24px", color: "#73533d" }).setOrigin(0.5);
    const button = this.add.rectangle(480, 340, 280, 72, 0xf4c542).setStrokeStyle(4, 0xb77a15).setInteractive({ useHandCursor: true });
    this.add.text(480, 340, "Comenzar", { fontSize: "30px", color: "#3f2d1d" }).setOrigin(0.5);
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      this.cameras.main.fadeOut(240, 255, 242, 198);
      this.time.delayedCall(250, () => this.scene.start("game"));
    };
    button.on("pointerup", start);
    this.input.keyboard.on("keydown-ENTER", start);
    this.input.keyboard.on("keydown-SPACE", start);
  }
}
