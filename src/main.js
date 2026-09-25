import { createGameConfig } from "./config/gameConfig.js";
import { BootScene } from "./scenes/BootScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { BouquetScene } from "./scenes/BouquetScene.js";
import { LetterScene } from "./scenes/LetterScene.js";
import { HeartCatchScene } from './scenes/HeartCatchScene.js';
import { MickyRaceScene } from './scenes/MickyRaceScene.js';
import { FinalIslandScene } from './scenes/FinalIslandScene.js';

const status = document.querySelector("#loading-status");
window.addEventListener('error', event => {
  status.textContent = `No se pudo iniciar el juego: ${event.message}`;
});
const Phaser = globalThis.Phaser;

if (!Phaser) {
  status.textContent = "No se pudo cargar Phaser. Revisa tu conexión a internet.";
} else {
  const config = createGameConfig(Phaser, [BootScene, MenuScene, GameScene, BouquetScene, LetterScene, HeartCatchScene, MickyRaceScene, FinalIslandScene]);
  new Phaser.Game(config);
  status.textContent = "Preparando el jardín…";
}
