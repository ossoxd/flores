# Juego de flores amarillas - Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Construir un minijuego web 2D en el que la protagonista recolecta diez flores amarillas y desbloquea un ramo y una carta romántica.

**Architecture:** Phaser 4 organiza la experiencia en cinco escenas pequeñas. La lógica comprobable vive en módulos puros sin dependencia del navegador; las escenas consumen esos módulos y presentan los assets, controles y transiciones.

**Tech Stack:** Node.js 24.19.0, JavaScript ESM, Phaser 4.2.1, Vite 8.3.0 y Vitest 5.0.1.

**Spec:** docs/superpowers/specs/2026-09-21-flores-amarillas-game-design.md

## Global Constraints

- El juego debe funcionar en navegador de computador y celular.
- La partida debe durar aproximadamente uno o dos minutos.
- No habrá combate, vidas, cronómetro ni condición de derrota.
- Los assets de Carrot Island se usarán sin modificar y no se colocarán zanahorias.
- La novia será la protagonista: cabello corto café oscuro con flequillo, cuello alto negro, cardigan rosado claro, falda negra por encima de la rodilla y zapatos cafés.
- El conejo original será un NPC.
- Habrá exactamente diez flores amarillas recolectables.
- El flujo será menú, juego, ramo y carta.
- No se añadirá un framework de interfaz.
- No se dependerá del audio para completar la experiencia.

## Review Focus

- Un asset ausente debe mostrar su ruta en un error legible y no dejar una pantalla en blanco; se prueba en Task 4.
- Recolectar dos veces la misma flor no debe aumentar el contador; se prueba en Task 2.
- La victoria debe emitirse una sola vez al llegar exactamente a diez flores; se prueba en Task 2.
- Reiniciar después de completar el juego debe restaurar flores, diálogo y victoria; se prueba en Task 2.
- El diseño del mapa debe contener diez flores, un NPC y cero zanahorias; se prueba en Task 3.

---

## File Structure

~~~text
index.html                         Contenedor accesible del juego
package.json                       Dependencias y comandos
src/main.js                        Punto de entrada
src/styles.css                     Página, lienzo y controles adaptables
src/config/assets.js               Catálogo canónico de assets
src/config/content.js              Diálogo y carta editables
src/config/gameConfig.js           Configuración de Phaser
src/core/gameState.js              Estado y reglas de recolección
src/core/dialogueFlow.js           Avance del diálogo
src/core/progression.js            Decisiones de transición
src/map/gardenLayout.js            Posiciones lógicas del mapa
src/map/validateGardenLayout.js    Validación del mapa
src/entities/createPlayer.js       Sprite y animaciones de la protagonista
src/entities/createRabbitNpc.js    NPC e interacción
src/entities/createFlowers.js      Objetos recolectables
src/ui/DialogueBox.js              Caja de diálogo
src/ui/TouchControls.js            Entrada táctil
src/scenes/BootScene.js            Precarga y errores de assets
src/scenes/MenuScene.js            Pantalla inicial
src/scenes/GameScene.js            Nivel principal
src/scenes/BouquetScene.js         Revelación del ramo
src/scenes/LetterScene.js          Carta y reinicio
tests/config/gameConfig.test.js
tests/config/assets.test.js
tests/core/gameState.test.js
tests/core/dialogueFlow.test.js
tests/core/progression.test.js
tests/map/gardenLayout.test.js
tests/scenes/bootErrors.test.js
public/assets/carrot-island/        Copia autorizada del pack original
public/assets/custom/girlfriend/    Sprite nuevo de la protagonista
public/assets/custom/flowers/       Flores amarillas nuevas
public/assets/custom/bouquet/       Ramo y pétalos
public/assets/custom/ui/            Interfaz nueva
~~~

### Task 1: Base ejecutable y configuración de Phaser

**Files:**

- Create: package.json
- Create: index.html
- Create: src/main.js
- Create: src/styles.css
- Create: src/config/gameConfig.js
- Create: tests/config/gameConfig.test.js

**Interfaces:**

- Consumes: ninguna.
- Produces: createGameConfig(Phaser, scenes, parent) y el comando npm run dev.

- [ ] **Step 1: Crear el manifiesto e instalar versiones fijadas**

Crear package.json:

~~~json
{
  "name": "flores-amarillas",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "phaser": "4.2.1"
  },
  "devDependencies": {
    "vite": "8.3.0",
    "vitest": "5.0.1"
  }
}
~~~

Run: npm install

Expected: package-lock.json creado sin errores.

- [ ] **Step 2: Escribir la prueba fallida de configuración**

Crear tests/config/gameConfig.test.js:

~~~js
import { describe, expect, it } from "vitest";
import { createGameConfig } from "../../src/config/gameConfig.js";

describe("createGameConfig", () => {
  it("crea un lienzo 16:9 adaptable y registra las escenas", () => {
    const PhaserStub = {
      AUTO: "AUTO",
      Scale: { FIT: "FIT", CENTER_BOTH: "CENTER_BOTH" }
    };
    const scenes = [{ key: "boot" }, { key: "menu" }];

    const config = createGameConfig(PhaserStub, scenes, "game-root");

    expect(config).toMatchObject({
      type: "AUTO",
      width: 960,
      height: 540,
      parent: "game-root",
      scene: scenes,
      scale: { mode: "FIT", autoCenter: "CENTER_BOTH" }
    });
  });
});
~~~

