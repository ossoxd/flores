import test from 'node:test';
import assert from 'node:assert/strict';
import { CocoPuzzle } from '../../src/ui/CocoPuzzle.js';

// Minimal DOM boundary for the real reveal lifecycle; no browser dependency.
function element() {
  return { children: [], style: { setProperty() {} }, classList: { add() {}, remove() {} },
    append(...nodes) { this.children.push(...nodes); },
    replaceChildren(...nodes) { this.children = nodes; },
    setAttribute() {}, addEventListener() {}, focus() {}, remove() {} };
}
function fixture(t) {
  const previous = globalThis.document;
  globalThis.document = { createElement: element, body: element() };
  t.after(() => { globalThis.document = previous; });
  let now = 0, completed = 0;
  const timers = [];
  const scene = { events: { once() {} }, time: { delayedCall(delay, callback) {
    const timer = { at: now + delay, callback, removed: false, remove() { this.removed = true; } };
    timers.push(timer); return timer;
  } } };
  const puzzle = new CocoPuzzle(scene, () => { completed++; });
  puzzle.root = element();
  puzzle.root.querySelector = () => element();
  puzzle.card = element(); puzzle.board = element(); puzzle.instruction = element();
  return { puzzle, completed: () => completed, advance(ms) {
    now += ms;
    for (const timer of timers) if (!timer.removed && timer.at <= now) {
      timer.removed = true; timer.callback();
    }
  } };
}

test('completed photo stays open past five seconds until explicitly continued', t => {
  const f = fixture(t);
  f.puzzle.revealPhoto();
  f.advance(4999);
  assert.equal(f.puzzle.isOpen, true);
  assert.equal(f.completed(), 0);
  assert.equal(f.puzzle.continueButton.disabled, true);
  f.advance(1);
  assert.equal(f.puzzle.continueButton.disabled, false);
  f.advance(60000);
  assert.equal(f.puzzle.isOpen, true);
  assert.equal(f.completed(), 0);
  f.puzzle.finishReveal();
  f.puzzle.finishReveal();
  assert.equal(f.completed(), 1);
  assert.equal(f.puzzle.isOpen, false);
});

test('early continue and cancellation cannot skip the photo celebration', t => {
  const f = fixture(t);
  f.puzzle.revealPhoto();
  f.puzzle.finishReveal();
  f.puzzle.cancel();
  assert.equal(f.puzzle.isOpen, true);
  assert.equal(f.completed(), 0);
  f.puzzle.close(false);
  f.advance(5000);
  assert.equal(f.completed(), 0);
});
