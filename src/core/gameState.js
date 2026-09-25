export function createGameState() {
  return { flowerIds: [], dialogueSeen: false, gameCompleted: false, cocoIntroSeen: false, cocoPuzzleSolved: false, maxIntroSeen: false, flowersDelivered: false, maxCleared: false };
}

export function collectFlower(state, flowerId) {
  if (state.gameCompleted || state.flowerIds.includes(flowerId)) {
    return state;
  }

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
