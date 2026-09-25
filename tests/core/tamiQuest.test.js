import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isTamiQuizCorrect, awardTamiFragment, hasTamiReward } from '../../src/core/tamiQuest.js';

test('Tami only accepts all four correct answers: C, A, B, B', () => {
  assert.equal(isTamiQuizCorrect([2, 0, 1, 1]), true);
  assert.equal(isTamiQuizCorrect([2, 0, 1]), false);
  assert.equal(isTamiQuizCorrect([2, 0, 1, 1, 1]), false);
  for (let index = 0; index < 4; index++) {
    const answers = [2, 0, 1, 1];
    answers[index] = (answers[index] + 1) % 4;
    assert.equal(isTamiQuizCorrect(answers), false);
  }
});

test('fragment is granted once, preserves other rewards and does not mutate the state', () => {
  const original = { flowerIds: ['flower-1'], keyFragments: ['another-pet'] };
  const awarded = awardTamiFragment(original);
  assert.equal(hasTamiReward(original), false);
  assert.equal(hasTamiReward(awarded), true);
  assert.deepEqual(awarded.keyFragments, ['another-pet', 'tami']);
  assert.deepEqual(original.keyFragments, ['another-pet']);
  assert.equal(awardTamiFragment(awarded), awarded);
});

test('old game states without the new field are supported', () => {
  assert.equal(hasTamiReward({}), false);
  assert.deepEqual(awardTamiFragment({}).keyFragments, ['tami']);
});
