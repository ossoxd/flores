import test from 'node:test';
import assert from 'node:assert/strict';
import { createMagicDoor } from '../src/entities/createMagicDoor.js';
import { KEY_DOOR_POSITION } from '../src/map/gardenLayout.js';

globalThis.Phaser = { Math: { Clamp: (v, min, max) => Math.min(max, Math.max(min, v)) } };

function fixture() {
  let collisionCallback;
  let trips = 0;
  const object = () => new Proxy({}, { get(target, key) {
    return (...args) => { target[key + 'Value'] = args; return new Proxy(target, this); };
  } });
  const scene = {
    player: { x: KEY_DOOR_POSITION.x, y: KEY_DOOR_POSITION.y + 24 },
    state: { hasCompleteKey: false },
    add: { sprite: object, graphics: object, zone: object, text: object },
    physics: { add: { existing() {}, collider(_player, _zone, callback) { collisionCallback = callback; } } }
  };
  const door = createMagicDoor(scene, () => { trips++; });
  return { scene, door, collide: () => collisionCallback(), trips: () => trips };
}

test('touching the open doorway cannot bypass the complete-key requirement', () => {
  const f = fixture();
  f.door.update(f.scene.player, 1000);
  assert.equal(f.collide(), false);
  assert.equal(f.trips(), 0);
  f.scene.state.hasCompleteKey = true;
  assert.equal(f.collide(), true);
  assert.equal(f.trips(), 1);
  assert.equal(f.door.tryEnter(), false);
  assert.equal(f.trips(), 1);
});

test('door waits for opening, blocks during dialogue/rewards and cannot trigger from afar', () => {
  const f = fixture();
  f.scene.state.hasCompleteKey = true;
  f.door.update(f.scene.player, 16);
  assert.equal(f.door.tryEnter(), false);
  f.door.update(f.scene.player, 1000, false);
  assert.equal(f.collide(), false);
  f.scene.player.x -= 180;
  f.door.update(f.scene.player, 1000, true);
  assert.equal(f.door.tryEnter(), false);
  f.scene.player.x += 180;
  f.door.update(f.scene.player, 1000, true);
  assert.equal(f.door.tryEnter(), true);
  assert.equal(f.trips(), 1);
});
