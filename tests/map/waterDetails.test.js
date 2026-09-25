import assert from 'node:assert/strict';
import { test } from 'node:test';
import { waterTileDetails } from '../../src/map/waterDetails.js';

test('water gets a pale shoreline only beside land, never over land or bridges', () => {
  assert.deepEqual(waterTileDetails(1, 4, 0).shore, { north: false, east: true, south: false, west: false });
  assert.equal(waterTileDetails(0, 0, 0).shore.east, false);
  assert.equal(waterTileDetails(2, 4, 0), null);
  assert.equal(waterTileDetails(23, 6, 0), null);
});

test('wave highlights animate across water without changing shoreline placement', () => {
  const first = waterTileDetails(0, 0, 0);
  const second = waterTileDetails(0, 0, 1);
  assert.notEqual(first.wave, second.wave);
  assert.deepEqual(first.shore, second.shore);
});
