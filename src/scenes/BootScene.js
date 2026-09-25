import { ASSETS } from "../config/assets.js";
import { formatAssetError } from "../core/assetErrors.js";
import { resolvePreviewScene, resolveVictoryPreview } from "../core/previewScene.js";

export class BootScene extends globalThis.Phaser.Scene {
  constructor() { super("boot"); }
  preload() {
    const status = document.querySelector("#loading-status");
    this.load.on("loaderror", (file) => { status.textContent = formatAssetError(file.src || file.url); });
    for (const asset of Object.values(ASSETS)) {
      if (asset.type === "spritesheet") this.load.spritesheet(asset.key, asset.url, { frameWidth: asset.frameWidth, frameHeight: asset.frameHeight });
      else this.load.image(asset.key, asset.url);
    }
  }
  create() {
    document.querySelector("#loading-status").textContent = "";
    const victoryPreview = resolveVictoryPreview(window.location.href);
    if (victoryPreview.enabled) {
      this.scene.start("game", { state: victoryPreview.state, spawnAtLastFlower: true });
      return;
    }
    const preview = resolvePreviewScene(window.location.href);
    if (preview === "menu" || preview === "game") {
      this.scene.start(preview);
      return;
    }
    this.scene.start(preview, {
      state: {
        flowerIds: Array.from({ length: 10 }, (_, index) => `flower-${index + 1}`),
        dialogueSeen: true,
        gameCompleted: true
      }
    });
  }
}
