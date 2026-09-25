import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MICKY } from '../../src/config/micky.js';
import { isWalkable } from '../../src/map/gardenLayout.js';
import { isWithinInteractionRange } from '../../src/entities/createRabbitNpc.js';
import { createMickyNpc } from '../../src/entities/createMickyNpc.js';

test('Micky stands on reachable land away from the bridge mouth', () => {
  assert.equal(isWalkable(Math.floor(MICKY.position.x / 32), Math.floor(MICKY.position.y / 32)), true);
  assert.ok(MICKY.position.x > 45 * 32);
});

test('Micky only accepts nearby player interaction', () => {
  assert.equal(typeof createMickyNpc, 'function');
  assert.equal(isWithinInteractionRange({ x: 1550, y: 240 }, MICKY.position, 88), true);
  assert.equal(isWithinInteractionRange({ x: 1300, y: 240 }, MICKY.position, 88), false);
});

test('Micky intro alternates the specified ten turns and uses her portraits', () => {
  assert.equal(MICKY.intro.length, 10);
  assert.deepEqual(MICKY.intro.map(line => line.speaker),
    ['Anto', 'Micky', 'Anto', 'Micky', 'Anto', 'Micky', 'Micky', 'Anto', 'Micky', 'Anto']);
  assert.equal(MICKY.intro[6].emotion, 'mischievous');
});