- [ ] **Step 3: Ejecutar la prueba y confirmar que falla**

Run: npm test -- tests/config/gameConfig.test.js

Expected: FAIL porque src/config/gameConfig.js no existe.

- [ ] **Step 4: Implementar configuración y página mínima**

Crear src/config/gameConfig.js:

~~~js
export function createGameConfig(Phaser, scenes, parent = "game-root") {
  return {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent,
    backgroundColor: "#8fd36b",
    scene: scenes,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: "arcade",
      arcade: { debug: false }
    }
  };
}
~~~

Crear index.html con un main de id game-root, un párrafo de id loading-status y el script module /src/main.js. Crear src/styles.css con body centrado, fondo #fff7e8, ancho y alto completos, touch-action none y canvas con image-rendering pixelated. Crear src/main.js importando Phaser, createGameConfig y estilos; inicialmente pasar un arreglo vacío de escenas y construir new Phaser.Game(config).

- [ ] **Step 5: Verificar pruebas y compilación**

Run: npm test

Expected: PASS, 1 test.

Run: npm run build

Expected: Vite genera dist sin errores.

- [ ] **Step 6: Commit**

~~~bash
git add package.json package-lock.json index.html src tests
git commit -m "chore: scaffold Phaser game"
~~~

### Task 2: Estado, recolección, diálogo y progresión

**Files:**

- Create: src/config/content.js
- Create: src/core/gameState.js
- Create: src/core/dialogueFlow.js
- Create: src/core/progression.js
- Create: tests/core/gameState.test.js
- Create: tests/core/dialogueFlow.test.js
- Create: tests/core/progression.test.js

**Interfaces:**

- Consumes: ninguna dependencia de Phaser.
- Produces: createGameState(), collectFlower(state, flowerId), resetGameState(), createDialogue(lines), advanceDialogue(flow) y nextSceneFor(state).

- [ ] **Step 1: Escribir pruebas fallidas del estado**

Crear tests/core/gameState.test.js:

~~~js
import { describe, expect, it } from "vitest";
import {
  collectFlower,
  createGameState,
  markDialogueSeen,
  resetGameState
} from "../../src/core/gameState.js";

describe("game state", () => {
  it("empieza vacío", () => {
    expect(createGameState()).toEqual({
      flowerIds: [],
      dialogueSeen: false,
      gameCompleted: false
    });
  });

  it("recolecta cada flor una sola vez y completa exactamente en diez", () => {
    let state = createGameState();
    for (let index = 1; index <= 10; index += 1) {
      state = collectFlower(state, "flower-" + index);
    }
    const duplicate = collectFlower(state, "flower-10");
    expect(duplicate.flowerIds).toHaveLength(10);
    expect(duplicate.gameCompleted).toBe(true);
  });

  it("reinicia todos los campos", () => {
    const completed = {
      flowerIds: ["flower-1"],
      dialogueSeen: true,
      gameCompleted: true
    };
    expect(resetGameState(completed)).toEqual(createGameState());
  });

  it("marca el diálogo sin mutar el estado original", () => {
    const initial = createGameState();
    const next = markDialogueSeen(initial);
    expect(next.dialogueSeen).toBe(true);
    expect(initial.dialogueSeen).toBe(false);
  });
});
~~~

- [ ] **Step 2: Ejecutar y confirmar el fallo**

Run: npm test -- tests/core/gameState.test.js

Expected: FAIL porque gameState.js no existe.

- [ ] **Step 3: Implementar el estado mínimo**

Crear src/core/gameState.js:

~~~js
export function createGameState() {
  return { flowerIds: [], dialogueSeen: false, gameCompleted: false };
}

export function collectFlower(state, flowerId) {
  if (state.gameCompleted || state.flowerIds.includes(flowerId)) return state;
  const flowerIds = [...state.flowerIds, flowerId];
  return {
    ...state,
    flowerIds,
    gameCompleted: flowerIds.length === 10
  };
}

export function markDialogueSeen(state) {
  return { ...state, dialogueSeen: true };
}

export function resetGameState() {
  return createGameState();
}
~~~

- [ ] **Step 4: Añadir diálogo, progresión y sus pruebas**

Crear src/config/content.js:

~~~js
export const CONTENT = Object.freeze({
  rabbit: [
    "Tengo una misión especial para ti:",
    "encuentra las diez flores amarillas del jardín."
  ],
  letter: "Para ti, mi amor: reuní estas flores para recordarte lo especial que eres para mí. Gracias por llenar mis días de alegría y por hacer más bonito cada momento. Este pequeño jardín es para ti. Te quiero."
});
~~~

Crear src/core/dialogueFlow.js:

~~~js
export function createDialogue(lines) {
  return { lines: [...lines], index: 0, finished: lines.length === 0 };
}

export function advanceDialogue(flow) {
  if (flow.finished) return flow;
  const nextIndex = flow.index + 1;
  return {
    ...flow,
    index: Math.min(nextIndex, flow.lines.length - 1),
    finished: nextIndex >= flow.lines.length
  };
}
~~~

Crear src/core/progression.js:

~~~js
export function nextSceneFor(state) {
  return state.gameCompleted ? "bouquet" : "game";
}
~~~

Crear tests/core/dialogueFlow.test.js y tests/core/progression.test.js:

~~~js
import { describe, expect, it } from "vitest";
import { advanceDialogue, createDialogue } from "../../src/core/dialogueFlow.js";
import { nextSceneFor } from "../../src/core/progression.js";

