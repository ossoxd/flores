import { MICKY_RACE as C } from '../config/micky.js';

export function createRaceState() {
  return { phase: 'INTRO', playerX: 0, catX: 0, playerSpeed: C.minSpeed,
    catSpeed: C.catSpeed * C.difficulty, winner: null, elapsed: 0 };
}

export function startRace(state) {
  return state.phase === 'INTRO' || state.phase === 'COUNTDOWN'
    ? { ...state, phase: 'RACING' } : state;
}

export function tapRace(state) {
  return state.phase === 'RACING'
    ? { ...state, playerSpeed: Math.min(C.maxSpeed, state.playerSpeed + C.impulse) } : state;
}

export function advanceRace(state, dtSeconds, catVariation = 0) {
  if (state.phase !== 'RACING') return state;
  const dt = Math.max(0, Math.min(.05, Number.isFinite(dtSeconds) ? dtSeconds : 0));
  const catSpeed = Math.max(0, (C.catSpeed + Math.max(-C.catVariation, Math.min(C.catVariation, catVariation))) * C.difficulty);
  const playerSpeed = Math.max(C.minSpeed, state.playerSpeed - C.friction * dt);
  const playerX = Math.min(C.distance, state.playerX + (state.playerSpeed + playerSpeed) * .5 * dt);
  const catX = Math.min(C.distance, state.catX + catSpeed * dt);
  const playerCross = playerX >= C.distance;
  const catCross = catX >= C.distance;
  let winner = null;
  if (playerCross && catCross) {
    const playerTime = (C.distance - state.playerX) / Math.max(.001, (state.playerSpeed + playerSpeed) * .5);
    const catTime = (C.distance - state.catX) / Math.max(.001, catSpeed);
    winner = playerTime <= catTime ? 'player' : 'cat';
  } else if (playerCross) winner = 'player';
  else if (catCross) winner = 'cat';
  return { ...state, playerX, catX, playerSpeed, catSpeed, elapsed: state.elapsed + dt,
    winner, phase: winner ? 'FINISHING' : 'RACING' };
}

export function hasMickyReward(state) {
  return (state.keyFragments ?? []).includes(C.rewardId);
}

export function awardMickyFragment(state) {
  if (hasMickyReward(state)) return state;
  return { ...state, keyFragments: [...(state.keyFragments ?? []), C.rewardId] };
}
