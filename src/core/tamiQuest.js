import { TAMI } from '../config/tami.js';

export function isTamiQuizCorrect(answers) {
  return answers.length === TAMI.questions.length
    && TAMI.questions.every((question, index) => answers[index] === question.correct);
}

export function hasTamiReward(state) {
  return (state.keyFragments ?? []).includes('tami');
}

export function awardTamiFragment(state) {
  if (hasTamiReward(state)) return state;
  return { ...state, keyFragments: [...(state.keyFragments ?? []), 'tami'] };
}
