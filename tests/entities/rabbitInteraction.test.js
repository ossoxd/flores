import test from "node:test";
import assert from "node:assert/strict";
import { isWithinInteractionRange } from "../../src/entities/createRabbitNpc.js";

test("the rabbit can be spoken to only from nearby", () => {
  const rabbit = { x: 100, y: 100 };

  assert.equal(isWithinInteractionRange({ x: 155, y: 100 }, rabbit, 72), true);
  assert.equal(isWithinInteractionRange({ x: 200, y: 100 }, rabbit, 72), false);
});
