import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as terrain from '../../src/map/terrainGeometry.js';

test('cliff faces and shoreline margins are not walkable', () => {
  assert.equal(terrain.isSafeGround(200, 348), false);
  assert.equal(terrain.isSafeGround(200, 332), true);
  assert.equal(terrain.isSafeGround(68, 180), false);
  assert.equal(terrain.isSafeGround(90, 180), true);
});
test('bridge entrances remain open but rails and adjacent water are blocked', () => {
  for (const y of [328, 344, 360, 500, 548, 568]) assert.equal(terrain.isSafeGround(352, y), true);
  assert.equal(terrain.isSafeGround(322, 420), false);
  assert.equal(terrain.isSafeGround(390, 550), false);
});
test('physics rectangles match safe ground at bridge and cliff boundaries', () => {
  const rects = terrain.terrainColliders();
  const blocked = (x,y) => rects.some(r => x >= r.x && x < r.x+r.w && y >= r.y && y < r.y+r.h);
  assert.equal(blocked(200,348), true);
  assert.equal(blocked(352,348), false);
  assert.equal(blocked(352,420), false);
  assert.equal(blocked(322,420), true);
});
