import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bridgeCollisions} from '../../src/map/bridgeCollisions.js';
import {BRIDGES} from '../../src/map/gardenLayout.js';
test('horizontal bridge rails stay solid on land at both entrances',()=>{
  const r=bridgeCollisions(BRIDGES[0]);
  const hit=(x,y)=>r.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h);
  for(const x of [708,920]){assert.equal(hit(x,196),true);assert.equal(hit(x,248),true);assert.equal(hit(x,224),false);}
});
