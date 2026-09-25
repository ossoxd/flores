import { ISLANDS, BRIDGES, TILE, GARDEN_LAYOUT } from './gardenLayout.js';
const contains = (x,y,r) => x >= r.x && y >= r.y && x < r.x+r.w && y < r.y+r.h;
// The outer half-tile is shoreline/cliff, not standing ground.
const ground = ISLANDS.map(r => ({x:r.x*TILE+16,y:r.y*TILE+16,w:r.w*TILE-32,h:r.h*TILE-32}));
const decks = BRIDGES.map(r => r.direction === 'vertical'
  ? {x:r.x*TILE+16,y:r.y*TILE,w:r.w*TILE-32,h:r.h*TILE}
  : {x:r.x*TILE,y:r.y*TILE+16,w:r.w*TILE,h:r.h*TILE-32});
export const isSafeGround = (x,y) => [...ground,...decks].some(r => contains(x,y,r));

export function terrainColliders() {
  const result = [], active = new Map();
  const {width,height} = GARDEN_LAYOUT.world;
  // Merge exact 8px grid runs into rectangles; physics and ground use the same geometry.
  for (let y=0;y<height;y+=8) {
    const next = new Map();
    for (let x=0;x<width;) {
      if (isSafeGround(x+4,y+4)) { x+=8; continue; }
      const start=x;
      while(x<width && !isSafeGround(x+4,y+4)) x+=8;
      const key=`${start}:${x-start}`;
      const previous=active.get(key);
      if(previous) { previous.h+=8; next.set(key,previous); }
      else { const r={x:start,y,w:x-start,h:8}; result.push(r); next.set(key,r); }
    }
    active.clear();
    for(const [key,r] of next) active.set(key,r);
  }
  return result;
}
