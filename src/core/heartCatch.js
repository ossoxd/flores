import { HEART_CATCH as CONFIG } from '../config/canelo.js';

export function createCatchState() {
  return { hearts: 0, combo: 1, streak: 0, slowUntil: 0, phase: 'playing', shown: [] };
}

export function catchItem(state, type, now) {
  if (type === 'key') {
    return { state: state.phase === 'key' ? { ...state, phase: 'won' } : state, messages: [] };
  }
  if (state.phase !== 'playing') return { state, messages: [] };
  if (type !== 'heart') {
    return { state: { ...state, combo: 1, streak: 0,
      slowUntil: type === 'rock' ? now + CONFIG.rockSlowMs : state.slowUntil }, messages: [] };
  }
  const hearts = state.hearts + 1;
  const streak = state.streak + 1;
  const next = { ...state, hearts, streak, combo: Math.max(1, streak), shown: [...state.shown],
    phase: hearts >= CONFIG.heartGoal ? 'key' : 'playing' };
  const messages = [];
  for (const [kind, number, table] of [
    ['points', hearts, CONFIG.messageMilestones], ['combo', next.combo, CONFIG.comboMilestones]
  ]) {
    const id = `${kind}-${number}`;
    if (table[number] && !next.shown.includes(id)) {
      next.shown.push(id); messages.push(table[number]);
    }
  }
  return { state: next, messages };
}

export function catchDifficulty(hearts) {
  const phase = CONFIG.phases.findLast(phase => hearts >= phase.from) ?? CONFIG.phases[0];
  return { ...phase,
    speed: Math.min(CONFIG.maxFallSpeed, CONFIG.baseFallSpeed * phase.speedFactor),
    interval: CONFIG.spawnInterval * phase.intervalFactor,
    badChance: phase.badChance ?? CONFIG.badItemChance };
}

export function hasCaneloReward(state) {
  return (state.keyFragments ?? []).includes('canelo');
}

export function awardCaneloFragment(state) {
  if (hasCaneloReward(state)) return state;
  return { ...state, keyFragments: [...(state.keyFragments ?? []), 'canelo'] };
}
