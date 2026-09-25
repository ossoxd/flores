export function hasCocoPuzzleReward(state) {
  return Boolean(state.cocoPuzzleSolved)
    || (state.keyFragments ?? []).includes('coco');
}

export function awardCocoPuzzle(state) {
  if (hasCocoPuzzleReward(state)) return state;
  return {
    ...state,
    cocoPuzzleSolved: true,
    keyFragments: [...(state.keyFragments ?? []), 'coco']
  };
}
