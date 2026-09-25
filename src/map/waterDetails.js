import { isLand, isWalkable } from './gardenLayout.js';

export function waterTileDetails(tx, ty, phase = 0) {
  if (isWalkable(tx, ty)) return null;
  return {
    shore: {
      north: isLand(tx, ty - 1),
      east: isLand(tx + 1, ty),
      south: isLand(tx, ty + 1),
      west: isLand(tx - 1, ty)
    },
    wave: (tx * 7 + ty * 11 + phase) % 5 === 0
  };
}
