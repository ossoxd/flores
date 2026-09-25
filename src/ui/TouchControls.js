export class TouchControls {
  constructor(scene) {
    this.direction = { x: 0, y: 0 };
    this.jumpQueued = false;
    this.interactQueued = false;
    this.objects = [];
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    const button = (x, y, label, down, up = () => {}) => {
      const shape = scene.add.circle(x, y, 56, 0xfff7e8, 0.86)
        .setStrokeStyle(4, 0xb77a15, 0.8)
        .setScrollFactor(0)
        .setDepth(1200)
        .setInteractive();
      const text = scene.add.text(x, y, label, { fontSize: "32px", color: "#4a3426", fontStyle: "bold" })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1201);
      shape.on("pointerdown", down).on("pointerup", up).on("pointerout", up);
      this.objects.push(shape, text);
    };
    button(60, 450, "←", () => { this.direction.x = -1; }, () => { this.direction.x = 0; });
    button(180, 450, "→", () => { this.direction.x = 1; }, () => { this.direction.x = 0; });
    button(120, 390, "↑", () => { this.direction.y = -1; }, () => { this.direction.y = 0; });
    button(120, 510, "↓", () => { this.direction.y = 1; }, () => { this.direction.y = 0; });
    button(775, 466, "↟", () => { this.jumpQueued = true; });
    button(895, 466, "A", () => { this.interactQueued = true; });
  }
  getDirection() { return { ...this.direction }; }
  consumeJump() { const value = this.jumpQueued; this.jumpQueued = false; return value; }
  consumeInteract() { const value = this.interactQueued; this.interactQueued = false; return value; }
  destroy() { this.objects.forEach((object) => object.destroy()); }
}
