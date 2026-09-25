import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createGameConfig } from "../../src/config/gameConfig.js";

describe("createGameConfig", () => {
  it("crea un lienzo 16:9 adaptable y registra las escenas", () => {
    const PhaserStub = {
      AUTO: "AUTO",
      Scale: { FIT: "FIT", CENTER_BOTH: "CENTER_BOTH" }
    };
    const scenes = [{ key: "boot" }, { key: "menu" }];

    const config = createGameConfig(PhaserStub, scenes, "game-root");

    assert.deepEqual({
      type: config.type,
      width: config.width,
      height: config.height,
      parent: config.parent,
      scene: config.scene,
      scale: config.scale
    }, {
      type: "AUTO",
      width: 960,
      height: 540,
      parent: "game-root",
      scene: scenes,
      scale: { mode: "FIT", autoCenter: "CENTER_BOTH" }
    });
  });
});