describe("dialogue flow", () => {
  it("termina inmediatamente cuando no hay líneas", () => {
    expect(createDialogue([]).finished).toBe(true);
  });

  it("avanza sin superar la última línea", () => {
    const start = createDialogue(["uno", "dos"]);
    const second = advanceDialogue(start);
    const finished = advanceDialogue(second);
    expect(second).toMatchObject({ index: 1, finished: false });
    expect(finished).toMatchObject({ index: 1, finished: true });
    expect(advanceDialogue(finished)).toEqual(finished);
  });
});

describe("scene progression", () => {
  it("permanece en game mientras falten flores", () => {
    expect(nextSceneFor({ gameCompleted: false })).toBe("game");
  });

  it("avanza a bouquet al completar", () => {
    expect(nextSceneFor({ gameCompleted: true })).toBe("bouquet");
  });
});
~~~

- [ ] **Step 5: Ejecutar pruebas**

Run: npm test -- tests/core

Expected: PASS para estado, diálogo y progresión.

- [ ] **Step 6: Commit**

~~~bash
git add src/config/content.js src/core tests/core
git commit -m "feat: add game progression rules"
~~~

### Task 3: Contrato de assets y diseño lógico del jardín

**Files:**

- Create: src/config/assets.js
- Create: src/map/gardenLayout.js
- Create: src/map/validateGardenLayout.js
- Create: tests/config/assets.test.js
- Create: tests/map/gardenLayout.test.js
- Create: public/assets/carrot-island/README.md
- Create: public/assets/custom/girlfriend/README.md

**Interfaces:**

- Consumes: la copia descargada de Carrot Island y los assets personalizados aprobados.
- Produces: ASSETS, GARDEN_LAYOUT y validateGardenLayout(layout).

- [ ] **Step 1: Definir el catálogo y escribir su prueba fallida**

Crear tests/config/assets.test.js:

~~~js
import { describe, expect, it } from "vitest";
import { ASSETS } from "../../src/config/assets.js";

