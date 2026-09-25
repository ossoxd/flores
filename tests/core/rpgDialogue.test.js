import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CONTENT} from '../../src/config/content.js';
test('conversation alternates actors and preserves the interruption and slow ellipsis',()=>{
  assert.equal(CONTENT.rabbit.length,13);
  assert.equal(CONTENT.rabbit[0].speaker,'Anto');
  assert.equal(CONTENT.rabbit[1].text,'67');
  assert.equal(CONTENT.rabbit[6].slowDots,true);
  assert.equal(CONTENT.rabbit[9].text,'Pantaloneta');
  assert.ok(CONTENT.rabbit[9].autoAdvanceMs<800);
  assert.equal(CONTENT.rabbit[10].emotion,'angry');
  assert.equal(CONTENT.rabbit[12].emotion,'joyful');
});
test('repeat conversation has the three requested short replies',()=>{
  assert.deepEqual(CONTENT.rabbitRepeat?.map(l=>l.text),['67','¿Ya terminaste?','Un brawlsito']);
});
