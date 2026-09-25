import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jumpPose } from '../../src/core/characterMotion.js';
test('jump has anticipation, airborne peak, landing and a definite end', () => {
  assert.equal(jumpPose(0).frame,0);
  assert.equal(jumpPose(0).height,0);
  assert.equal(jumpPose(280).frame,1);
  assert.equal(jumpPose(280).height,30);
  assert.equal(jumpPose(500).frame,2);
  assert.equal(jumpPose(500).height,0);
  assert.equal(jumpPose(600).finished,true);
  assert.equal(jumpPose(900).height,0);
});