describe("asset catalog", () => {
  it("separa assets originales de assets personalizados", () => {
    expect(ASSETS.tileset.url).toMatch(/^\/assets\/carrot-island\//);
    expect(ASSETS.rabbit.url).toMatch(/^\/assets\/carrot-island\//);
    expect(ASSETS.girlfriend.url).toMatch(/^\/assets\/custom\/girlfriend\//);
    expect(ASSETS.yellowFlower.url).toMatch(/^\/assets\/custom\/flowers\//);
  });

  it("no registra zanahorias", () => {
    expect(Object.keys(ASSETS).join(" ").toLowerCase()).not.toContain("carrot");
  });
});
~~~

Run: npm test -- tests/config/assets.test.js

Expected: FAIL porque assets.js no existe.

- [ ] **Step 2: Crear rutas canónicas**

Crear src/config/assets.js:

~~~js
export const ASSETS = Object.freeze({
  gardenMap: { type: "tilemap", key: "garden-map", url: "/assets/carrot-island/garden.json" },
  tileset: { type: "image", key: "summer-tileset", url: "/assets/carrot-island/summer-tileset.png" },
  rabbit: { type: "spritesheet", key: "rabbit", url: "/assets/carrot-island/rabbit.png", frameWidth: 32, frameHeight: 32 },
  girlfriend: { type: "spritesheet", key: "girlfriend", url: "/assets/custom/girlfriend/girlfriend.png", frameWidth: 32, frameHeight: 48 },
  yellowFlower: { type: "image", key: "yellow-flower", url: "/assets/custom/flowers/yellow-flower.png" },
  bouquet: { type: "image", key: "bouquet", url: "/assets/custom/bouquet/bouquet.png" },
  petal: { type: "image", key: "petal", url: "/assets/custom/bouquet/petal.png" },
  dialoguePanel: { type: "image", key: "dialogue-panel", url: "/assets/custom/ui/dialogue-panel.png" }
});
~~~

Los README deben explicar que los nombres canónicos se crean copiando, sin editar, los PNG autorizados del pack. El archivo original del pack no se incluye hasta que el usuario lo coloque en el proyecto. Crear garden.json en Tiled con cuadrícula 16x16, tamaño 100x56, tileset llamado summer-tileset y capas visuales Ground y Decoration; usar únicamente tiles del pack y excluir cualquier tile de zanahoria.

- [ ] **Step 3: Escribir la prueba fallida del mapa**

Crear tests/map/gardenLayout.test.js:

~~~js
import { describe, expect, it } from "vitest";
import { GARDEN_LAYOUT } from "../../src/map/gardenLayout.js";
import { validateGardenLayout } from "../../src/map/validateGardenLayout.js";

describe("garden layout", () => {
  it("contiene protagonista, conejo, diez flores y cero zanahorias", () => {
    expect(validateGardenLayout(GARDEN_LAYOUT)).toEqual([]);
    expect(GARDEN_LAYOUT.flowers).toHaveLength(10);
    expect(GARDEN_LAYOUT.player).toEqual({ x: 480, y: 460 });
    expect(GARDEN_LAYOUT.rabbit).toEqual({ x: 520, y: 420 });
    expect(JSON.stringify(GARDEN_LAYOUT).toLowerCase()).not.toContain("carrot");
  });
});
~~~

- [ ] **Step 4: Implementar el diseño y validador**

Crear src/map/gardenLayout.js:

~~~js
export const GARDEN_LAYOUT = Object.freeze({
  world: { width: 1600, height: 900 },
  player: { x: 480, y: 460 },
  rabbit: { x: 520, y: 420 },
  flowers: [
    { id: "flower-1", x: 260, y: 180 },
    { id: "flower-2", x: 520, y: 180 },
    { id: "flower-3", x: 790, y: 150 },
    { id: "flower-4", x: 1120, y: 210 },
    { id: "flower-5", x: 1360, y: 330 },
    { id: "flower-6", x: 1260, y: 650 },
    { id: "flower-7", x: 980, y: 740 },
    { id: "flower-8", x: 680, y: 690 },
    { id: "flower-9", x: 350, y: 720 },
    { id: "flower-10", x: 180, y: 470 }
  ],
  obstacles: [
    { id: "pond", x: 710, y: 330, width: 260, height: 170 },
    { id: "north-trees", x: 0, y: 0, width: 1600, height: 96 },
    { id: "west-fence", x: 0, y: 96, width: 64, height: 804 },
    { id: "east-fence", x: 1536, y: 96, width: 64, height: 804 }
  ]
});
~~~

Crear src/map/validateGardenLayout.js:

~~~js
export function validateGardenLayout(layout) {
  const errors = [];
  if (!layout.player) errors.push("Falta la posición de player");
  if (!layout.rabbit) errors.push("Falta la posición de rabbit");
  if (!Array.isArray(layout.flowers) || layout.flowers.length !== 10) {
    errors.push("El jardín debe contener exactamente 10 flores");
  }
  const ids = (layout.flowers || []).map((flower) => flower.id);
  if (new Set(ids).size !== ids.length) {
    errors.push("Los ids de flores deben ser únicos");
  }
  if (JSON.stringify(layout).toLowerCase().includes("carrot")) {
    errors.push("El jardín no puede contener zanahorias");
  }
  return errors;
}
~~~

- [ ] **Step 5: Preparar assets definitivos**

Colocar la copia autorizada del pack en public/assets/carrot-island con los nombres canónicos del catálogo, sin editar los píxeles. Generar el sprite final de la novia como cuadrícula 4 direcciones por 3 fotogramas, 32x48 por fotograma; generar una flor amarilla de una sola celda, ramo, pétalo y panel de diálogo con fondo transparente.

Verificación visual: abrir cada PNG a tamaño original, confirmar bordes nítidos, fondo alfa y escala coherente. El sprite de la novia debe conservar cabello corto café oscuro, flequillo, cardigan rosado, cuello alto negro, falda negra sobre la rodilla y zapatos cafés.

- [ ] **Step 6: Ejecutar pruebas y commit**

Run: npm test -- tests/config/assets.test.js tests/map/gardenLayout.test.js

Expected: PASS.

~~~bash
git add src/config/assets.js src/map tests/config tests/map public/assets
git commit -m "feat: define garden and asset contract"
~~~

### Task 4: Precarga segura y menú

**Files:**

- Create: src/scenes/BootScene.js
- Create: src/scenes/MenuScene.js
- Create: src/core/assetErrors.js
- Create: tests/scenes/bootErrors.test.js
- Modify: src/main.js

**Interfaces:**

- Consumes: ASSETS y createGameConfig.
- Produces: formatAssetError(file) y escenas boot y menu.

- [ ] **Step 1: Escribir la prueba fallida del error de asset**

Crear tests/scenes/bootErrors.test.js:

~~~js
import { describe, expect, it } from "vitest";
import { formatAssetError } from "../../src/core/assetErrors.js";

describe("formatAssetError", () => {
  it("incluye la ruta que no pudo cargar", () => {
    expect(formatAssetError("/assets/custom/flowers/yellow-flower.png"))
      .toBe("No se pudo cargar: /assets/custom/flowers/yellow-flower.png");
  });
});
~~~

Run: npm test -- tests/scenes/bootErrors.test.js

Expected: FAIL porque assetErrors.js no existe.

- [ ] **Step 2: Implementar el formateador y BootScene**

Crear src/core/assetErrors.js:

~~~js
export function formatAssetError(file) {
  return "No se pudo cargar: " + file;
}
~~~

Crear src/scenes/BootScene.js:

~~~js
import Phaser from "phaser";
import { ASSETS } from "../config/assets.js";
import { formatAssetError } from "../core/assetErrors.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
    this.failedAssets = [];
  }

  preload() {
    const status = document.querySelector("#loading-status");
    this.load.on("progress", (value) => {
      status.textContent = "Cargando " + Math.round(value * 100) + "%";
    });
    this.load.on("loaderror", (file) => {
      const path = file.src || file.url || file.key;
      this.failedAssets.push(path);
    });

    Object.values(ASSETS).forEach((asset) => {
      if (asset.type === "spritesheet") {
        this.load.spritesheet(asset.key, asset.url, {
          frameWidth: asset.frameWidth,
          frameHeight: asset.frameHeight
        });
      } else if (asset.type === "tilemap") {
        this.load.tilemapTiledJSON(asset.key, asset.url);
      } else {
        this.load.image(asset.key, asset.url);
      }
    });
  }

  create() {
    const status = document.querySelector("#loading-status");
    if (this.failedAssets.length > 0) {
      status.textContent = this.failedAssets.map(formatAssetError).join(" | ");
      return;
    }
    status.hidden = true;
    this.scene.start("menu");
  }
}
~~~

- [ ] **Step 3: Implementar MenuScene**

Crear src/scenes/MenuScene.js:

~~~js
import Phaser from "phaser";
import { createGameState } from "../core/gameState.js";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create() {
    this.add.rectangle(480, 270, 620, 330, 0xfff7e8, 0.96)
      .setStrokeStyle(6, 0xe6b83f);
    this.add.text(480, 190, "Un jardín para ti", {
      fontFamily: "Georgia, serif",
      fontSize: "44px",
      color: "#5a3b24"
    }).setOrigin(0.5);
    this.add.text(480, 250, "Recolecta diez flores amarillas", {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#5a3b24"
    }).setOrigin(0.5);

    const button = this.add.rectangle(480, 330, 230, 64, 0xf4c542)
      .setInteractive({ useHandCursor: true });
    this.add.text(480, 330, "Comenzar", {
      fontFamily: "Arial, sans-serif",
      fontSize: "28px",
      color: "#3f2d1d"
    }).setOrigin(0.5);

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      this.scene.start("game", { state: createGameState() });
    };
    button.on("pointerup", start);
    this.input.keyboard.once("keydown-ENTER", start);
  }
}
~~~

