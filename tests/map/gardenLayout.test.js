import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GARDEN_LAYOUT, TILE, ISLANDS, BRIDGES, DECOR, isLand, isWalkable } from "../../src/map/gardenLayout.js";
import { validateGardenLayout } from "../../src/map/validateGardenLayout.js";
import { isSafeGround, terrainColliders } from "../../src/map/terrainGeometry.js";

describe("garden layout", () => {
  it("contiene protagonista, conejo, diez flores y cero zanahorias", () => {
    assert.deepEqual(validateGardenLayout(GARDEN_LAYOUT), []);
    assert.equal(GARDEN_LAYOUT.flowers.length, 10);
    assert.ok(isLand(Math.floor(GARDEN_LAYOUT.player.x / TILE), Math.floor(GARDEN_LAYOUT.player.y / TILE)));
    assert.ok(isLand(Math.floor(GARDEN_LAYOUT.rabbit.x / TILE), Math.floor(GARDEN_LAYOUT.rabbit.y / TILE)));
    assert.equal(JSON.stringify(GARDEN_LAYOUT).toLowerCase().includes("carrot"), false);
  });

  it("rechaza ids de flores repetidos", () => {
    const invalid = {
      ...GARDEN_LAYOUT,
      flowers: GARDEN_LAYOUT.flowers.map((flower, index) => ({
        ...flower,
        id: index < 2 ? "repeated" : flower.id
      }))
    };
    assert.deepEqual(validateGardenLayout(invalid), ["Los ids de flores deben ser únicos"]);
  });

  it("mantiene flores y obstáculos dentro del mundo", () => {
    const { width, height } = GARDEN_LAYOUT.world;
    for (const point of [GARDEN_LAYOUT.player, GARDEN_LAYOUT.rabbit, ...GARDEN_LAYOUT.flowers]) {
      assert.ok(point.x >= 0 && point.x <= width);
      assert.ok(point.y >= 0 && point.y <= height);
    }
    for (const obstacle of GARDEN_LAYOUT.obstacles) {
      assert.ok(obstacle.x >= 0);
      assert.ok(obstacle.y >= 0);
      assert.ok(obstacle.x + obstacle.width <= width);
      assert.ok(obstacle.y + obstacle.height <= height);
    }
  });
});

it("every flower is reachable from spawn across land and bridges", () => {
  const start = [Math.floor(GARDEN_LAYOUT.player.x / TILE), Math.floor(GARDEN_LAYOUT.player.y / TILE)];
  const queue = [start], visited = new Set([start.join(",")]);
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const next = [x+dx,y+dy], key = next.join(",");
      if (isWalkable(...next) && !visited.has(key)) { visited.add(key); queue.push(next); }
    }
  }
  for (const f of GARDEN_LAYOUT.flowers) {
    assert.ok(visited.has([Math.floor(f.x/TILE),Math.floor(f.y/TILE)].join(",")), f.id);
  }
});

it("bridges start and end on land and cross actual water", () => {
  for (const b of BRIDGES) {
    const vertical = b.direction === "vertical";
    assert.ok(isLand(b.x, b.y));
    assert.ok(isLand(b.x+(vertical?0:b.w-1), b.y+(vertical?b.h-1:0)));
    assert.ok(!isLand(b.x+(vertical?0:Math.floor(b.w/2)), b.y+(vertical?Math.floor(b.h/2):0)));
  }
});

it("the new island east of Tami is reachable across a guarded bridge", () => {
  const island = ISLANDS.find(r => r.x > 38 && r.y < 12);
  assert.ok(island, 'falta la isla al este de Tami');
  const bridge = BRIDGES.find(r => r.direction === 'horizontal' && r.x < island.x && r.x + r.w > island.x);
  assert.ok(bridge, 'falta el puente desde Tami');
  assert.ok(GARDEN_LAYOUT.world.width >= (island.x + island.w + 1) * TILE);
  assert.equal(isLand(bridge.x, bridge.y), true);
  assert.equal(isLand(island.x, bridge.y), true);
  assert.equal(isLand(bridge.x + 2, bridge.y), false);
  const middleY = bridge.y * TILE + TILE;
  assert.equal(isSafeGround(bridge.x * TILE + 24, middleY), true);
  assert.equal(isSafeGround((island.x - 1) * TILE + 24, middleY), true);
  assert.equal(isSafeGround((island.x - 1) * TILE + 24, bridge.y * TILE + 4), false);
  const blocked = terrainColliders();
  assert.ok(!blocked.some(r => (island.x - 1) * TILE + 24 >= r.x && (island.x - 1) * TILE + 24 < r.x + r.w
    && middleY >= r.y && middleY < r.y + r.h));
  const start = [Math.floor(GARDEN_LAYOUT.player.x / TILE), Math.floor(GARDEN_LAYOUT.player.y / TILE)];
  const goal = [island.x + Math.floor(island.w / 2), island.y + Math.floor(island.h / 2)];
  const queue = [start], seen = new Set([start.join(',')]);
  for (let i = 0; i < queue.length; i++) for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
    const next = [queue[i][0] + dx, queue[i][1] + dy], key = next.join(',');
    if (isWalkable(...next) && !seen.has(key)) { seen.add(key); queue.push(next); }
  }
  assert.ok(seen.has(goal.join(',')), 'el centro debe ser accesible para el futuro NPC');
  assert.ok(DECOR.some(([, x]) => x >= island.x));
  assert.ok(!DECOR.some(([, x, y]) => Math.abs(x - goal[0]) < 2 && Math.abs(y - goal[1]) < 2),
    'el centro del NPC debe quedar despejado');
});
