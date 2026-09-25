import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextSceneFor } from "../../src/core/progression.js";

describe("scene progression", () => {
  it("permanece en game mientras falten flores", () => {
    assert.equal(nextSceneFor({ gameCompleted: false }), "game");
  });

  it("avanza a bouquet al completar", () => {
    assert.equal(nextSceneFor({ gameCompleted: true }), "bouquet");
  });
});