- [ ] **Step 4: Registrar escenas y verificar**

Modificar main.js para importar BootScene, MenuScene, GameScene, BouquetScene y LetterScene y pasar ese arreglo a createGameConfig. Mientras las tres últimas aún no tengan su lógica, crear cada clase con constructor que llame super con las claves game, bouquet y letter, respectivamente.

~~~js
const scenes = [BootScene, MenuScene, GameScene, BouquetScene, LetterScene];
const config = createGameConfig(Phaser, scenes);
new Phaser.Game(config);
~~~

Run: npm test

Expected: PASS.

Run: npm run build

Expected: PASS.

- [ ] **Step 5: Verificación manual**

Run: npm run dev

Abrir la URL de Vite. Con assets presentes, debe aparecer el menú. Renombrar temporalmente yellow-flower.png, recargar y confirmar que la ruta faltante aparece en #loading-status; restaurar el nombre inmediatamente.

- [ ] **Step 6: Commit**

~~~bash
git add src/scenes src/core/assetErrors.js src/main.js tests/scenes
git commit -m "feat: add safe preload and start menu"
~~~

### Task 5: Protagonista, mapa y controles

**Files:**

- Create: src/entities/createPlayer.js
- Create: src/ui/TouchControls.js
- Create: src/map/createGardenMap.js
- Modify: src/scenes/GameScene.js
- Modify: src/styles.css

**Interfaces:**

- Consumes: ASSETS, GARDEN_LAYOUT y Phaser Arcade Physics.
- Produces: createPlayer(scene, position), createGardenMap(scene, layout) y TouchControls.

- [ ] **Step 1: Crear el mapa y colisiones**

Crear src/map/createGardenMap.js:

~~~js
export function createGardenMap(scene, layout) {
  const map = scene.make.tilemap({ key: "garden-map" });
  const tileset = map.addTilesetImage("summer-tileset", "summer-tileset");
  map.createLayer("Ground", tileset, 0, 0);
  map.createLayer("Decoration", tileset, 0, 0);

  scene.physics.world.setBounds(0, 0, layout.world.width, layout.world.height);
  const obstacles = scene.physics.add.staticGroup();
  layout.obstacles.forEach((item) => {
    const zone = scene.add.rectangle(item.x, item.y, item.width, item.height, 0x000000, 0);
    zone.setOrigin(0);
    scene.physics.add.existing(zone, true);
    obstacles.add(zone);
  });
  return { obstacles, worldBounds: layout.world };
}
~~~

GameScene.create debe llamar createGardenMap, createPlayer y physics.add.collider(player, obstacles). La cámara debe seguir a la protagonista y permanecer dentro del mundo:

~~~js
this.physics.add.collider(this.player, mapParts.obstacles);
this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
this.cameras.main.setBounds(0, 0, mapParts.worldBounds.width, mapParts.worldBounds.height);
~~~

El esqueleto de GameScene debe inicializar siempre un estado válido y los controles:

~~~js
init(data) {
  this.state = data.state || createGameState();
  this.controlsLocked = false;
  this.finishing = false;
}

create() {
  const mapParts = createGardenMap(this, GARDEN_LAYOUT);
  this.player = createPlayer(this, GARDEN_LAYOUT.player);
  this.physics.add.collider(this.player, mapParts.obstacles);
  this.cursors = this.input.keyboard.createCursorKeys();
  this.keys = this.input.keyboard.addKeys("W,A,S,D,ENTER,SPACE");
  this.touchControls = new TouchControls(this);
  this.counter = this.add.text(24, 24, "Flores: 0/10", {
    fontSize: "24px",
    color: "#3f2d1d",
    backgroundColor: "#fff7e8",
    padding: { x: 14, y: 9 }
  }).setScrollFactor(0).setDepth(1100);
}
~~~

- [ ] **Step 2: Crear animaciones y movimiento**

Crear src/entities/createPlayer.js:

~~~js
const DIRECTIONS = {
  down: [0, 1, 2],
  left: [3, 4, 5],
  right: [6, 7, 8],
  up: [9, 10, 11]
};

