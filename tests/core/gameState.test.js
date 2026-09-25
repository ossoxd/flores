import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectFlower,
  createGameState,
  markDialogueSeen,
  resetGameState
} from "../../src/core/gameState.js";

describe("game state", () => {
  it("empieza vacío", () => {
    assert.deepEqual(createGameState(), {
      flowerIds: [],
      dialogueSeen: false,
      gameCompleted: false,
      cocoIntroSeen: false,
      cocoPuzzleSolved: false,
      maxIntroSeen: false,
      flowersDelivered: false,
      maxCleared: false
    });
  });

  it("recolecta cada flor una sola vez y completa exactamente en diez", () => {
    let state = createGameState();
    for (let index = 1; index <= 10; index += 1) {
      state = collectFlower(state, "flower-" + index);
    }
    const duplicate = collectFlower(state, "flower-10");
    assert.equal(duplicate.flowerIds.length, 10);
    assert.equal(duplicate.gameCompleted, true);
  });

  it("reinicia todos los campos", () => {
    const completed = {
      flowerIds: ["flower-1"],
      dialogueSeen: true,
      gameCompleted: true
    };
    assert.deepEqual(resetGameState(completed), createGameState());
  });

  it("marca el diálogo sin mutar el estado original", () => {
    const initial = createGameState();
    const next = markDialogueSeen(initial);
    assert.equal(next.dialogueSeen, true);
    assert.equal(initial.dialogueSeen, false);
  });
});
