import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { advanceDialogue, createDialogue } from "../../src/core/dialogueFlow.js";

describe("dialogue flow", () => {
  it("termina inmediatamente cuando no hay líneas", () => {
    assert.equal(createDialogue([]).finished, true);
  });

  it("avanza sin superar la última línea", () => {
    const start = createDialogue(["uno", "dos"]);
    const second = advanceDialogue(start);
    const finished = advanceDialogue(second);
    assert.deepEqual(second, {
      lines: ["uno", "dos"],
      index: 1,
      finished: false
    });
    assert.deepEqual(finished, {
      lines: ["uno", "dos"],
      index: 1,
      finished: true
    });
    assert.deepEqual(advanceDialogue(finished), finished);
  });
});