export function createPlayer(scene, position) {
  Object.entries(DIRECTIONS).forEach(([direction, frames]) => {
    const key = "girlfriend-" + direction;
    if (!scene.anims.exists(key)) {
      scene.anims.create({
        key,
        frames: frames.map((frame) => ({ key: "girlfriend", frame })),
        frameRate: 8,
        repeat: -1
      });
    }
  });
  const sprite = scene.physics.add.sprite(position.x, position.y, "girlfriend", 1);
  sprite.body.setSize(18, 20).setOffset(7, 26);
  sprite.setCollideWorldBounds(true);
  sprite.speed = 150;
  sprite.lastDirection = "down";
  return sprite;
}
~~~

GameScene.update debe combinar teclado y entrada táctil:

~~~js
const keyboardX = Number(this.cursors.right.isDown || this.keys.D.isDown)
  - Number(this.cursors.left.isDown || this.keys.A.isDown);
const keyboardY = Number(this.cursors.down.isDown || this.keys.S.isDown)
  - Number(this.cursors.up.isDown || this.keys.W.isDown);
const touch = this.touchControls.getDirection();
const direction = new Phaser.Math.Vector2(keyboardX + touch.x, keyboardY + touch.y);
if (direction.lengthSq() > 0) direction.normalize();
this.player.setVelocity(direction.x * this.player.speed, direction.y * this.player.speed);
~~~

Elegir la animación por el eje con mayor valor absoluto. Si ambos ejes son cero, detener la animación y mostrar el fotograma central correspondiente a lastDirection.

- [ ] **Step 3: Implementar controles táctiles**

Crear src/ui/TouchControls.js:

