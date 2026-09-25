export function nextSceneFor(state) {
  return state.gameCompleted ? "bouquet" : "game";
}
