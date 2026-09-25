import girlPortraits from '../../public/assets/custom/portraits/girl-portraits.js';
import rabbitPortraits from '../../public/assets/custom/portraits/rabbit-portraits.js';
import walkSheet from '../../public/assets/custom/girlfriend/girlfriend-walk-v3.js';
import tamiSheet from '../../public/assets/custom/tami/tami-tail-wag.js';
import tamiPortraits from '../../public/assets/custom/tami/tami-portraits.js';
import cocoSheet from '../../public/assets/custom/coco/coco-idle.js';
import cocoPortraits from '../../public/assets/custom/coco/coco-portraits.js';
import caneloSheet from '../../public/assets/custom/canelo/canelo-sheet.js';
import caneloDialogue from '../../public/assets/custom/canelo/canelo-dialogue-user.js';
import heartCatchBackground from '../../public/assets/custom/ui/heart-catch-background.js';
import caneloObstacles from '../../public/assets/custom/canelo/canelo-obstacles.js';
import mickyIdle from '../../public/assets/custom/micky/micky-idle.js';
import mickyRun from '../../public/assets/custom/micky/micky-run-v2.js';
import mickyPortraits from '../../public/assets/custom/micky/micky-portraits.js';
import maxIdle from '../../public/assets/custom/max/max-idle.js';
import maxWalk from '../../public/assets/custom/max/max-walk.js';
import maxPortraits from '../../public/assets/custom/max/max-portraits.js';
import keyFull from '../../public/assets/custom/max/key-full.js';
import keyTami from '../../public/assets/custom/max/key-tami.js';
import keyCoco from '../../public/assets/custom/max/key-coco.js';
import keyCanelo from '../../public/assets/custom/max/key-canelo.js';
import keyMicky from '../../public/assets/custom/max/key-micky.js';
import keyPodium from '../../public/assets/custom/max/key-podium.js';
import magicDoor from '../../public/assets/custom/max/magic-door.js';
import sergioSheet from '../../public/assets/custom/sergio/sergio-sheet.js';
import sergioPortraits from '../../public/assets/custom/sergio/sergio-portraits-user.js';
import romanticPergola from '../../public/assets/custom/romantic/pergola.js';
import romanticHeart from '../../public/assets/custom/romantic/flower-heart.js';
import romanticLantern from '../../public/assets/custom/romantic/lantern.js';
import romanticBorder from '../../public/assets/custom/romantic/flower-border.js';
import romanticPot from '../../public/assets/custom/romantic/planter-pot.js';
import romanticCurve from '../../public/assets/custom/romantic/planter-curve.js';
import romanticRow from '../../public/assets/custom/romantic/planter-row.js';
export const ASSETS = Object.freeze({
  romanticPergola: { type: 'image', key: 'romantic-pergola', url: romanticPergola },
  romanticHeart: { type: 'image', key: 'romantic-heart', url: romanticHeart },
  romanticLantern: { type: 'image', key: 'romantic-lantern', url: romanticLantern },
  romanticBorder: { type: 'image', key: 'romantic-border', url: romanticBorder },
  romanticPot: { type: 'image', key: 'romantic-pot', url: romanticPot },
  romanticCurve: { type: 'image', key: 'romantic-curve', url: romanticCurve },
  romanticRow: { type: 'image', key: 'romantic-row', url: romanticRow },
  sergio: { type: 'spritesheet', key: 'sergio', url: sergioSheet, frameWidth: 64, frameHeight: 64 },
  sergioPortraits: { type: 'spritesheet', key: 'sergio-portraits', url: sergioPortraits, frameWidth: 256, frameHeight: 256 },
  magicDoor: { type: 'spritesheet', key: 'magic-door', url: magicDoor, frameWidth: 96, frameHeight: 128 },
  keyPodium: { type: 'image', key: 'key-podium', url: keyPodium },
  keyFull: { type: 'image', key: 'key-full', url: keyFull },
  keyTami: { type: 'image', key: 'key-tami', url: keyTami },
  keyCoco: { type: 'image', key: 'key-coco', url: keyCoco },
  keyCanelo: { type: 'image', key: 'key-canelo', url: keyCanelo },
  keyMicky: { type: 'image', key: 'key-micky', url: keyMicky },
  maxIdle: { type: 'spritesheet', key: 'max-idle', url: maxIdle, frameWidth: 64, frameHeight: 64 },
  maxWalk: { type: 'spritesheet', key: 'max-walk', url: maxWalk, frameWidth: 64, frameHeight: 64 },
  maxPortraits: { type: 'spritesheet', key: 'max-portraits', url: maxPortraits, frameWidth: 128, frameHeight: 128 },
  mickyIdle: { type: 'spritesheet', key: 'micky-idle', url: mickyIdle, frameWidth: 64, frameHeight: 64 },
  mickyRun: { type: 'spritesheet', key: 'micky-run', url: mickyRun, frameWidth: 64, frameHeight: 64 },
  mickyPortraits: { type: 'spritesheet', key: 'micky-portraits', url: mickyPortraits, frameWidth: 128, frameHeight: 128 },
  heartCatchBackground: { type: 'image', key: 'heart-catch-background', url: heartCatchBackground },
  ...Object.fromEntries(Object.entries(caneloObstacles).map(([name, url]) => [
    `caneloObstacle${name}`, { type: 'image', key: `catch-hazard-${name}`, url }
  ])),
  canelo: { type: 'image', key: 'canelo-source', url: caneloSheet },
  caneloDialogue: { type: 'image', key: 'canelo-dialogue-source', url: caneloDialogue },
  tami: { type: 'image', key: 'tami-sheet', url: tamiSheet },
  tamiPortraits: { type: 'spritesheet', key: 'tami-portraits', url: tamiPortraits, frameWidth: 627, frameHeight: 627 },
  coco: { type: 'image', key: 'coco-source', url: cocoSheet },
  cocoPortraits: { type: 'image', key: 'coco-portraits', url: cocoPortraits },
  girlPortraits: {type:'spritesheet',key:'girl-portraits',url:girlPortraits,frameWidth:256,frameHeight:256},
  rabbitPortraits: {type:'spritesheet',key:'rabbit-portraits',url:rabbitPortraits,frameWidth:256,frameHeight:256},
  tileset: {
    type: "image",
    key: "autumn-tileset",
    url: "/assets/carrot-island/carrot%20island%20-%20free%20pack/carrot%20island%20-%20free%20pack/tileset/autumn.png"
  },
  rabbit: {
    type: "spritesheet",
    key: "rabbit",
    url: "/assets/carrot-island/carrot%20island%20-%20free%20pack/carrot%20island%20-%20free%20pack/character/bunnyidle.png",
    frameWidth: 32,
    frameHeight: 32
  },
  rabbitRun: {
    type: "spritesheet",
    key: "rabbit-run",
    url: "/assets/carrot-island/carrot%20island%20-%20free%20pack/carrot%20island%20-%20free%20pack/character/bunnyrun.png",
    frameWidth: 32,
    frameHeight: 32
  },
  girlfriend: {
    type: "spritesheet",
    key: "girlfriend-run",
    url: walkSheet,
    frameWidth: 256,
    frameHeight: 256
  },
  girlfriendIdle: {
    type: "spritesheet",
    key: "girlfriend-idle",
    url: "/assets/custom/girlfriend/girlfriend-idle-v2.png",
    frameWidth: 256,
    frameHeight: 256
  },
  girlfriendJump: {
    type: "spritesheet",
    key: "girlfriend-jump",
    url: "/assets/custom/girlfriend/girlfriend-jump-v2.png",
    frameWidth: 256,
    frameHeight: 256
  },
  yellowFlower: {
    type: "image",
    key: "yellow-flower",
    url: "/assets/custom/flowers/yellow-flower.png"
  },
  bouquet: {
    type: "image",
    key: "bouquet",
    url: "/assets/custom/bouquet/bouquet.png"
  },
  petal: {
    type: "image",
    key: "petal",
    url: "/assets/custom/bouquet/petal.png"
  },
  dialoguePanel: {
    type: "image",
    key: "dialogue-panel",
    url: "/assets/custom/ui/dialogue-panel.png"
  }
});
