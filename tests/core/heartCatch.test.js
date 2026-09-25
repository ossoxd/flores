import test from 'node:test';
import assert from 'node:assert/strict';
import { createCatchState, catchItem, catchDifficulty, awardCaneloFragment } from '../../src/core/heartCatch.js';

test('trash only resets combo; only rocks slow down and no hearts are lost', () => {
  const before = { ...createCatchState(), hearts: 12, streak: 7, combo: 7 };
  for (const type of ['can', 'paper', 'banana', 'sock']) {
    const { state, messages } = catchItem(before, type, 100);
    assert.equal(state.hearts, 12); assert.equal(state.combo, 1);
    assert.equal(state.slowUntil, 0); assert.deepEqual(messages, []);
  }
  const slowed = catchItem(before, 'rock', 100).state;
  assert.equal(slowed.slowUntil, 1600);
  assert.equal(slowed.hearts, 12);
  assert.equal(before.combo, 7);
});

test('hearts always count as one and milestones never replay after a broken combo', () => {
  let state = createCatchState(), messages = [];
  for (let i = 0; i < 5; i++) {
    const result = catchItem(state, 'heart', i); state = result.state; messages.push(...result.messages);
  }
  assert.equal(state.hearts, 5); assert.equal(state.combo, 5); assert.equal(messages.length, 2);
  state = catchItem(state, 'sock', 10).state;
  messages = [];
  for (let i = 0; i < 5; i++) {
    const result = catchItem(state, 'heart', i + 20); state = result.state; messages.push(...result.messages);
  }
  assert.equal(state.hearts, 10);
  assert.deepEqual(messages, ['Todavía haces sonreír a Sergio como un tonto.']);
  assert.deepEqual(createCatchState().shown, []);
});

test('goal stops scoring and requires catching the key before winning', () => {
  let state = createCatchState();
  assert.equal(catchItem(state, 'key', 0).state, state);
  for (let i = 0; i < 30; i++) state = catchItem(state, 'heart', i).state;
  assert.equal(state.phase, 'key');
  assert.equal(catchItem(state, 'heart', 50).state.hearts, 30);
  assert.equal(catchItem(state, 'rock', 50).state, state);
  assert.equal(catchItem(state, 'key', 60).state.phase, 'won');
});

test('heart rain is generous and Canelo reward preserves other fragments without duplicates', () => {
  assert.ok(catchDifficulty(19).speed > catchDifficulty(0).speed);
  assert.ok(catchDifficulty(26).speed > catchDifficulty(19).speed);
  assert.ok(catchDifficulty(27).badChance < catchDifficulty(26).badChance);
  const original = { keyFragments: ['tami', 'coco'], flowerIds: ['flower-1'] };
  const won = awardCaneloFragment(original);
  assert.deepEqual(won.keyFragments, ['tami', 'coco', 'canelo']);
  assert.equal(awardCaneloFragment(won), won);
  assert.deepEqual(original.keyFragments, ['tami', 'coco']);
});

test('obstacles are common from the start and every supplied hazard can appear', () => {
  const opening = catchDifficulty(0);
  assert.ok(opening.badChance >= 0.27);
  assert.ok(opening.interval <= 700);
  assert.deepEqual(new Set(opening.trash), new Set([
    'banana', 'rock', 'paper', 'can', 'bomb', 'skull', 'owl', 'lipstick'
  ]));
  const middle = catchDifficulty(10);
  assert.ok(middle.badChance > opening.badChance);
  assert.ok(middle.interval < opening.interval);
  for (const type of opening.trash) {
    const result = catchItem({ ...createCatchState(), hearts: 4, combo: 4, streak: 4 }, type, 100);
    assert.equal(result.state.hearts, 4);
    assert.equal(result.state.combo, 1);
    assert.equal(result.state.slowUntil > 0, type === 'rock');
  }
});