~~~js
export class TouchControls {
  constructor(scene) {
    this.direction = { x: 0, y: 0 };
    this.interactQueued = false;
    this.objects = [];
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    const addButton = (x, y, label, onDown, onUp) => {
      const button = scene.add.circle(x, y, 32, 0xfff7e8, 0.78)
        .setScrollFactor(0)
        .setDepth(1000)
        .setInteractive();
      const text = scene.add.text(x, y, label, {
        fontSize: "28px",
        color: "#4c3825"
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
      button.on("pointerdown", onDown);
      button.on("pointerup", onUp);
      button.on("pointerout", onUp);
      this.objects.push(button, text);
    };
    addButton(78, 458, "←", () => { this.direction.x = -1; }, () => { this.direction.x = 0; });
    addButton(142, 458, "→", () => { this.direction.x = 1; }, () => { this.direction.x = 0; });
    addButton(110, 426, "↑", () => { this.direction.y = -1; }, () => { this.direction.y = 0; });
    addButton(110, 490, "↓", () => { this.direction.y = 1; }, () => { this.direction.y = 0; });
    addButton(880, 462, "♥", () => { this.interactQueued = true; }, () => {});
  }

  getDirection() {
    return { ...this.direction };
  }

  consumeInteract() {
    const queued = this.interactQueued;
    this.interactQueued = false;
    return queued;
  }

  destroy() {
    this.objects.forEach((object) => object.destroy());
  }
}
~~~

Cada botón mide 64x64 píxeles. No requiere CSS adicional porque los controles viven dentro del lienzo y solo se crean en dispositivos con puntero grueso.

- [ ] **Step 4: Verificar manualmente ambos controles**

Con npm run dev:

- WASD y flechas mueven a la protagonista.
- Las diagonales no son más rápidas.
- Árboles, agua y cercas bloquean el paso.
- La cámara no revela espacio fuera del mapa.
- La emulación táctil permite completar el recorrido.

- [ ] **Step 5: Verificar compilación y commit**

Run: npm test

Expected: PASS.

Run: npm run build

Expected: PASS.

~~~bash
git add src/entities src/ui src/map/createGardenMap.js src/scenes/GameScene.js src/styles.css
git commit -m "feat: add playable garden exploration"
~~~

### Task 6: Conejo, diálogo y flores

**Files:**

- Create: src/entities/createRabbitNpc.js
- Create: src/entities/createFlowers.js
- Create: src/ui/DialogueBox.js
- Modify: src/scenes/GameScene.js

**Interfaces:**

- Consumes: content, gameState, dialogueFlow y GARDEN_LAYOUT.
- Produces: interacción con conejo, contador 0/10 a 10/10 y evento game-completed.

- [ ] **Step 1: Crear NPC y rango de interacción**

Crear src/entities/createRabbitNpc.js:

~~~js
export function createRabbitNpc(scene, position) {
  const sprite = scene.physics.add.staticSprite(position.x, position.y, "rabbit", 0);
  return {
    sprite,
    isPlayerNearby(player) {
      return Phaser.Math.Distance.Between(
        sprite.x,
        sprite.y,
        player.x,
        player.y
      ) <= 72;
    }
  };
}
~~~

Importar Phaser en ese módulo. GameScene debe crear un texto “Hablar” con scrollFactor 0 y ocultarlo cuando isPlayerNearby sea false. Enter, Espacio o consumeInteract abre el diálogo.

- [ ] **Step 2: Crear DialogueBox**

Crear src/ui/DialogueBox.js:

~~~js
import { advanceDialogue, createDialogue } from "../core/dialogueFlow.js";

export class DialogueBox {
  constructor(scene, onClosed) {
    this.scene = scene;
    this.onClosed = onClosed;
    this.flow = createDialogue([]);
    this.panel = scene.add.rectangle(480, 438, 820, 150, 0xfff7e8, 0.96)
      .setScrollFactor(0).setDepth(1200).setStrokeStyle(4, 0xe6b83f).setVisible(false);
    this.name = scene.add.text(100, 382, "Conejo", {
      fontSize: "22px",
      color: "#5a3b24"
    }).setScrollFactor(0).setDepth(1201).setVisible(false);
    this.text = scene.add.text(100, 420, "", {
      fontSize: "21px",
      color: "#3f2d1d",
      wordWrap: { width: 760 }
    }).setScrollFactor(0).setDepth(1201).setVisible(false);
  }

  open(lines) {
    this.flow = createDialogue(lines);
    [this.panel, this.name, this.text].forEach((object) => object.setVisible(true));
    this.text.setText(this.flow.lines[0] || "");
  }

  advance() {
    this.flow = advanceDialogue(this.flow);
    if (this.flow.finished) {
      this.close();
      return;
    }
    this.text.setText(this.flow.lines[this.flow.index]);
  }

  close() {
    [this.panel, this.name, this.text].forEach((object) => object.setVisible(false));
    this.onClosed();
  }

  get isOpen() {
    return this.panel.visible;
  }
}
~~~

GameScene bloquea movimiento mientras dialogueBox.isOpen sea true. Cuando cierre el primer diálogo, reemplaza this.state con markDialogueSeen(this.state).

- [ ] **Step 3: Crear flores recolectables**

Crear src/entities/createFlowers.js:

~~~js
export function createFlowers(scene, flowerPositions) {
  const group = scene.physics.add.staticGroup();
  flowerPositions.forEach((flower) => {
    const sprite = group.create(flower.x, flower.y, "yellow-flower");
    sprite.setData("flowerId", flower.id);
  });
  return group;
}
~~~

Crear el overlap en GameScene:

~~~js
this.physics.add.overlap(this.player, this.flowers, (_player, flower) => {
  const nextState = collectFlower(this.state, flower.getData("flowerId"));
  if (nextState === this.state) return;
  this.state = nextState;
  flower.destroy();
  this.counter.setText("Flores: " + this.state.flowerIds.length + "/10");
  this.tweens.add({
    targets: this.counter,
    scale: 1.18,
    yoyo: true,
    duration: 120
  });
  if (this.state.gameCompleted) this.finishGame();
});
~~~

- [ ] **Step 4: Conectar la victoria**

Implementar finishGame una sola vez:

~~~js
finishGame() {
  if (this.finishing) return;
  this.finishing = true;
  this.controlsLocked = true;
  this.player.setVelocity(0, 0);
  this.time.delayedCall(800, () => {
    this.cameras.main.fadeOut(600, 255, 247, 232);
  });
  this.cameras.main.once("camerafadeoutcomplete", () => {
    this.scene.start("bouquet", { state: this.state });
  });
}
~~~

Antes del fade, crear diez imágenes petal alrededor de la protagonista y animarlas con tweens de posición, rotación y alfa durante 800 ms.

- [ ] **Step 5: Verificación**

Run: npm test

Expected: PASS, incluida la prueba de duplicados y victoria única.

Verificación manual: hablar con el conejo, recoger diez flores, intentar atravesar una flor recogida y confirmar que el contador nunca supera 10/10.

- [ ] **Step 6: Commit**

~~~bash
git add src/entities src/ui/DialogueBox.js src/scenes/GameScene.js
git commit -m "feat: add rabbit dialogue and flower collection"
~~~

### Task 7: Ramo, carta y reinicio

**Files:**

- Modify: src/scenes/BouquetScene.js
- Modify: src/scenes/LetterScene.js
- Modify: src/config/content.js
- Create: tests/core/restartFlow.test.js

**Interfaces:**

- Consumes: estado completo, ASSETS.bouquet, ASSETS.petal y content.letter.
- Produces: transición bouquet a letter y reinicio limpio hacia game.

- [ ] **Step 1: Escribir la prueba fallida del reinicio**

Crear tests/core/restartFlow.test.js:

~~~js
import { describe, expect, it } from "vitest";
import { createGameState, resetGameState } from "../../src/core/gameState.js";

describe("restart flow", () => {
  it("crea una sesión nueva después del final", () => {
    const finished = {
      flowerIds: Array.from({ length: 10 }, (_, index) => "flower-" + (index + 1)),
      dialogueSeen: true,
      gameCompleted: true
    };
    expect(resetGameState(finished)).toEqual(createGameState());
  });
});
~~~

Run: npm test -- tests/core/restartFlow.test.js

Expected: PASS con la implementación de Task 2; esta prueba fija el contrato del flujo final.

- [ ] **Step 2: Implementar BouquetScene**

Implementar src/scenes/BouquetScene.js:

~~~js
import Phaser from "phaser";

export class BouquetScene extends Phaser.Scene {
  constructor() {
    super("bouquet");
  }

  init(data) {
    this.state = data.state;
  }

  create() {
    this.cameras.main.setBackgroundColor("#fff2c6");
    const bouquet = this.add.image(480, 260, "bouquet").setScale(0.25).setAlpha(0);
    const button = this.add.rectangle(480, 455, 290, 64, 0xf4c542)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });
    const label = this.add.text(480, 455, "Ver mi mensaje", {
      fontSize: "27px",
      color: "#3f2d1d"
    }).setOrigin(0.5).setAlpha(0);

    for (let index = 0; index < 18; index += 1) {
      const petal = this.add.image(480, 250, "petal").setScale(0.6);
      this.tweens.add({
        targets: petal,
        x: Phaser.Math.Between(170, 790),
        y: Phaser.Math.Between(70, 470),
        angle: Phaser.Math.Between(-160, 160),
        alpha: 0,
        duration: Phaser.Math.Between(800, 1400)
      });
    }

    this.tweens.add({
      targets: bouquet,
      scale: 1,
      alpha: 1,
      duration: 900,
      ease: "Back.Out",
      onComplete: () => {
        this.tweens.add({ targets: [button, label], alpha: 1, duration: 250 });
      }
    });
    button.on("pointerup", () => this.scene.start("letter", { state: this.state }));
  }
}
~~~

