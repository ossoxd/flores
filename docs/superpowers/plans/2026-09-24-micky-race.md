# Micky Race Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Micky to the new island and a full-screen side-view click-to-accelerate race that grants her key fragment after either outcome.

**Architecture:** Keep tuning and dialogue in `src/config/micky.js`, deterministic race state and reward logic in `src/core/mickyRace.js`, map-NPC construction in `src/entities/createMickyNpc.js`, and Phaser rendering/input in `src/scenes/MickyRaceScene.js`. `GameScene` only wires NPC dialogue, pause/resume and idempotent reward, following Canelo's scene pattern.

**Tech Stack:** Existing browser-native ES modules, Phaser 4.2.1, Node test runner, pixel-art assets, no new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-24-micky-race-design.md`

## Global Constraints

- 960 × 540 Phaser canvas, nearest-neighbor pixel rendering; race art occupies the full canvas, without side instruction panels.
- Micky uses the user's calico photo for sprite identity and the supplied six-face sheet for dialogue; generated game sprites remain visibly pixelated and consistently aligned.
- User's ten-line Anto/Micky introduction and the two exact post-race Micky lines are authoritative; no optional introduction lines.
- Both victory and defeat grant `keyFragments` ID `micky` once. No game-over, no mandatory replay, no browser-reload persistence.
- Do not alter bouquet/final-scene behavior or the other three NPCs' rewards.
- Mouse/touch `pointerdown` is the primary input; holding does not repeat, pre-start and post-finish input is ignored.
- Existing repo has no `HEAD` and all project files are untracked. Do not create a misleading spec-only or partial initial commit; leave task changes uncommitted unless the user establishes a baseline.

## Review Focus

1. Rapid double taps and mouse/touch overlap: one pointerdown gives exactly one impulse; holding gives none.
2. Large or paused-frame `deltaTime`: clamp integration so return from a background tab does not teleport a runner.
3. Both racers crossing in one frame: use interpolated crossing times, never event/update ordering, to pick the winner.
4. Exiting mid-countdown or mid-confetti: timers, listeners and particles must be cleaned without granting a key.
5. Revisiting Micky after either outcome: no race and no duplicate key, even if the player clicks quickly through the reward screen.

---

## File map

- Create `src/config/micky.js`: position, dialogue copy, all race tuning and reward ID.
- Create `src/core/mickyRace.js`: pure transitions, speed integration, crossing-order decision and fragment award.
- Create `src/entities/createMickyNpc.js`: 64 px game sprites, stable paw baseline, idle animation and collision.
- Create `src/scenes/MickyRaceScene.js`: full-screen track, camera, pointer input, countdown, result, dialogue, confetti, reward and teardown.
- Create `public/assets/custom/micky/micky-idle.png`, `micky-run.png`, `micky-portraits.png` (or local JS data-URL modules if controlled-folder writes block PNGs): project-bound pixel assets.
- Modify `src/config/assets.js`, `src/ui/DialogueBox.js`, `src/scenes/GameScene.js`, `src/main.js` to load/wire Micky and her scene.
- Create `tests/core/mickyRace.test.js`, `tests/micky-playtest.html`; modify `tests/config/assets.test.js` and map tests only where a real boundary needs coverage.

### Task 1: Deterministic race and reward core

**Files:** Create `src/config/micky.js`, `src/core/mickyRace.js`, `tests/core/mickyRace.test.js`.

**Interfaces:** `MICKY`, `MICKY_RACE`; `createRaceState()`, `startRace(state)`, `tapRace(state)`, `advanceRace(state, dtSeconds, catVariation)`, `hasMickyReward(gameState)`, `awardMickyFragment(gameState)`.

- [ ] **Step 1: Write failing tests** for intro/countdown tap rejection, one-click impulse, frictive movement and caps, 0.05 s stepping at 3/5/7/8 taps/s, cat variation bounded, simultaneous crossing order and idempotent reward. Use seeded cat variations and literal expected outcome bands; do not assert internal helpers. Example:

```js
test('tap changes speed only while racing and a release without taps slows Anto', () => {
  const waiting = createRaceState();
  assert.deepEqual(tapRace(waiting), waiting);
  const running = startRace(waiting);
  const tapped = tapRace(running);
  assert.ok(tapped.playerSpeed > running.playerSpeed);
  const coasted = advanceRace(tapped, 0.5, 0);
  assert.ok(coasted.playerX > tapped.playerX);
  assert.ok(coasted.playerSpeed < tapped.playerSpeed);
});
test('the same race grants Micky only one fragment', () => {
  const once = awardMickyFragment({keyFragments:['tami','coco','canelo']});
  assert.deepEqual(once.keyFragments,['tami','coco','canelo','micky']);
  assert.equal(awardMickyFragment(once),once);
});
```

- [ ] **Step 2: Run** `node --test tests/core/mickyRace.test.js`; verify RED because the module and exports do not exist.
- [ ] **Step 3: Implement** `MICKY` at `{x:1584,y:240}` and exact dialogue from the spec. Initial `MICKY_RACE`: distance `1050`, min speed `28`, max `125`, impulse `14`, friction `66`, cat base `60`, variation `4`, variation interval `1100` ms, countdown `900` ms/step, confetti `2500` ms, reward ID `micky`, difficulty multiplier `1`. `tapRace` adds impulse only in `RACING`; `advanceRace` clamps dt to 0.05 s, integrates both lanes, and compares interpolated time-to-finish when both cross in one step. Keep physics independent of Phaser and do not read random numbers inside core.
- [ ] **Step 4: Run** `node --test tests/core/mickyRace.test.js`, then `npm.cmd test`; adjust the *configuration* against simulated 3/5/7/8 cps until the stipulated bands hold, without changing outcomes based on score.
- [ ] **Step 5: Commit only if a complete user-approved Git baseline exists**; otherwise leave these files uncommitted per Global Constraints.

### Task 2: Pixel sprites and asset loading

**Files:** Create Micky assets under `public/assets/custom/micky/`; modify `src/config/assets.js`, `tests/config/assets.test.js`.

**Interfaces:** Asset keys `micky-idle-source`, `micky-run-source`, `micky-portraits-source`. Task 3 consumes these names.

- [ ] **Step 1: Add an asset-catalog test** that loads `ASSETS` and checks three distinct project-local Micky entries with these keys and nonempty URLs. Run `node --test tests/config/assets.test.js` and confirm RED.
- [ ] **Step 2: Use built-in image generation** with the real photo as identity reference to make two transparent, coarse-pixel sheets: a front-facing idle sequence (rest, blink, short tail motion) and a side-facing run cycle with alternating legs. Keep the orange/black/white markings, identical scale and paw baseline across frames. Inspect at 1× and in-game size; iterate one targeted defect at a time. Use the supplied six-face pixel sheet directly for dialogue, processing only background transparency and equal frame boundaries. Do not generate photorealistic portraits.
- [ ] **Step 3: Persist all chosen assets in the workspace**, register them in `ASSETS`, and document imagegen prompt/mode and paths when handing off. No runtime dependency on temp files or `$CODEX_HOME/generated_images`.
- [ ] **Step 4: Run** `node --test tests/config/assets.test.js` and `npm.cmd run build`; inspect actual alpha and frame dimensions to catch black boxes or clipped whiskers.
- [ ] **Step 5: Commit only if a complete user-approved Git baseline exists**; otherwise leave changes uncommitted.

### Task 3: Micky on the island and in dialogue

**Files:** Create `src/entities/createMickyNpc.js`; modify `src/ui/DialogueBox.js`, `src/scenes/GameScene.js`; create `tests/entities/mickyInteraction.test.js` and browser fixture `tests/micky-playtest.html`.

**Interfaces:** `createMickyNpc(scene)` returns `{sprite,isPlayerNearby}` like Tami. `GameScene.openMickyDialogue()`, `openMickyRace()`, `completeMickyRace()` consume Task 1 and launch Task 4.

- [ ] **Step 1: Write failing tests** that the Micky location is safe ground and reachable from the new bridge, `hasMickyReward` blocks a second award, and nearby interaction opens the ten lines in specified order while a distant player cannot. Run targeted tests and confirm RED.
- [ ] **Step 2: Normalize generated frames** to 64 × 64 with fixed paws at y≈60, using nearest-neighbor. Add front idle animation with restrained blink/tail; set static physics body around feet (`setSize`/`setOffset`) and depth from world y. Use the same interaction radius pattern as Tami.
- [ ] **Step 3: Extend `DialogueBox` face/portrait mapping** for Micky. In `GameScene`, create NPC and prompt, gate interactions against other open UI and the active race scene, show initial lines once, then launch race when dialogue closes. After reward, one short dry repeat line such as «Ya te di lo que querías.»; no race relaunch. Hide prompt while paused and restore map controls on return.
- [ ] **Step 4: Run targeted and full tests**, then inspect Micky at actual map scale and portrait size via the browser fixture. Fix only clipping, blocked path or dialogue mismatches found.
- [ ] **Step 5: Commit only if a complete user-approved Git baseline exists**; otherwise leave changes uncommitted.

### Task 4: Full-screen race scene and input

**Files:** Create `src/scenes/MickyRaceScene.js`; modify `src/main.js`; extend `tests/micky-playtest.html`.

**Interfaces:** Scene key `micky-race`; uses `MICKY_RACE`, Task 1 transitions, Task 2 textures and `DialogueBox`. Calls `this.scene.get('game').completeMickyRace()` only after result dialogue closes.

- [ ] **Step 1: Add browser-fixture checks** for `INTRO → COUNTDOWN → RACING`, zero progress before `¡YA!`, one impulse per separate pointerdown, acceleration/coasting, two-lane separation, camera bounds, bar progress and ignoring taps after `FINISHING`. Run the fixture to observe RED before scene exists.
- [ ] **Step 2: Create a 960 × 540 Phaser scene** with a tiled side-view track wider than the viewport, two lane markings, pixel shoreline/trees in the existing palette, start and finish posts, a small upper progress bar and a large lower `¡CORRER!` button. No side labels/panels. Use `setRoundPixels(true)` and nearest-neighbor textures. Camera follows the average runner x with an ease factor, clamped to world; runners stay in lanes. Fit the button inside the canvas on narrow devices.
- [ ] **Step 3: Implement countdown and input**: use Phaser pointerdown on the button, never `pointermove` or held-state polling; reset any keyboard/touch state on entry; optional Space uses `JustDown`. Set `touch-action:none` only on the canvas/control as needed. Apply speed from Task 1 each update, animate running proportional to speed, add small pooled or self-destroying pixel dust, and sparing cat quips.
- [ ] **Step 4: Run fixture checks and visually inspect** desktop and narrow viewport. Check that Anto and Micky do not shrink, freeze, overlap UI or drift off-screen as camera scrolls.
- [ ] **Step 5: Commit only if a complete user-approved Git baseline exists**; otherwise leave changes uncommitted.

### Task 5: Results, celebration, cleanup and final regression

**Files:** Complete `src/scenes/MickyRaceScene.js`, `src/scenes/GameScene.js`, `tests/core/mickyRace.test.js`, `tests/micky-playtest.html`.

**Interfaces:** `completeMickyRace()` updates the existing `keyCounter` using `awardMickyFragment`, returns actual fragment count; `leave()` resumes `game` and stops `micky-race`.

- [ ] **Step 1: Write failing win/loss integration checks**: both outcomes trigger exactly the appropriate quoted line; only victory emits confetti; both dialogue closures grant the fragment and display current `X / 4`; repeat entry neither opens race nor increments count; an early exit grants nothing. Add a test for both runners crossing in one frame and one for stopping during countdown/confetti.
- [ ] **Step 2: Implement state transitions** `FINISHING → RESULT_DIALOGUE → REWARD → EXIT`. The first crossing freezes the outcome, the second runner approaches for at most ~2 s, and only the winning-Anto branch emits a modest 2.5 s confetti burst from both sides. Use `DialogueBox` for the exact result line, then award once, show the provisional key panel and an explicit continue action. No “Perdiste” state.
- [ ] **Step 3: On shutdown**, remove scene-local pointer listeners, cancel delayed calls and tweens, destroy dust/confetti/temporary UI, reset keys/touch and resume the existing map at the same position. Keep audio as short local WebAudio tones if enabled; do not introduce new sound infrastructure.
- [ ] **Step 4: Run** `npm.cmd test`, `npm.cmd run build`, and `tests/micky-playtest.html` end-to-end in browser for victory, defeat, premature exit and re-entry. Confirm no console errors and visually inspect desktop/mobile. Report where to edit `MICKY_RACE` difficulty, cat speed, click impulse, `MICKY` dialogue and reward ID.
- [ ] **Step 5: Commit only if a complete user-approved Git baseline exists**; otherwise leave changes uncommitted and tell the user why.
