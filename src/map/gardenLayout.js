export const TILE = 32;
export const KEY_DOOR_POSITION = Object.freeze({ x: 1680, y: 704 });
export const ISLANDS = [
  { x: 2, y: 2, w: 21, h: 9 },
  { x: 28, y: 3, w: 10, h: 9 },
  { x: 3, y: 17, w: 21, h: 13 },
  { x: 29, y: 17, w: 9, h: 9 },
  { x: 44, y: 3, w: 10, h: 9 },
  { x: 44, y: 17, w: 10, h: 11 }
];
export const BRIDGES = [
  { x: 22, y: 6, w: 7, h: 2, direction: "horizontal" },
  { x: 10, y: 10, w: 2, h: 8, direction: "vertical" },
  { x: 32, y: 11, w: 2, h: 7, direction: "vertical" },
  { x: 23, y: 22, w: 7, h: 2, direction: "horizontal" },
  { x: 37, y: 6, w: 8, h: 2, direction: "horizontal" },
  { x: 37, y: 21, w: 8, h: 2, direction: "horizontal" }
];
export const PATHS = [
  { x: 10, y: 4, w: 2, h: 7 }, { x: 10, y: 6, w: 13, h: 2 },
  { x: 28, y: 6, w: 6, h: 2 }, { x: 32, y: 6, w: 2, h: 6 },
  { x: 10, y: 17, w: 2, h: 11 }, { x: 10, y: 22, w: 14, h: 2 },
  { x: 32, y: 17, w: 2, h: 7 }, { x: 29, y: 22, w: 5, h: 2 },
  { x: 32, y: 6, w: 6, h: 2 }, { x: 44, y: 6, w: 6, h: 2 },
  { x: 35, y: 21, w: 3, h: 2 }, { x: 44, y: 21, w: 9, h: 2 },
  { x: 46, y: 19, w: 2, h: 3 }
];
const inside = (x, y, r) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
export const isLand = (x, y) => ISLANDS.some(r => inside(x, y, r));
export const isWalkable = (x, y) => isLand(x, y) || BRIDGES.some(r => inside(x, y, r));
export const isPath = (x, y) => PATHS.some(r => inside(x, y, r));
export const DECOR = [
  ["tree", 4, 5], ["tree", 19, 5], ["tree", 6, 9],
  ["tree", 36, 4], ["tree", 29, 10],
  ["tree", 5, 20], ["tree", 20, 20], ["tree", 5, 27], ["tree", 20, 28],
  ["tree", 36, 20], ["tree", 36, 25],
  ["tree", 46, 5], ["tree", 52, 5], ["tree", 45, 10], ["tree", 52, 10],
  ["log", 15, 9], ["log", 16, 26], ["log", 30, 20], ["log", 50, 10],
  ["rock", 7, 4], ["rock", 21, 9], ["rock", 30, 5],
  ["rock", 7, 23], ["rock", 17, 19], ["rock", 35, 24],
  ["rock", 47, 4], ["rock", 51, 8],
  ["stump", 8, 8], ["stump", 17, 5], ["stump", 14, 20], ["stump", 7, 28], ["stump", 45, 7],
  ["leaf", 13, 4], ["leaf", 16, 8], ["leaf", 30, 9], ["leaf", 35, 10],
  ["leaf", 8, 19], ["leaf", 15, 25], ["leaf", 21, 26], ["leaf", 30, 24],
  ["leaf", 48, 5], ["leaf", 51, 10],
  ["tree", 46, 26], ["tree", 52, 26],
  ["rock", 47, 24], ["stump", 52, 24], ["leaf", 48, 19], ["leaf", 51, 25]
];
export const GARDEN_LAYOUT = Object.freeze({
  world: { width: 1792, height: 1024 },
  player: { x: 352, y: 272 },
  rabbit: { x: 416, y: 256 },
  flowers: [
    [8, 5], [17, 9], [30, 4], [36, 10], [35, 18],
    [30, 24], [21, 24], [16, 28], [5, 24], [14, 18]
  ].map(([x, y], i) => ({ id: `flower-${i + 1}`, x: x * TILE + 16, y: y * TILE + 16 })),
  obstacles: []
});