- [ ] **Step 3: Implementar LetterScene**

Implementar src/scenes/LetterScene.js:

~~~js
import Phaser from "phaser";
import { CONTENT } from "../config/content.js";
import { resetGameState } from "../core/gameState.js";

export class LetterScene extends Phaser.Scene {
  constructor() {
    super("letter");
  }

  init(data) {
    this.state = data.state;
  }

  createButton(x, label, callback) {
    const button = this.add.rectangle(x, 470, 250, 56, 0xf4c542)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, 470, label, {
      fontSize: "21px",
      color: "#3f2d1d"
    }).setOrigin(0.5);
    button.on("pointerup", callback);
    return button;
  }

  create() {
    this.cameras.main.setBackgroundColor("#f5df9c");
    this.add.rectangle(480, 260, 780, 440, 0xfffbef)
      .setStrokeStyle(5, 0xe6b83f);
    this.add.text(480, 100, "Para ti, mi amor", {
      fontFamily: "Georgia, serif",
      fontSize: "40px",
      color: "#6b3c2a"
    }).setOrigin(0.5);
    const body = this.add.text(170, 160, "", {
      fontFamily: "Georgia, serif",
      fontSize: "23px",
      color: "#4a3426",
      wordWrap: { width: 620 },
      lineSpacing: 8
    });

    let index = 0;
    this.time.addEvent({
      delay: 28,
      repeat: CONTENT.letter.length - 1,
      callback: () => {
        index += 1;
        body.setText(CONTENT.letter.slice(0, index));
        if (index === CONTENT.letter.length) {
          this.createButton(330, "Ver el ramo otra vez", () => {
            this.scene.start("bouquet", { state: this.state });
          });
          this.createButton(630, "Jugar de nuevo", () => {
            this.scene.start("game", { state: resetGameState(this.state) });
          });
        }
      }
    });
  }
}
~~~

- [ ] **Step 4: Verificación del flujo completo**

Run: npm test

Expected: PASS.

Run: npm run build

Expected: PASS.

Completar una partida en escritorio y otra con emulación móvil. Confirmar orden game, bouquet, letter; confirmar que ambos botones finales funcionan y que reiniciar restaura las diez flores.

- [ ] **Step 5: Commit**

~~~bash
git add src/scenes/BouquetScene.js src/scenes/LetterScene.js src/config/content.js tests/core/restartFlow.test.js
git commit -m "feat: add bouquet and final letter"
~~~

### Task 8: Accesibilidad, errores y entrega

**Files:**

- Modify: index.html
- Modify: src/styles.css
- Modify: src/scenes/MenuScene.js
- Modify: src/scenes/GameScene.js
- Modify: src/scenes/BouquetScene.js
- Modify: src/scenes/LetterScene.js
- Create: README.md

**Interfaces:**

- Consumes: aplicación completa.
- Produces: build final y guía de ejecución.

- [ ] **Step 1: Ajustar accesibilidad**

Añadir al estado de carga aria-live="polite" y role="status". Añadir debajo del lienzo un párrafo con “Mover: WASD o flechas · Interactuar: Enter o Espacio”. Mantener contraste mínimo de 4.5:1 en texto HTML y foco visible:

~~~css
#loading-status,
.game-help {
  color: #4a3426;
  background: #fff7e8;
}

:focus-visible {
  outline: 3px solid #b47a00;
  outline-offset: 3px;
}
~~~

En Phaser, asegurar áreas interactivas mínimas equivalentes a 44x44 píxeles y permitir Enter en los botones de menú, ramo y carta además de pointerup.

- [ ] **Step 2: Añadir README**

Documentar:

- npm install
- npm run dev
- npm test
- npm run build
- ubicación de assets originales y personalizados
- edición de diálogos en src/config/content.js
- controles de teclado y táctiles
- requisito de conservar la licencia del pack

- [ ] **Step 3: Ejecutar verificación automatizada final**

Run: npm test

Expected: todos los tests PASS.

Run: npm run build

Expected: dist generado sin errores ni referencias a archivos faltantes.

- [ ] **Step 4: Ejecutar verificación manual final**

Probar en Chrome a 1366x768, emulación 390x844 y orientación horizontal 844x390. Completar el juego en cada tamaño. Confirmar texto legible, controles utilizables, diez flores, cero zanahorias, conejo interactivo, ramo, carta y reinicio.

- [ ] **Step 5: Inspeccionar cambios**

Run: git status --short

Expected: solo archivos deliberados del proyecto.

Run: git diff --check

Expected: sin errores de espacios.

- [ ] **Step 6: Commit**

~~~bash
git add index.html src README.md
git commit -m "docs: finish game setup and verification"
~~~
