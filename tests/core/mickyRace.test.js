import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRaceState, startRace, tapRace, advanceRace, hasMickyReward, awardMickyFragment } from '../../src/core/mickyRace.js';

test('only a running race accepts taps and a released runner coasts', () => {
  const intro = createRaceState();
  assert.equal(tapRace(intro), intro);
  const running = startRace(intro);
  const tapped = tapRace(running);
  assert.ok(tapped.playerSpeed > running.playerSpeed);
  const coasted = advanceRace(tapped, .5, 0);
  assert.ok(coasted.playerX > tapped.playerX);
  assert.ok(coasted.playerSpeed < tapped.playerSpeed);
});

test('Micky runs 67 units in one second on a straight track', () => {
  let state = startRace(createRaceState());
  for (let frame = 0; frame < 20; frame++) state = advanceRace(state, .05, 0);
  assert.ok(Math.abs(state.catX - 67) < .0001);
});

test('race speeds remain capped and large frame times are clamped', () => {
  let state = startRace(createRaceState());
  for (let i = 0; i < 30; i++) state = tapRace(state);
  assert.ok(state.playerSpeed <= 125);
  const next = advanceRace(state, 5, 0);
  assert.ok(next.playerX - state.playerX <= 7);
});

test('the first interpolated crossing wins even if both cross in one frame', () => {
  const base = startRace(createRaceState());
  const playerFirst = advanceRace({ ...base, playerX: 1047, catX: 1048, playerSpeed: 125, catSpeed: 67 }, .05, 0);
  assert.equal(playerFirst.winner, 'player');
  const catFirst = advanceRace({ ...base, playerX: 1048, catX: 1048, playerSpeed: 28, catSpeed: 67 }, .05, 0);
  assert.equal(catFirst.winner, 'cat');
});

test('Micky reward is granted once and retains other fragments', () => {
  const once = awardMickyFragment({ keyFragments: ['tami', 'coco', 'canelo'] });
  assert.deepEqual(once.keyFragments, ['tami', 'coco', 'canelo', 'micky']);
  assert.equal(hasMickyReward(once), true);
  assert.equal(awardMickyFragment(once), once);
});

test('regular tapping makes a close race and fast tapping can win', () => {
  const simulate = cps => {
    let state = startRace(createRaceState());
    for (let step = 0; step < 600 && !state.winner; step++) {
      if (step % Math.round(20 / cps) === 0) state = tapRace(state);
      state = advanceRace(state, .05, 0);
    }
    return state;
  };
  assert.equal(simulate(3).winner, 'cat');
  assert.ok(Math.abs(simulate(5).playerX - simulate(5).catX) < 250);
  assert.equal(simulate(8).winner, 'player');
});
