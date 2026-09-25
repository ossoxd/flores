import test from "node:test";
import assert from "node:assert/strict";
import { resolvePreviewScene, resolveVictoryPreview } from "../../src/core/previewScene.js";

test("allows final-scene previews on localhost", () => {
  assert.equal(resolvePreviewScene("http://localhost:5173/?preview=bouquet"), "bouquet");
  assert.equal(resolvePreviewScene("http://127.0.0.1:5173/?preview=letter"), "letter");
});

test("ignores preview parameters outside localhost", () => {
  assert.equal(resolvePreviewScene("https://example.com/?preview=letter"), "menu");
  assert.equal(resolvePreviewScene("http://localhost:5173/?preview=unknown"), "menu");
});

test("prepares a nine-flower victory check only on localhost", () => {
  const local = resolveVictoryPreview("http://localhost:5173/?preview=game&testVictory=1");
  assert.equal(local.enabled, true);
  assert.equal(local.state.flowerIds.length, 9);
  assert.equal(local.state.gameCompleted, false);

  const remote = resolveVictoryPreview("https://example.com/?preview=game&testVictory=1");
  assert.equal(remote.enabled, false);
});
